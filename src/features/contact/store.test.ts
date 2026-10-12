import { PGlite } from '@electric-sql/pglite'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { createContactStore } from './store'

const input = {
  name: 'Ada',
  email: 'ada@example.com',
  subject: 'My story',
  message: 'I want a documentary about my paintings.',
}

// An in-process Postgres: real Postgres semantics, no server needed.
// Booting it takes a couple of seconds, so one instance is shared by the file's tests.
let db: PGlite
const freshStore = () => createContactStore(async () => db)

beforeAll(async () => {
  db = await PGlite.create()
}, 60_000)

afterAll(async () => {
  await db.close()
})

// Each test starts from "no table", exactly like a brand-new database.
beforeEach(async () => {
  await db.query('DROP TABLE IF EXISTS contact_messages')
  await db.query('DROP TABLE IF EXISTS contact_rate_limits')
})

describe('contact store (PGlite)', () => {
  it('creates the table on first use and returns the new id', async () => {
    const { id } = await freshStore().insert(input)
    expect(id).toMatch(/^[0-9a-f-]{36}$/)
  })

  it('lists messages newest first with a boolean read flag and ISO dates', async () => {
    const store = freshStore()
    await store.insert({ ...input, subject: 'first' })
    await new Promise((r) => setTimeout(r, 5))
    await store.insert({ ...input, subject: 'second' })
    const list = await store.list()
    expect(list.map((m) => m.subject)).toEqual(['second', 'first'])
    expect(list[0].read).toBe(false)
    expect(list[0].email).toBe('ada@example.com')
    expect(new Date(list[0].createdAt).toISOString()).toBe(list[0].createdAt)
  })

  it('respects the limit', async () => {
    const store = freshStore()
    for (let i = 0; i < 3; i++) await store.insert(input)
    expect(await store.list(2)).toHaveLength(2)
  })

  it('stores hostile input as plain data (no SQL injection)', async () => {
    const store = freshStore()
    await store.insert({
      ...input,
      name: "x'); DROP TABLE contact_messages;--",
    })
    const list = await store.list()
    expect(list).toHaveLength(1)
    expect(list[0].name).toContain('DROP TABLE')
  })

  it("remembers the visitor's language, and null when none was sent", async () => {
    const store = freshStore()
    await store.insert({ ...input, subject: 'with', locale: 'fr' })
    await new Promise((r) => setTimeout(r, 5))
    await store.insert({ ...input, subject: 'without' })
    const list = await store.list()
    expect(list.find((m) => m.subject === 'with')?.locale).toBe('fr')
    expect(list.find((m) => m.subject === 'without')?.locale).toBeNull()
  })

  it('upgrades a table created before the locale column existed, keeping its rows', async () => {
    await db.query(`CREATE TABLE contact_messages (
      id uuid PRIMARY KEY, name text NOT NULL, email text NOT NULL, subject text NOT NULL,
      message text NOT NULL, is_read boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now())`)
    await db.query(
      `INSERT INTO contact_messages (id, name, email, subject, message)
       VALUES (gen_random_uuid(), 'Old', 'old@example.com', 'old', 'an old message here')`
    )
    const store = freshStore()
    await store.insert({ ...input, subject: 'new', locale: 'fr' })
    const list = await store.list()
    expect(list).toHaveLength(2)
    expect(list.find((m) => m.subject === 'old')?.locale).toBeNull()
    expect(list.find((m) => m.subject === 'new')?.locale).toBe('fr')
  })

  it('saves the kind of request and extra answers (for a future booking form), with safe defaults', async () => {
    const store = freshStore()
    await store.insert({ ...input, subject: 'plain' })
    await new Promise((r) => setTimeout(r, 5))
    await store.insert({
      ...input,
      subject: 'rich',
      details: { date: '2027-03-01', budget: '5–10k' },
    })
    const list = await store.list()
    expect(list.find((m) => m.subject === 'plain')).toMatchObject({
      kind: 'inquiry',
      details: null,
    })
    expect(list.find((m) => m.subject === 'rich')?.details).toEqual({
      date: '2027-03-01',
      budget: '5–10k',
    })
  })

  it('upgrades an old table with the kind/details columns too', async () => {
    await db.query(`CREATE TABLE contact_messages (
      id uuid PRIMARY KEY, name text NOT NULL, email text NOT NULL, subject text NOT NULL,
      message text NOT NULL, is_read boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now(), locale text)`)
    await db.query(
      `INSERT INTO contact_messages (id, name, email, subject, message)
       VALUES (gen_random_uuid(), 'Old', 'old@example.com', 'old', 'an old message here')`
    )
    const list = await freshStore().list()
    expect(list[0]).toMatchObject({
      subject: 'old',
      kind: 'inquiry',
      details: null,
    })
  })
})

describe('contact rate-limit counters (PGlite)', () => {
  it('count hits per key within a window, independently per key', async () => {
    const store = freshStore()
    expect((await store.hitRateLimit('a', 60_000)).count).toBe(1)
    expect((await store.hitRateLimit('a', 60_000)).count).toBe(2)
    expect((await store.hitRateLimit('b', 60_000)).count).toBe(1)
  })

  it('report when the window ends, in the future', async () => {
    const { resetAt } = await freshStore().hitRateLimit('a', 60_000)
    expect(resetAt).toBeGreaterThan(Date.now() + 50_000)
    expect(resetAt).toBeLessThanOrEqual(Date.now() + 61_000)
  })

  it('start over once the window has passed', async () => {
    const store = freshStore()
    await store.hitRateLimit('a', 1000)
    await store.hitRateLimit('a', 1000)
    await new Promise((r) => setTimeout(r, 1200))
    expect((await store.hitRateLimit('a', 1000)).count).toBe(1)
  })

  it('count every one of many simultaneous requests exactly once', async () => {
    const store = freshStore()
    await store.hitRateLimit('warm', 60_000) // create the table first
    const counts = await Promise.all(
      Array.from({ length: 20 }, () => store.hitRateLimit('burst', 60_000))
    )
    expect(counts.map((c) => c.count).sort((x, y) => x - y)).toEqual(
      Array.from({ length: 20 }, (_, i) => i + 1)
    )
  })
})
