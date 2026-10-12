/**
 * Turns the CMS "Site Settings" document into `SiteSettings`, in one language.
 * Pure (no network) so it can be tested without a CMS. Empty CMS fields keep
 * the placeholder/base value; a missing translation falls back to English.
 */
import type { Locale } from '@/i18n/config'
import { pickLocale, pickLocaleList } from '@/lib/cms/localize'
import type { SiteSettings } from './types'

export function applySanitySettings(base: SiteSettings, data: any, locale: Locale): SiteSettings {
  const merged: SiteSettings = JSON.parse(JSON.stringify(base))
  const text = (v: unknown) => pickLocale(v, locale)

  if (data.brandColor) merged.brand.color = data.brandColor
  if (data.logoMark) merged.brand.logoMark = data.logoMark
  if (data.logoImageUrl) merged.brand.logoImage = data.logoImageUrl
  if (text(data.discipline)) merged.brand.discipline = text(data.discipline)!
  if (data.title) merged.brand.name = data.title

  if (text(data.seoTitle)) merged.seo.title = text(data.seoTitle)!
  if (text(data.seoDescription)) merged.seo.description = text(data.seoDescription)!
  const keywords = pickLocaleList(data.seoKeywords, locale)
  if (keywords.length) merged.seo.keywords = keywords
  // Social image: the one chosen for sharing, else the hero image (as the Studio says)
  if (data.seoImageUrl) merged.seo.ogImage = data.seoImageUrl
  else if (data.heroImageUrl) merged.seo.ogImage = data.heroImageUrl

  if (text(data.heroEyebrow)) merged.hero.eyebrow = text(data.heroEyebrow)!
  if (data.heroNameLine1) merged.hero.nameLine1 = data.heroNameLine1
  if (data.heroNameLine2) merged.hero.nameLine2 = data.heroNameLine2
  if (text(data.heroHeadline)) merged.hero.headline = text(data.heroHeadline)!
  if (text(data.heroTagline)) merged.hero.tagline = text(data.heroTagline)!
  if (data.heroImageUrl) merged.hero.image = data.heroImageUrl
  if (data.heroVideo) merged.hero.video = data.heroVideo
  const quote = text(data.aboutQuote)
  if (quote) {
    const [first, ...rest] = quote.split(/(?=,)/)
    merged.about.quote = {
      first: first ?? merged.about.quote.first,
      accent: rest.join(''),
    }
  }
  if (data.aboutImageUrl) merged.about.image = data.aboutImageUrl
  if (data.aboutYearsBadge) merged.about.yearsBadge = data.aboutYearsBadge
  const paragraphs = pickLocaleList(data.aboutParagraphs, locale)
  if (paragraphs.length) merged.about.paragraphs = paragraphs
  const tools = pickLocaleList(data.aboutTools, locale)
  if (tools.length) merged.about.tools = tools
  if (Array.isArray(data.aboutStats) && data.aboutStats.length) {
    merged.about.stats = data.aboutStats.map((s: any) => ({
      value: String(s.value ?? ''),
      label: text(s.label) ?? '',
    }))
  }

  // An editor who clears the list on purpose wants the band hidden, so an
  // explicitly saved (even empty) list replaces the placeholder awards.
  if (Array.isArray(data.recognitions)) {
    merged.recognitions = pickLocaleList(data.recognitions, locale)
  }
  if (Array.isArray(data.processSteps) && data.processSteps.length) {
    merged.process = data.processSteps
      .map((s: any) => ({ title: text(s.title) ?? '', description: text(s.description) ?? '' }))
      .filter((s: { title: string }) => s.title)
  }

  if (data.contactEmail) merged.contact.email = data.contactEmail
  if (text(data.contactLocation)) merged.contact.location = text(data.contactLocation)!
  if (text(data.contactResponseTime)) merged.contact.responseTime = text(data.contactResponseTime)!
  if (text(data.studioHours)) merged.contact.studioHours = text(data.studioHours)!
  if (typeof data.isAvailable === 'boolean') merged.contact.isAvailable = data.isAvailable
  if (data.availabilityYear) merged.contact.availabilityYear = data.availabilityYear
  if (data.socialLinks) {
    merged.contact.socials = {
      instagram: data.socialLinks.instagram ?? '',
      vimeo: data.socialLinks.vimeo ?? '',
      letterboxd: data.socialLinks.letterboxd ?? '',
      twitter: data.socialLinks.twitter ?? '',
    }
  }

  if (text(data.footerTagline)) merged.footer.tagline = text(data.footerTagline)!

  return merged
}
