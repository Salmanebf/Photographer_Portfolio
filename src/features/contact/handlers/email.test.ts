import { describe, expect, it } from 'vitest'
import { DEFAULT_FROM, emailFrom, emailText } from './email'

describe('emailFrom', () => {
  it('uses the shared test sender until a domain is configured', () => {
    expect(emailFrom({})).toBe(DEFAULT_FROM)
    expect(emailFrom({ CONTACT_FROM_EMAIL: '   ' })).toBe(DEFAULT_FROM)
  })
  it('accepts a plain address or "Name <address>"', () => {
    expect(emailFrom({ CONTACT_FROM_EMAIL: 'hello@alexrivera.film' })).toBe('hello@alexrivera.film')
    expect(emailFrom({ CONTACT_FROM_EMAIL: 'Alex Rivera <hello@alexrivera.film>' })).toBe(
      'Alex Rivera <hello@alexrivera.film>'
    )
  })
  it('ignores a malformed value instead of failing every send', () => {
    for (const bad of ['alexrivera.film', 'Alex <nope>', '<a@b.c>', 'a@b.c, d@e.f']) {
      expect(emailFrom({ CONTACT_FROM_EMAIL: bad })).toBe(DEFAULT_FROM)
    }
  })
})

describe('emailText', () => {
  const base = {
    name: 'Ada',
    email: 'ada@example.com',
    subject: 'Hi',
    message: 'Hello there, friend.',
  }
  it('shows who wrote, the language to reply in, and the message', () => {
    const t = emailText({ ...base, locale: 'fr' })
    expect(t).toContain('From: Ada <ada@example.com>')
    expect(t).toContain('Language: fr')
    expect(t.endsWith('Hello there, friend.')).toBe(true)
  })
  it('lists the extra answers of a richer form', () => {
    const t = emailText({
      ...base,
      kind: 'inquiry',
      details: { date: '2027-03-01', budget: '5k' },
    })
    expect(t).toContain('date: 2027-03-01')
    expect(t).toContain('budget: 5k')
  })
})
