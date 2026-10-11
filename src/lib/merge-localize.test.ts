import { describe, expect, it } from 'vitest'
import { deepMerge } from './merge'
import { pickLocale, pickLocaleList } from './cms/localize'

describe('deepMerge', () => {
  const base = { a: 1, nested: { x: 'x', y: 'y' }, list: [1, 2, 3] }

  it('overlays objects key by key', () => {
    expect(deepMerge(base, { nested: { y: 'Y' } })).toEqual({
      a: 1,
      nested: { x: 'x', y: 'Y' },
      list: [1, 2, 3],
    })
  })
  it('replaces arrays instead of merging them', () => {
    expect(deepMerge(base, { list: [9] }).list).toEqual([9])
  })
  it('does not modify its inputs and tolerates a missing override', () => {
    const copy = JSON.parse(JSON.stringify(base))
    deepMerge(base, { nested: { x: 'changed' } })
    expect(base).toEqual(copy)
    expect(deepMerge(base, undefined)).toBe(base)
  })
})

describe('pickLocale', () => {
  it('returns the requested language when filled in', () => {
    expect(pickLocale({ en: 'Hello', fr: 'Bonjour' }, 'fr')).toBe('Bonjour')
  })
  it('falls back to English when the language is missing or blank', () => {
    expect(pickLocale({ en: 'Hello' }, 'fr')).toBe('Hello')
    expect(pickLocale({ en: 'Hello', fr: '   ' }, 'fr')).toBe('Hello')
  })
  it('accepts plain strings from content saved before translations existed', () => {
    expect(pickLocale('Legacy', 'fr')).toBe('Legacy')
  })
  it('returns undefined when there is nothing', () => {
    expect(pickLocale(undefined, 'fr')).toBeUndefined()
    expect(pickLocale({}, 'fr')).toBeUndefined()
    expect(pickLocale('', 'en')).toBeUndefined()
  })
  it('maps lists and drops empty items', () => {
    expect(pickLocaleList([{ en: 'a', fr: 'A' }, { en: '' }, 'c'], 'fr')).toEqual(['A', 'c'])
    expect(pickLocaleList(undefined, 'fr')).toEqual([])
  })
})
