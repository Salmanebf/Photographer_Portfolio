import type { Locale } from '@/i18n/config'
import { pickLocale } from '@/lib/cms/localize'
import type { Service } from './types'

export function normalizeSanityService(s: any, locale: Locale): Service {
  return {
    title: pickLocale(s.title, locale) ?? '',
    description: pickLocale(s.description, locale) ?? '',
  }
}
