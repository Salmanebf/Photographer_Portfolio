import { describe, expect, it } from 'vitest'
import { contactSchema } from './schema'
import { isContactErrorCode } from './error-codes'

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

  it('reports validation problems as stable codes', () => {
    const code = (patch: object) => {
      const r = contactSchema.safeParse({ ...valid, ...patch })
      return r.success ? null : r.error.issues[0].message
    }
    expect(code({ name: '' })).toBe('name_required')
    expect(code({ name: 'x'.repeat(101) })).toBe('name_too_long')
    expect(code({ email: 'nope' })).toBe('email_invalid')
    expect(code({ subject: '' })).toBe('subject_required')
    expect(code({ message: 'short' })).toBe('message_too_short')
    expect(code({ message: 'x'.repeat(5001) })).toBe('message_too_long')
  })

  it('every code the schema can produce is a known error code', () => {
    for (const code of ['name_required', 'name_too_long', 'email_invalid', 'email_too_long', 'subject_required', 'subject_too_long', 'message_too_short', 'message_too_long']) {
      expect(isContactErrorCode(code)).toBe(true)
    }
    expect(isContactErrorCode('Invalid input: expected string')).toBe(false)
  })

  it('accepts a supported language and rejects an unsupported one', () => {
    expect(contactSchema.safeParse({ ...valid, locale: 'fr' }).success).toBe(true)
    expect(contactSchema.safeParse({ ...valid, locale: 'de' }).success).toBe(false)
    expect(contactSchema.safeParse(valid).success).toBe(true) // optional
  })
})
