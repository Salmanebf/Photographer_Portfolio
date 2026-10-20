import { afterEach, describe, expect, it, vi } from 'vitest'
import { databaseHost, getDb, normalizeDatabaseUrl } from './db'

const reset = () => {
  ;(globalThis as { __sql?: unknown }).__sql = undefined
}

describe('getDb', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    reset()
  })

  it('refuses to run in production without DATABASE_URL (no silent data loss)', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('DATABASE_URL', '')
    reset()
    await expect(getDb()).rejects.toThrow(/DATABASE_URL is not set/)
  })

  it('retries after a failed connection attempt instead of caching the failure', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('DATABASE_URL', '')
    reset()
    await expect(getDb()).rejects.toThrow()
    await expect(getDb()).rejects.toThrow() // a fresh attempt, not a stuck promise
  })
})

describe('normalizeDatabaseUrl', () => {
  const neon = 'postgresql://neondb_owner:p%40ss@ep-cool-123-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

  it('spells out the strict mode for the URL Neon gives you, changing nothing else', () => {
    expect(normalizeDatabaseUrl(neon)).toBe(
      'postgresql://neondb_owner:p%40ss@ep-cool-123-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require'
    )
  })
  it('handles the parameter in any position and the weaker spellings', () => {
    expect(normalizeDatabaseUrl('postgres://u:p@h/db?application_name=x&sslmode=require')).toBe('postgres://u:p@h/db?application_name=x&sslmode=verify-full')
    expect(normalizeDatabaseUrl('postgres://u:p@h/db?sslmode=prefer')).toContain('sslmode=verify-full')
    expect(normalizeDatabaseUrl('postgres://u:p@h/db?sslmode=verify-ca')).toContain('sslmode=verify-full')
  })
  it('leaves everything else alone', () => {
    for (const same of [
      'postgres://postgres:pw@127.0.0.1:5432/portfolio', // local, no TLS
      'postgres://u:p@h/db?sslmode=verify-full',
      'postgres://u:p@h/db?sslmode=disable',
      'postgres://u:p@h/db?uselibpqcompat=true&sslmode=require', // explicit opt-in
    ]) {
      expect(normalizeDatabaseUrl(same)).toBe(same)
    }
  })
  it('never touches a password that happens to contain the word', () => {
    const u = 'postgres://u:sslmode=require@h/db'
    expect(normalizeDatabaseUrl(u)).toBe(u)
  })
  it('removes the driver warning for a Neon-style URL', async () => {
    const { parse } = await import('pg-connection-string')
    const warnings: string[] = []
    const onWarning = (w: Error) => warnings.push(w.message)
    process.on('warning', onWarning)
    expect(parse(normalizeDatabaseUrl(neon)).ssl).toBeTruthy() // TLS stays on
    await new Promise((r) => setTimeout(r, 50))
    process.off('warning', onWarning)
    expect(warnings.filter((m) => m.includes('SECURITY WARNING'))).toEqual([])
  })
})

describe('databaseHost', () => {
  it('returns only the server name, never the credentials', () => {
    expect(databaseHost('postgresql://neondb_owner:s3cret!@ep-cool-123-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require')).toBe(
      'ep-cool-123-pooler.eu-central-1.aws.neon.tech'
    )
    expect(databaseHost('postgres://postgres:pw@127.0.0.1:5432/portfolio')).toBe('127.0.0.1')
    expect(databaseHost('postgres://host-only/db')).toBe('host-only')
  })
  it('copes with nonsense', () => {
    expect(databaseHost('not a url')).toBe('unknown host')
  })
})

describe('what the server says about the database it uses', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
    reset()
  })

  it('names the host of DATABASE_URL in the log, and never prints the password', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.stubEnv('DATABASE_URL', 'postgres://someone:topsecretpw@db.example.test:5432/app?sslmode=require')
    reset()
    const client = (await getDb()) as unknown as { end?: () => Promise<void> }
    const lines = info.mock.calls.map((c) => String(c[0]))
    expect(lines.join('\n')).toContain('using PostgreSQL at db.example.test')
    expect(lines.join('\n')).not.toContain('topsecretpw')
    await client.end?.()
  })

  it('says so loudly when it falls back to the built-in development database', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.stubEnv('DATABASE_URL', '')
    vi.stubEnv('NODE_ENV', 'development')
    reset()
    const client = (await getDb()) as unknown as { close?: () => Promise<void> }
    expect(info.mock.calls.map((c) => String(c[0])).join('\n')).toMatch(/not set — using the built-in development database/)
    await client.close?.()
  }, 30_000)
})
