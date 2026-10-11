import type { Locale } from '@/i18n/config'
import type { PhotoSeries, PhotoSeriesTranslation } from '../types'
import { photoSeries } from './en'
import { photoSeries as fr } from './fr'

const translations: Partial<Record<Locale, Record<string, PhotoSeriesTranslation>>> = { fr }

/** The placeholder photo series in one language (English where a translation is missing). */
export function staticPhotoSeries(locale: Locale): PhotoSeries[] {
  const all = translations[locale] ?? {}
  return photoSeries.map((s) => {
    const t = all[s.slug]
    if (!t) return s
    return {
      ...s,
      title: t.title ?? s.title,
      description: t.description ?? s.description,
      location: t.location ?? s.location,
      photos: s.photos.map((p, i) => ({ ...p, ...t.photos?.[i] })),
    }
  })
}
