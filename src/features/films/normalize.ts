import type { Locale } from '@/i18n/config'
import { pickLocale } from '@/lib/cms/localize'
import { imageUrl } from '@/lib/cms/client'
import type { DocumentaryProject } from './types'


/** A CMS film document → a film in one language (English where a translation is missing). */
export function normalizeSanityProject(p: any, locale: Locale): DocumentaryProject {
  const text = (v: unknown) => pickLocale(v, locale) ?? ''
  return {
    id: p._id ?? p.slug,
    slug: p.slug,
    title: text(p.title),
    subtitle: text(p.subtitle),
    category: p.category ?? 'other',
    image: typeof p.image === 'string' ? p.image : imageUrl(p.image) ?? '',
    year: p.year ?? '',
    duration: p.duration ?? '',
    location: text(p.location),
    shortDescription: text(p.shortDescription),
    fullDescription: text(p.fullDescription),
    awards: Array.isArray(p.awards) ? p.awards.filter(Boolean) : [],
    credits: Array.isArray(p.credits)
      ? p.credits.map((c: any) => ({ role: text(c.role), name: c.name ?? '' }))
      : [],
    gallery: Array.isArray(p.gallery)
      ? p.gallery.map((g: any) => (typeof g === 'string' ? g : imageUrl(g) ?? ''))
      : [],
    tags: Array.isArray(p.tags) ? p.tags : [],
    video: p.video || undefined,
    preview: p.preview || undefined,
    featured: Boolean(p.featured),
  }
}
