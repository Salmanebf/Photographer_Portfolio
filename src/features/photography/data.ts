import { cache } from 'react'
import { defaultLocale, type Locale } from '@/i18n/config'
import { cmsFetch } from '@/lib/cms/fetch'
import { staticPhotoSeries } from './content'
import { normalizeSanityPhotoSeries } from './normalize'
import type { PhotoSeries } from './types'

const PHOTO_SERIES_QUERY = `*[_type == "photoSeries"] | order(coalesce(order, 0) asc, year desc){
  _id,
  title,
  "slug": slug.current,
  description,
  location,
  year,
  featured,
  "cover": coverImage.asset->url,
  "relatedProject": relatedProject->slug.current,
  "photos": photos[]{
    "src": image.asset->url,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height,
    alt,
    caption
  }
}`

/** All photo series in one language: the CMS when configured, else (or on any problem) the placeholders. */
export const getPhotoSeries = cache(async function getPhotoSeries(
  locale: Locale
): Promise<PhotoSeries[]> {
  try {
    const data = await cmsFetch<unknown[]>(PHOTO_SERIES_QUERY)
    if (!data || data.length === 0) return staticPhotoSeries(locale)
    return data.map((s) => normalizeSanityPhotoSeries(s, locale))
  } catch (error) {
    console.warn('[Sanity] photo series fetch failed, using fallback data:', error)
    return staticPhotoSeries(locale)
  }
})

/** One series by slug; like films, it exists exactly when it is in the list. */
export const getPhotoSeriesBySlug = cache(async function getPhotoSeriesBySlug(
  slug: string,
  locale: Locale
): Promise<PhotoSeries | null> {
  return (await getPhotoSeries(locale)).find((s) => s.slug === slug) ?? null
})

/** Slugs are the same in every language. */
export const getAllPhotoSeriesSlugs = cache(async function getAllPhotoSeriesSlugs(): Promise<string[]> {
  return (await getPhotoSeries(defaultLocale)).map((s) => s.slug)
})
