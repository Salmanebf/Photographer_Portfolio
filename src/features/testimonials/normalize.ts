import type { Locale } from '@/i18n/config'
import { pickLocale } from '@/lib/cms/localize'
import type { Testimonial } from './types'

export function normalizeSanityTestimonial(t: any, locale: Locale): Testimonial {
  return {
    id: t._id,
    name: t.name ?? '',
    role: pickLocale(t.role, locale) ?? '',
    content: pickLocale(t.content, locale) ?? '',
    project: pickLocale(t.project, locale) ?? '',
  }
}
