import { afterEach, describe, expect, it, vi } from 'vitest'
import { getDb } from './db'

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
