import { getRequestConfig } from 'next-intl/server'
import { defaultLocale, isLocale } from './config'
import { deepMerge } from '@/lib/merge'

type Messages = Record<string, unknown>

/**
 * Messages for a request: the default language underneath, the requested
 * language on top — so a string missing from a translation shows in English
 * instead of breaking the page.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = isLocale(requested) ? requested : defaultLocale

  const base = (await import('../messages/en.json')).default as Messages
  let messages = base
  if (locale !== defaultLocale) {
    try {
      const over = (await import(`../messages/${locale}.json`)).default as Messages
      messages = deepMerge(base, over)
    } catch {
      console.warn(`[i18n] no messages file for "${locale}", using ${defaultLocale}`)
    }
  }
  return { locale, messages }
})
