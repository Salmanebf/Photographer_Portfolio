import { describe, expect, it } from 'vitest'
import {
  SESSION_SECONDS,
  adminState,
  createSessionToken,
  passwordMatches,
  safeNext,
  verifySessionToken,
} from './session'

const env = { ADMIN_PASSWORD: 'a-long-enough-password', NODE_ENV: 'production' }
const NOW = 1_800_000_000_000

describe('adminState', () => {
  it('requires sign-in once a long enough password is set', () => {
    expect(adminState(env)).toBe('ok')
    expect(adminState({ ...env, NODE_ENV: 'development' })).toBe('ok')
  })
  it('is closed (pages do not exist) in production with no or a short password', () => {
    expect(adminState({ NODE_ENV: 'production' })).toBe('closed')
    expect(adminState({ NODE_ENV: 'production', ADMIN_PASSWORD: 'short' })).toBe('closed')
    expect(adminState({ NODE_ENV: 'production', ADMIN_PASSWORD: '12345678901' })).toBe('closed')
  })
  it('is open in development with no password, so local work needs no setup', () => {
    expect(adminState({ NODE_ENV: 'development' })).toBe('open')
    expect(adminState({})).toBe('open')
  })
})

describe('session token', () => {
  it('is accepted until it expires, and not after', () => {
    const token = createSessionToken(NOW, env)
    expect(verifySessionToken(token, NOW + 1000, env)).toBe(true)
    expect(verifySessionToken(token, NOW + (SESSION_SECONDS - 5) * 1000, env)).toBe(true)
    expect(verifySessionToken(token, NOW + (SESSION_SECONDS + 5) * 1000, env)).toBe(false)
  })
  it('is refused when changed, forged, empty or malformed', () => {
    const token = createSessionToken(NOW, env)
    const [exp, sig] = token.split('.')
    expect(verifySessionToken(`${Number(exp) + 99999}.${sig}`, NOW, env)).toBe(false) // longer life, same signature
    expect(verifySessionToken(`${exp}.${sig.replace(/.$/, (c) => (c === '0' ? '1' : '0'))}`, NOW, env)).toBe(false)
    for (const bad of [undefined, '', 'x', `${exp}`, `${exp}.`, `.${sig}`, `${exp}.${sig}.extra`, `abc.${sig}`]) {
      expect(verifySessionToken(bad, NOW, env)).toBe(false)
    }
  })
  it('stops working when the password changes (or an explicit session secret changes)', () => {
    const token = createSessionToken(NOW, env)
    expect(verifySessionToken(token, NOW, { ...env, ADMIN_PASSWORD: 'another-long-password' })).toBe(false)
    const withSecret = { ...env, ADMIN_SESSION_SECRET: 's1' }
    const t2 = createSessionToken(NOW, withSecret)
    expect(verifySessionToken(t2, NOW, withSecret)).toBe(true)
    expect(verifySessionToken(t2, NOW, { ...withSecret, ADMIN_SESSION_SECRET: 's2' })).toBe(false)
  })
  it('never validates when no usable password is configured', () => {
    const token = createSessionToken(NOW, env)
    expect(verifySessionToken(token, NOW, { NODE_ENV: 'production' })).toBe(false)
    expect(verifySessionToken(createSessionToken(NOW, {}), NOW, {})).toBe(false)
  })
})

describe('passwordMatches', () => {
  it('accepts only the exact password', () => {
    expect(passwordMatches('a-long-enough-password', env)).toBe(true)
    expect(passwordMatches('a-long-enough-passwor', env)).toBe(false)
    expect(passwordMatches('', env)).toBe(false)
  })
  it('accepts nothing when no password is configured', () => {
    expect(passwordMatches('', { NODE_ENV: 'production' })).toBe(false)
  })
})

describe('safeNext (where sign-in may lead)', () => {
  it('allows the owner pages', () => {
    expect(safeNext('/studio')).toBe('/studio')
    expect(safeNext('/studio/structure/project')).toBe('/studio/structure/project')
    expect(safeNext('/admin/messages')).toBe('/admin/messages')
  })
  it('falls back to the inbox for anything else, including other sites', () => {
    for (const bad of ['https://evil.example', '//evil.example', '/\\evil', '/en', '/studio//evil.example', '/studioX', undefined, 5, '']) {
      expect(safeNext(bad)).toBe('/admin/messages')
    }
  })
})
