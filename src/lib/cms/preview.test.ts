import { describe, expect, it } from 'vitest'
import { safeRedirectPath } from './preview'
import { secretsMatch } from '../secrets'

describe('safeRedirectPath', () => {
  it('keeps normal paths on this site, with query and hash', () => {
    expect(safeRedirectPath('/en/work/the-last-craftsman')).toBe('/en/work/the-last-craftsman')
    expect(safeRedirectPath('/fr?x=1#contact')).toBe('/fr?x=1#contact')
    expect(safeRedirectPath('/')).toBe('/')
  })
  it('falls back for anything that could leave the site', () => {
    for (const bad of ['//evil.com', 'https://evil.com', 'http://evil.com/x', '/\\evil.com', '\\\\evil.com', 'javascript:alert(1)', 'evil.com', '', null, undefined]) {
      expect(safeRedirectPath(bad as string | null | undefined), String(bad)).toBe('/')
    }
  })
  it('uses the given fallback', () => {
    expect(safeRedirectPath('//x', '/en')).toBe('/en')
  })
})

describe('secretsMatch', () => {
  it('matches only identical secrets', () => {
    expect(secretsMatch('abc123', 'abc123')).toBe(true)
    expect(secretsMatch('abc123', 'abc124')).toBe(false)
    expect(secretsMatch('', 'abc')).toBe(false)
    expect(secretsMatch('short', 'a-much-longer-secret')).toBe(false)
  })
})
