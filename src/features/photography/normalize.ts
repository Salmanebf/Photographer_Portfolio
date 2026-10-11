import type { Locale } from '@/i18n/config'
import { pickLocale } from '@/lib/cms/localize'
import type { Photo, PhotoSeries } from './types'

/** A CMS photo-series document → a series in one language (English where a translation is missing). */
export function normalizeSanityPhotoSeries(s: any, locale: Locale): PhotoSeries {
  const title = pickLocale(s.title, locale) ?? ''
  const photos: Photo[] = (Array.isArray(s.photos) ? s.photos : [])
    .filter((p: any) => p?.src)
    .map((p: any) => ({
      src: p.src,
      ...(typeof p.width === 'number' ? { width: p.width } : {}),
      ...(typeof p.height === 'number' ? { height: p.height } : {}),
      alt: pickLocale(p.alt, locale) ?? title,
      ...(pickLocale(p.caption, locale) ? { caption: pickLocale(p.caption, locale) } : {}),
    }))
  return {
    id: s._id ?? s.slug,
    slug: s.slug,
    title,
    ...(pickLocale(s.description, locale) ? { description: pickLocale(s.description, locale) } : {}),
    location: pickLocale(s.location, locale) ?? '',
    year: s.year ?? '',
    cover: s.cover ?? photos[0]?.src ?? '',
    photos,
    ...(s.relatedProject ? { relatedProject: s.relatedProject } : {}),
    featured: Boolean(s.featured),
  }
}
