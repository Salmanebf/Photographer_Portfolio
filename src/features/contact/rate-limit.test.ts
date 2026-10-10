import { beforeEach, describe, expect, it } from 'vitest'
import { checkRateLimit, getClientIp, resetRateLimit } from './rate-limit'

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
