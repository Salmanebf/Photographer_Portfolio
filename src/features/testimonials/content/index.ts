import type { Locale } from '@/i18n/config'
import type { Testimonial } from '../types'
import { testimonials } from './en'
import { testimonials as fr } from './fr'

const translations: Partial<Record<Locale, Record<string, Partial<Pick<Testimonial, 'role' | 'content'>>>>> = { fr }

/** The placeholder testimonials in one language. */
export function staticTestimonials(locale: Locale): Testimonial[] {
  const t = translations[locale] ?? {}
  return testimonials.map((x) => ({ ...x, ...t[x.id] }))
}
