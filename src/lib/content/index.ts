/**
 * Static (no-CMS) content in every language.
 *
 * English lives in `site.config.ts` and `data.ts`; each other language is a set
 * of overrides laid on top (see `fr.ts`). A missing translation falls back to English.
 */
import { siteConfig } from '../site.config'
import {
  projects as baseProjects,
  fallbackServices,
  fallbackTestimonials,
  type DocumentaryProject,
} from '../data'
import { deepMerge } from '../merge'
import type { Locale } from '@/i18n/config'
import { fr } from './fr'
import type { LocaleContent, Service, SiteSettings, Testimonial } from './types'

export type { SiteSettings, Testimonial, Service, LocaleContent } from './types'

const overrides: Partial<Record<Locale, LocaleContent>> = { fr }

/** A fresh, mutable copy of the English site settings. */
export function baseSettings(): SiteSettings {
  const copy = JSON.parse(JSON.stringify(siteConfig)) as SiteSettings & {
    seo: SiteSettings['seo'] & { siteUrl?: string }
  }
  return copy
}

export function staticSettings(locale: Locale): SiteSettings {
  return deepMerge<SiteSettings>(baseSettings(), overrides[locale]?.site)
}

export function staticProjects(locale: Locale): DocumentaryProject[] {
  const translations = overrides[locale]?.projects ?? {}
  return baseProjects.map((p) => {
    const t = translations[p.slug]
    return t ? { ...p, ...t } : p
  })
}

export function staticServices(locale: Locale): Service[] {
  const translated = overrides[locale]?.services
  return fallbackServices.map((s, i) => ({ ...s, ...translated?.[i] }))
}

export function staticTestimonials(locale: Locale): Testimonial[] {
  const translations = overrides[locale]?.testimonials ?? {}
  return fallbackTestimonials.map((t) => ({ ...t, ...translations[t.id] }))
}
