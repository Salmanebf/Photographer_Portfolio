import { describe, expect, it, vi } from 'vitest'
import { submitContact } from './service'
import type { ContactHandler } from './handlers/types'

const input = {
  name: 'Ada',
  email: 'ada@example.com',
  subject: 'Hi',
  message: 'A long enough message.',
}

const make = (over: Partial<ContactHandler>): ContactHandler => ({
  name: 'h',
  critical: false,
  handle: async () => {},
  ...over,
})

describe('submitContact', () => {
  it('runs handlers in order and returns the first id', async () => {
    const order: string[] = []
    const r = await submitContact(input, [
      make({ name: 'a', handle: async () => { order.push('a'); return { id: '1' } } }),
      make({ name: 'b', handle: async () => { order.push('b'); return { id: '2' } } }),
    ])
    expect(order).toEqual(['a', 'b'])
    expect(r.id).toBe('1')
  })

  it('propagates a critical failure and stops', async () => {
    const later = vi.fn()
    await expect(
      submitContact(input, [
        make({ critical: true, handle: async () => { throw new Error('db down') } }),
        make({ handle: later }),
      ])
    ).rejects.toThrow('db down')
    expect(later).not.toHaveBeenCalled()
  })

  it('swallows a non-critical failure and continues', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const r = await submitContact(input, [
      make({ handle: async () => { throw new Error('smtp') } }),
      make({ handle: async () => ({ id: 'ok' }) }),
    ])
    expect(r.id).toBe('ok')
    spy.mockRestore()
  })
})
