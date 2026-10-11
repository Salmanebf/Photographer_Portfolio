import type { Locale } from '@/i18n/config'
import type { Service } from '../types'
import { services } from './en'
import { services as fr } from './fr'

const translations: Partial<Record<Locale, Service[]>> = { fr }

/** The placeholder services in one language (same order in every language). */
export function staticServices(locale: Locale): Service[] {
  const t = translations[locale]
  return services.map((s, i) => ({ ...s, ...t?.[i] }))
}
