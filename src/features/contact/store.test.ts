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
    await store.insert({ ...input, name: "x'); DROP TABLE contact_messages;--" })
    const list = await store.list()
    expect(list).toHaveLength(1)
    expect(list[0].name).toContain('DROP TABLE')
  })
})
