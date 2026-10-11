import { afterAll, beforeAll, describe, expect, it } from 'vitest'

/**
 * Integration test against a REAL Postgres server, using the same code path as
 * production (`DATABASE_URL` → `pg` pool). Skipped unless TEST_DATABASE_URL is set:
 *
 *   TEST_DATABASE_URL=postgres://user:pass@127.0.0.1:5432/dbname npm test
 *
 * It drops and recreates the `contact_messages` table — use a throwaway database.
 */
const url = process.env.TEST_DATABASE_URL
const input = { name: 'Ada', email: 'ada@example.com', subject: 'Hi', message: 'A long enough message.' }

describe.skipIf(!url)('contact store (real Postgres via DATABASE_URL)', () => {
  let getDb: typeof import('@/lib/db').getDb
  let createContactStore: typeof import('./store').createContactStore

  const resetClient = () => {
    ;(globalThis as { __sql?: unknown }).__sql = undefined
  }

  beforeAll(async () => {
    process.env.DATABASE_URL = url
    resetClient()
    ;({ getDb } = await import('@/lib/db'))
    ;({ createContactStore } = await import('./store'))
    await (await getDb()).query('DROP TABLE IF EXISTS contact_messages')
  })

  afterAll(async () => {
    const client = (await getDb()) as unknown as { end?: () => Promise<void> }
    await client.end?.()
    resetClient()
  })

  it('inserts and lists through the pg pool', async () => {
    const store = createContactStore()
    const { id } = await store.insert(input)
    const list = await store.list()
    expect(list.some((m) => m.id === id && m.read === false)).toBe(true)
  })

  it('survives many requests creating the table at the same instant', async () => {
    await (await getDb()).query('DROP TABLE IF EXISTS contact_messages')
    // Separate store instances = separate "first request" races, like parallel serverless instances.
    const results = await Promise.all(
      Array.from({ length: 12 }, () => createContactStore().insert(input))
    )
    expect(new Set(results.map((r) => r.id)).size).toBe(12)
    expect(await createContactStore().list(100)).toHaveLength(12)
  })

  it('reports an unreachable database as an error and recovers once it is reachable', async () => {
    const good = process.env.DATABASE_URL
    process.env.DATABASE_URL = 'postgres://nobody:wrong@127.0.0.1:1/none'
    resetClient()
    await expect(createContactStore().insert(input)).rejects.toThrow()
    process.env.DATABASE_URL = good
    resetClient()
    await expect(createContactStore().insert(input)).resolves.toHaveProperty('id')
  })
})
