import { defaultLocale, isLocale, locales, type Locale } from './config'

/**
 * Parse an `Accept-Language` header into language tags ordered by preference.
 * "fr-CA,fr;q=0.9,en;q=0.8" -> ["fr-ca", "fr", "en"]
 */
export function parseAcceptLanguage(header: string | null | undefined): string[] {
  if (!header) return []
  return header
    .split(',')
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(';')
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith('q='))
      const weight = q ? Number(q.slice(2)) : 1
      return { tag: tag.trim().toLowerCase(), weight: Number.isFinite(weight) ? weight : 0, index }
    })
    .filter((x) => x.tag && x.tag !== '*' && x.weight > 0)
    .sort((a, b) => b.weight - a.weight || a.index - b.index)
    .map((x) => x.tag)
}

/**
 * Which language to send a visitor to from `/`:
 * 1. their saved choice (cookie), 2. the browser's preference, 3. the default.
 */
export function negotiateLocale(input: {
  cookie?: string | null
  acceptLanguage?: string | null
}): Locale {
  if (isLocale(input.cookie)) return input.cookie

  for (const tag of parseAcceptLanguage(input.acceptLanguage)) {
    const exact = locales.find((l) => l === tag)
    if (exact) return exact
    const base = tag.split('-')[0]
    const byBase = locales.find((l) => l === base)
    if (byBase) return byBase
  }
  return defaultLocale
}
