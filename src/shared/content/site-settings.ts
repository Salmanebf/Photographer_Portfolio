import { cache } from 'react'
import type { Locale } from '@/i18n/config'
import { cmsFetch } from '@/lib/cms/fetch'
import { deepMerge } from '@/lib/merge'
import { siteConfig } from '@/lib/site.config'
import { site as siteFr } from '@/lib/content/fr'
import { applySanitySettings } from './normalize'
import type { SiteSettings } from './types'

export type { SiteSettings } from './types'

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  ...,
  "logoImageUrl": logoImage.asset->url,
  "heroImageUrl": heroImage.asset->url,
  "aboutImageUrl": aboutImage.asset->url,
  "seoImageUrl": seoImage.asset->url
}`

const overrides: Partial<Record<Locale, typeof siteFr>> = { fr: siteFr }

/** A fresh, mutable copy of the English site settings. */
export function baseSettings(): SiteSettings {
  return JSON.parse(JSON.stringify(siteConfig)) as SiteSettings
}

/** Site settings from the code files only (no CMS), in one language. */
export function staticSettings(locale: Locale): SiteSettings {
  return deepMerge<SiteSettings>(baseSettings(), overrides[locale])
}

/** Site settings in one language: the CMS when configured, else (or on any problem) the static content. */
export const getSiteSettings = cache(async function getSiteSettings(
  locale: Locale
): Promise<SiteSettings> {
  const base = staticSettings(locale)
  try {
    const data = await cmsFetch<unknown>(SITE_SETTINGS_QUERY)
    return data ? applySanitySettings(base, data, locale) : base
  } catch (error) {
    console.warn('[Sanity] siteSettings fetch failed, using fallback config:', error)
    return base
  }
})
