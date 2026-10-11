import { createClient } from '@libsql/client'
import { describe, expect, it } from 'vitest'
import { createContactStore } from './store'

const input = {
  name: 'Ada',
  email: 'ada@example.com',
  subject: 'My story',
  message: 'I want a documentary about my paintings.',
}

const freshStore = () => createContactStore(createClient({ url: ':memory:' }))

describe('contact store', () => {
  it('creates the table on first use and returns the new id', async () => {
    const store = freshStore()
    const { id } = await store.insert(input)
    expect(id).toMatch(/^[0-9a-f-]{36}$/)
  })

  it('lists messages newest first with a boolean read flag', async () => {
    const store = freshStore()
    await store.insert({ ...input, subject: 'first' })
    await new Promise((r) => setTimeout(r, 5))
    await store.insert({ ...input, subject: 'second' })
    const list = await store.list()
    expect(list.map((m) => m.subject)).toEqual(['second', 'first'])
    expect(list[0].read).toBe(false)
    expect(list[0].email).toBe('ada@example.com')
  })

  it('respects the limit', async () => {
    const store = freshStore()
    for (let i = 0; i < 3; i++) await store.insert(input)
    expect(await store.list(2)).toHaveLength(2)
  })

  it('stores values safely (no SQL injection through fields)', async () => {
    const store = freshStore()
    await store.insert({ ...input, name: "x'); DROP TABLE contact_messages;--" })
    expect(await store.list()).toHaveLength(1)
  })
})
