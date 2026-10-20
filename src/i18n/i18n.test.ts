import { describe, expect, it } from 'vitest'
import { defaultLocale, dirOf, isLocale, locales } from './config'
import { negotiateLocale, parseAcceptLanguage } from './negotiate'
import { localizedAlternates, localizedPath } from './seo'

describe('config', () => {
  it('knows its languages', () => {
    expect(locales).toEqual(['en', 'fr'])
    expect(defaultLocale).toBe('en')
    expect(isLocale('fr')).toBe(true)
    expect(isLocale('de')).toBe(false)
    expect(isLocale(undefined)).toBe(false)
  })
  it('reads right-to-left languages from the list (Arabic is prepared)', () => {
    expect(dirOf('en')).toBe('ltr')
    expect(dirOf('fr')).toBe('ltr')
    expect(dirOf('ar')).toBe('rtl')
  })
})

describe('parseAcceptLanguage', () => {
  it('orders by quality and keeps header order for ties', () => {
    expect(parseAcceptLanguage('en;q=0.5, fr-CA, de;q=0.9')).toEqual(['fr-ca', 'de', 'en'])
  })
  it('ignores wildcards, q=0 and junk', () => {
    expect(parseAcceptLanguage('*;q=0.8, fr;q=0, en')).toEqual(['en'])
    expect(parseAcceptLanguage('')).toEqual([])
    expect(parseAcceptLanguage(null)).toEqual([])
  })
})

describe('negotiateLocale', () => {
  it('prefers the saved choice over the browser', () => {
    expect(negotiateLocale({ cookie: 'en', acceptLanguage: 'fr' })).toBe('en')
    expect(negotiateLocale({ cookie: 'fr', acceptLanguage: 'en' })).toBe('fr')
  })
  it('ignores an invalid cookie', () => {
    expect(negotiateLocale({ cookie: 'xx', acceptLanguage: 'fr' })).toBe('fr')
  })
  it('matches regional variants to the base language', () => {
    expect(negotiateLocale({ acceptLanguage: 'fr-CA,fr;q=0.9,en;q=0.8' })).toBe('fr')
    expect(negotiateLocale({ acceptLanguage: 'fr-BE' })).toBe('fr')
  })
  it('takes the first supported language the browser lists', () => {
    expect(negotiateLocale({ acceptLanguage: 'de,es;q=0.9,fr;q=0.8,en;q=0.7' })).toBe('fr')
  })
  it('falls back to the default when nothing matches', () => {
    expect(negotiateLocale({ acceptLanguage: 'de,ja' })).toBe('en')
    expect(negotiateLocale({})).toBe('en')
  })
})

describe('seo helpers', () => {
  it('builds language-prefixed paths', () => {
    expect(localizedPath('/', 'fr')).toBe('/fr')
    expect(localizedPath('/work/abc', 'en')).toBe('/en/work/abc')
  })
  it('builds canonical + hreflang alternates incl. x-default', () => {
    const a = localizedAlternates('https://example.com/', '/work/abc', 'fr')
    expect(a.canonical).toBe('https://example.com/fr/work/abc')
    expect(a.languages).toEqual({
      en: 'https://example.com/en/work/abc',
      fr: 'https://example.com/fr/work/abc',
      'x-default': 'https://example.com/en/work/abc',
    })
  })
})
