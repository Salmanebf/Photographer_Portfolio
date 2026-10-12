import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  checkMemoryRateLimit as checkRateLimit,
  checkRateLimit as checkSharedRateLimit, checkLoginAttempts,
  getClientIp,
  resetRateLimit,
} from './rate-limit'

beforeEach(resetRateLimit)

describe('checkRateLimit', () => {
  it('allows 5 requests per IP per window, then blocks', () => {
    for (let i = 0; i < 5; i++) expect(checkRateLimit('1.1.1.1').allowed).toBe(true)
    expect(checkRateLimit('1.1.1.1').allowed).toBe(false)
  })

  it('tracks IPs independently', () => {
    for (let i = 0; i < 5; i++) checkRateLimit('1.1.1.1')
    expect(checkRateLimit('2.2.2.2').allowed).toBe(true)
  })

  it('applies a global ceiling across IPs', () => {
    for (let i = 0; i < 60; i++) checkRateLimit(`10.0.0.${i}`)
    expect(checkRateLimit('9.9.9.9').allowed).toBe(false)
  })
})

describe('getClientIp', () => {
  const h = (o: Record<string, string>) => new Headers(o)

  it('prefers x-real-ip', () => {
    expect(getClientIp(h({ 'x-real-ip': '1.2.3.4', 'x-forwarded-for': '9.9.9.9' }))).toBe('1.2.3.4')
  })

  it('uses the right-most x-forwarded-for entry (the spoof-resistant one)', () => {
    expect(getClientIp(h({ 'x-forwarded-for': '6.6.6.6, 5.5.5.5' }))).toBe('5.5.5.5')
  })

  it('falls back to "unknown"', () => {
    expect(getClientIp(h({}))).toBe('unknown')
  })
})

describe('checkRateLimit (database-backed)', () => {
  /** A fake store that counts like the real one */
  const counting = () => {
    const hits = new Map<string, number>()
    return {
      hits,
      hitRateLimit: async (key: string) => {
        hits.set(key, (hits.get(key) ?? 0) + 1)
        return { count: hits.get(key)!, resetAt: Date.now() + 60_000 }
      },
    }
  }

  it('allows 5 per visitor then blocks, and never stores the address in readable form', async () => {
    const store = counting()
    for (let i = 0; i < 5; i++)
      expect((await checkSharedRateLimit('1.1.1.1', store)).allowed).toBe(true)
    expect((await checkSharedRateLimit('1.1.1.1', store)).allowed).toBe(false)
    expect([...store.hits.keys()].some((k) => k.includes('1.1.1.1'))).toBe(false)
  })

  it('applies the global ceiling across visitors', async () => {
    const store = counting()
    for (let i = 0; i < 60; i++) await checkSharedRateLimit(`10.0.0.${i}`, store)
    expect((await checkSharedRateLimit('9.9.9.9', store)).allowed).toBe(false)
  })

  it('falls back to the in-memory limit when the database is down, so the form keeps working', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const broken = {
      hitRateLimit: async () => Promise.reject(new Error('db down')),
    }
    for (let i = 0; i < 5; i++)
      expect((await checkSharedRateLimit('7.7.7.7', broken)).allowed).toBe(true)
    expect((await checkSharedRateLimit('7.7.7.7', broken)).allowed).toBe(false)
    warn.mockRestore()
  })
})

describe('checkLoginAttempts', () => {
  const counting = () => {
    const hits = new Map<string, number>()
    return {
      hits,
      hitRateLimit: async (key: string) => {
        hits.set(key, (hits.get(key) ?? 0) + 1)
        return { count: hits.get(key)!, resetAt: Date.now() + 600_000 }
      },
    }
  }
  it('allows 10 attempts then blocks, separately from the contact form counters', async () => {
    const store = counting()
    for (let i = 0; i < 10; i++) expect((await checkLoginAttempts('1.1.1.1', store)).allowed).toBe(true)
    expect((await checkLoginAttempts('1.1.1.1', store)).allowed).toBe(false)
    expect((await checkLoginAttempts('2.2.2.2', store)).allowed).toBe(true)
    expect([...store.hits.keys()].every((k) => k.startsWith('login:ip:'))).toBe(true)
  })
  it('still limits when the database is down', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const broken = { hitRateLimit: async () => Promise.reject(new Error('down')) }
    for (let i = 0; i < 10; i++) expect((await checkLoginAttempts('8.8.8.8', broken)).allowed).toBe(true)
    expect((await checkLoginAttempts('8.8.8.8', broken)).allowed).toBe(false)
    warn.mockRestore()
  })
})
