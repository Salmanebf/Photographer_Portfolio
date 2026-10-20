import { defaultLocale, locales, type Locale } from './config'

/** Public base URL without trailing slash. */
export const siteBase = (url: string) => url.replace(/\/+$/, '')

/** `/fr/work/slug` for a locale-less path like `/work/slug` (or `/`). */
export function localizedPath(path: string, locale: Locale): string {
  const clean = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  return `/${locale}${clean}`
}

/**
 * Canonical URL + hreflang alternates for a page, including `x-default`
 * (pointing at the default language).
 */
export function localizedAlternates(baseUrl: string, path: string, locale: Locale) {
  const base = siteBase(baseUrl)
  const languages: Record<string, string> = {}
  for (const l of locales) languages[l] = `${base}${localizedPath(path, l)}`
  languages['x-default'] = `${base}${localizedPath(path, defaultLocale)}`
  return { canonical: `${base}${localizedPath(path, locale)}`, languages }
}
