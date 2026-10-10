import { describe, expect, it } from 'vitest'
import { contactSchema } from './schema'

const valid = {
  name: ' Ada ',
  email: 'ada@example.com',
  subject: 'A story',
  message: 'I would like to tell my story.',
}

describe('contactSchema', () => {
  it('accepts valid input and trims strings', () => {
    const r = contactSchema.safeParse(valid)
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.name).toBe('Ada')
  })

  it.each([
    ['name', { name: '' }],
    ['email', { email: 'not-an-email' }],
    ['subject', { subject: '' }],
    ['message too short', { message: 'short' }],
    ['message too long', { message: 'x'.repeat(5001) }],
  ])('rejects invalid %s', (_label, patch) => {
    expect(contactSchema.safeParse({ ...valid, ...patch }).success).toBe(false)
  })

  it('keeps the honeypot field optional', () => {
    expect(contactSchema.safeParse({ ...valid, website: 'spam' }).success).toBe(true)
  })
})
