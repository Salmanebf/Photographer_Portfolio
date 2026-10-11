/**
 * Turns raw Sanity documents into the shapes the pages use, in one language.
 * Pure functions (no network) so they can be tested without a CMS.
 *
 * Translatable CMS fields hold `{ en, fr }`; `pickLocale` returns the wanted
 * language and falls back to English. Plain strings (older content) still work.
 */
import type { Locale } from '@/i18n/config'
import type { DocumentaryProject } from './data'
import type { Service, SiteSettings, Testimonial } from './content/types'
import { pickLocale, pickLocaleList } from './localize'
import { imageUrl } from './sanity.client'

export function applySanitySettings(
  base: SiteSettings,
  data: any,
  locale: Locale
): SiteSettings {
  const merged: SiteSettings = JSON.parse(JSON.stringify(base))
  const text = (v: unknown) => pickLocale(v, locale)

  if (data.brandColor) merged.brand.color = data.brandColor
  if (data.logoMark) merged.brand.logoMark = data.logoMark
  if (data.logoImageUrl) merged.brand.logoImage = data.logoImageUrl
  if (text(data.discipline)) merged.brand.discipline = text(data.discipline)!
  if (data.title) merged.brand.name = data.title

  if (text(data.seoTitle)) merged.seo.title = text(data.seoTitle)!
  if (text(data.seoDescription)) merged.seo.description = text(data.seoDescription)!

  if (text(data.heroEyebrow)) merged.hero.eyebrow = text(data.heroEyebrow)!
  if (data.heroNameLine1) merged.hero.nameLine1 = data.heroNameLine1
  if (data.heroNameLine2) merged.hero.nameLine2 = data.heroNameLine2
  if (text(data.heroTagline)) merged.hero.tagline = text(data.heroTagline)!
  if (data.heroImageUrl) merged.hero.image = data.heroImageUrl
  if (data.heroVideo) merged.hero.video = data.heroVideo
  if (Array.isArray(data.heroStats) && data.heroStats.length) {
    merged.hero.stats = data.heroStats.map((s: any) => ({
      value: Number(s.value) || 0,
      suffix: s.suffix ?? '',
      label: text(s.label) ?? '',
    }))
  }

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

  if (data.contactEmail) merged.contact.email = data.contactEmail
  if (text(data.contactLocation)) merged.contact.location = text(data.contactLocation)!
  if (text(data.contactResponseTime))
    merged.contact.responseTime = text(data.contactResponseTime)!
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

export function normalizeSanityTestimonial(t: any, locale: Locale): Testimonial {
  return {
    id: t._id,
    name: t.name ?? '',
    role: pickLocale(t.role, locale) ?? '',
    content: pickLocale(t.content, locale) ?? '',
    project: pickLocale(t.project, locale) ?? '',
  }
}

export function normalizeSanityService(s: any, locale: Locale): Service {
  return {
    title: pickLocale(s.title, locale) ?? '',
    description: pickLocale(s.description, locale) ?? '',
  }
}
