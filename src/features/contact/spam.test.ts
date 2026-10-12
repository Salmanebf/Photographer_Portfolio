import { describe, expect, it } from 'vitest'
import { checkSpam, MAX_LINKS, MIN_FORM_MS } from './spam'

const ok = {
  subject: 'My story',
  message: 'I would like to talk about a film.',
  elapsedMs: 20_000,
}

describe('checkSpam', () => {
  it('lets an ordinary message through', () => {
    expect(checkSpam(ok)).toEqual({ ok: true })
  })
  it('lets API users through who send no timing at all', () => {
    expect(checkSpam({ subject: 'x', message: 'a normal message' })).toEqual({
      ok: true,
    })
  })
  it('quietly drops a filled-in honeypot (no hint to the bot)', () => {
    expect(checkSpam({ ...ok, website: 'http://spam.example' })).toEqual({
      ok: false,
      silent: true,
    })
  })
  it('asks a real person to retry when the form was sent faster than a person can write', () => {
    expect(checkSpam({ ...ok, elapsedMs: MIN_FORM_MS - 1 })).toEqual({
      ok: false,
      silent: false,
      code: 'too_fast',
    })
    expect(checkSpam({ ...ok, elapsedMs: MIN_FORM_MS })).toEqual({ ok: true })
  })
  it('allows a few links (a showreel, a website) but not a link farm', () => {
    const links = (n: number) =>
      Array.from({ length: n }, (_, i) => `https://site${i}.example/x`).join(' ')
    expect(checkSpam({ ...ok, message: 'See ' + links(MAX_LINKS) }).ok).toBe(true)
    expect(checkSpam({ ...ok, message: 'See ' + links(MAX_LINKS + 1) })).toEqual({
      ok: false,
      silent: false,
      code: 'too_many_links',
    })
  })
  it('counts www. links and links in the subject too', () => {
    expect(
      checkSpam({
        ...ok,
        subject: 'www.a.com www.b.com',
        message: 'www.c.com and http://d.com',
      }).ok
    ).toBe(false)
  })
})
