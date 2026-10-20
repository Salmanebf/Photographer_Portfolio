import { describe, expect, it } from 'vitest'
import {
  SESSION_SECONDS,
  adminState,
  createSessionToken,
  isOwnerPath,
  passwordMatches,
  resolveNext,
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

describe('isOwnerPath / resolveNext (where sign-in may lead)', () => {
  it('accepts only owner pages', () => {
    for (const ok of ['/admin/messages', '/admin/studio', '/admin/studio/structure/project']) expect(isOwnerPath(ok)).toBe(true)
    for (const bad of ['/studio', '/admin', '/admin/login', 'https://evil.example', '//evil.example', '/\\evil', '/en', '/admin/studio//evil.example', '/admin/studioX', '/admin/studio/../x', '/admin/studio?x=1', undefined, 5, '']) {
      expect(isOwnerPath(bad)).toBe(false)
    }
  })
  it('goes where the page asked, else back to the last owner page, else the inbox', () => {
    expect(resolveNext('/admin/messages', '/admin/studio')).toBe('/admin/messages')
    expect(resolveNext(undefined, '/admin/studio/structure/project')).toBe('/admin/studio/structure/project')
    expect(resolveNext(undefined, undefined)).toBe('/admin/messages')
    expect(resolveNext('https://evil.example', null)).toBe('/admin/messages')
  })
  it('returns deep into the Studio when it was the Studio that asked for sign-in', () => {
    expect(resolveNext('/admin/studio', '/admin/studio/structure/project;abc')).toBe('/admin/studio/structure/project;abc')
    expect(resolveNext('/admin/studio', '/admin/messages')).toBe('/admin/studio')
  })
  it('ignores a forged "last page" that is not an owner page', () => {
    expect(resolveNext(undefined, 'https://evil.example')).toBe('/admin/messages')
    expect(resolveNext('/admin/studio', '/admin/studio/../../evil')).toBe('/admin/studio')
  })
})
