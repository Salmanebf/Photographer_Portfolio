/**
 * The single source of truth for languages.
 *
 * Add a language: append its code to `locales`, add `src/messages/<code>.json`,
 * add its content overrides in `src/lib/content/<code>.ts` and register them in
 * `src/lib/content/index.ts`. Arabic is already prepared: it is listed in
 * `rtlLocales`, and layout direction is derived from that list.
 *
 * Pure module (no framework imports) so the CMS schemas can import it too.
 */

export const locales = ['en', 'fr'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

/** Languages written right-to-left. Not enabled yet (see `locales`). */
export const rtlLocales: readonly string[] = ['ar']

/** Name of each language in that language (for the switcher). */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
}

/** Open Graph locale codes. */
export const ogLocales: Record<Locale, string> = {
  en: 'en_US',
  fr: 'fr_FR',
}

/** Cookie remembering the visitor's choice (read by the `/` redirect). */
export const localeCookie = 'NEXT_LOCALE'

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}

export function dirOf(locale: string): 'ltr' | 'rtl' {
  return rtlLocales.includes(locale) ? 'rtl' : 'ltr'
}
