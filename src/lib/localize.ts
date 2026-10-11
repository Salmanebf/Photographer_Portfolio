import { defaultLocale, type Locale } from '@/i18n/config'

/**
 * Read a translatable CMS value.
 *
 * Translatable fields are stored as `{ en: "…", fr: "…" }`. The wanted language
 * is returned if filled in, otherwise the default language. A plain string
 * (content saved before the field became translatable) is returned as is.
 */
export function pickLocale(value: unknown, locale: Locale): string | undefined {
  if (typeof value === 'string') return value || undefined
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    for (const key of [locale, defaultLocale]) {
      const v = record[key]
      if (typeof v === 'string' && v.trim() !== '') return v
    }
  }
  return undefined
}

/** `pickLocale` for each item of a list; items with no text are dropped. */
export function pickLocaleList(values: unknown, locale: Locale): string[] {
  if (!Array.isArray(values)) return []
  return values.map((v) => pickLocale(v, locale)).filter((v): v is string => v !== undefined)
}
