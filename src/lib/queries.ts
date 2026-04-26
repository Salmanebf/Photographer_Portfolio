/**
 * Data layer with graceful fallback.
 *
 * - When Sanity is configured (NEXT_PUBLIC_SANITY_PROJECT_ID set), data
 *   comes from Sanity Studio.
 * - When it's not, the site falls back to /lib/site.config.ts and /lib/data.ts
 *   so devs can run the site without ever touching a CMS.
 */
import { sanityClient, sanityEnabled, imageUrl } from './sanity.client'
import { siteConfig } from './site.config'
import { projects as fallbackProjects, type DocumentaryProject } from './data'

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  ...,
  "logoImageUrl": logoImage.asset->url,
  "heroImageUrl": heroImage.asset->url,
  "aboutImageUrl": aboutImage.asset->url
}`

const PROJECTS_QUERY = `*[_type == "project"] | order(coalesce(order, 0) asc, year desc){
  _id,
  title,
  "slug": slug.current,
  subtitle,
  category,
  year,
  duration,
  location,
  shortDescription,
  fullDescription,
  awards,
  credits,
  tags,
  video,
  featured,
  "image": image.asset->url,
  "gallery": gallery[].asset->url
}`

const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  subtitle,
  category,
  year,
  duration,
  location,
  shortDescription,
  fullDescription,
  awards,
  credits,
  tags,
  video,
  featured,
  "image": image.asset->url,
  "gallery": gallery[].asset->url
}`

const TESTIMONIALS_QUERY = `*[_type == "testimonial"] | order(coalesce(order, 0) asc){
  _id,
  name,
  role,
  content,
  "project": project->title
}`

const SERVICES_QUERY = `*[_type == "service"] | order(coalesce(order, 0) asc){
  _id,
  title,
  description
}`

/* ============================================================ */
/*  SITE SETTINGS                                                */
/* ============================================================ */

export type SiteSettings = {
  brand: {
    name: string
    discipline: string
    color: string
    logoMark: string
    logoImage: string
  }
  hero: {
    eyebrow: string
    nameLine1: string
    nameLine2: string
    tagline: string
    image: string
    video: string
    stats: { value: number; suffix: string; label: string }[]
  }
  about: {
    quote: { first: string; accent: string }
    image: string
    yearsBadge: string
    paragraphs: string[]
    stats: { value: string; label: string }[]
    tools: string[]
  }
  contact: {
    email: string
    location: string
    responseTime: string
    studioHours: string
    isAvailable: boolean
    availabilityYear: number
    socials: { instagram: string; vimeo: string; letterboxd: string; twitter: string }
  }
  footer: {
    tagline: string
    newsletter: { enabled: boolean; headline: string; description: string }
  }
}

function fromConfig(): SiteSettings {
  return JSON.parse(JSON.stringify(siteConfig)) as SiteSettings
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!sanityEnabled || !sanityClient) return fromConfig()

  try {
    const data = await sanityClient.fetch<any>(SITE_SETTINGS_QUERY)
    if (!data) return fromConfig()

    const merged = fromConfig()
    if (data.brandColor) merged.brand.color = data.brandColor
    if (data.logoMark) merged.brand.logoMark = data.logoMark
    if (data.logoImageUrl) merged.brand.logoImage = data.logoImageUrl
    if (data.discipline) merged.brand.discipline = data.discipline
    if (data.title) merged.brand.name = data.title

    if (data.heroEyebrow) merged.hero.eyebrow = data.heroEyebrow
    if (data.heroNameLine1) merged.hero.nameLine1 = data.heroNameLine1
    if (data.heroNameLine2) merged.hero.nameLine2 = data.heroNameLine2
    if (data.heroTagline) merged.hero.tagline = data.heroTagline
    if (data.heroImageUrl) merged.hero.image = data.heroImageUrl
    if (data.heroVideo) merged.hero.video = data.heroVideo
    if (Array.isArray(data.heroStats) && data.heroStats.length) {
      merged.hero.stats = data.heroStats.map((s: any) => ({
        value: Number(s.value) || 0,
        suffix: s.suffix ?? '',
        label: s.label ?? '',
      }))
    }

    if (data.aboutQuote) {
      const [first, ...rest] = String(data.aboutQuote).split(/(?=,)/)
      merged.about.quote = {
        first: first ?? merged.about.quote.first,
        accent: rest.join('') || merged.about.quote.accent,
      }
    }
    if (data.aboutImageUrl) merged.about.image = data.aboutImageUrl
    if (data.aboutYearsBadge) merged.about.yearsBadge = data.aboutYearsBadge
    if (Array.isArray(data.aboutParagraphs) && data.aboutParagraphs.length) {
      merged.about.paragraphs = data.aboutParagraphs
    }
    if (Array.isArray(data.aboutTools) && data.aboutTools.length) {
      merged.about.tools = data.aboutTools
    }
    if (Array.isArray(data.aboutStats) && data.aboutStats.length) {
      merged.about.stats = data.aboutStats
    }

    if (data.contactEmail) merged.contact.email = data.contactEmail
    if (data.contactLocation) merged.contact.location = data.contactLocation
    if (data.contactResponseTime)
      merged.contact.responseTime = data.contactResponseTime
    if (data.studioHours) merged.contact.studioHours = data.studioHours
    if (typeof data.isAvailable === 'boolean')
      merged.contact.isAvailable = data.isAvailable
    if (data.availabilityYear)
      merged.contact.availabilityYear = data.availabilityYear
    if (data.socialLinks) {
      merged.contact.socials = {
        instagram: data.socialLinks.instagram ?? '',
        vimeo: data.socialLinks.vimeo ?? '',
        letterboxd: data.socialLinks.letterboxd ?? '',
        twitter: data.socialLinks.twitter ?? '',
      }
    }

    if (data.footerTagline) merged.footer.tagline = data.footerTagline

    return merged
  } catch (error) {
    console.warn('[Sanity] siteSettings fetch failed, using fallback config:', error)
    return fromConfig()
  }
}

/* ============================================================ */
/*  PROJECTS                                                     */
/* ============================================================ */

function normalizeSanityProject(p: any): DocumentaryProject {
  return {
    id: p._id ?? p.slug,
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle ?? '',
    category: p.category ?? 'Documentary',
    image: typeof p.image === 'string' ? p.image : imageUrl(p.image) ?? '',
    year: p.year ?? '',
    duration: p.duration ?? '',
    location: p.location ?? '',
    shortDescription: p.shortDescription ?? '',
    fullDescription: p.fullDescription ?? '',
    awards: p.awards ?? [],
    credits: p.credits ?? [],
    gallery: Array.isArray(p.gallery)
      ? p.gallery.map((g: any) => (typeof g === 'string' ? g : imageUrl(g) ?? ''))
      : [],
    tags: p.tags ?? [],
  }
}

export async function getProjects(): Promise<DocumentaryProject[]> {
  if (!sanityEnabled || !sanityClient) return fallbackProjects

  try {
    const data = await sanityClient.fetch<any[]>(PROJECTS_QUERY)
    if (!data || data.length === 0) return fallbackProjects
    return data.map(normalizeSanityProject)
  } catch (error) {
    console.warn('[Sanity] projects fetch failed, using fallback data:', error)
    return fallbackProjects
  }
}

export async function getProjectBySlug(
  slug: string
): Promise<DocumentaryProject | null> {
  if (!sanityEnabled || !sanityClient) {
    return fallbackProjects.find((p) => p.slug === slug) ?? null
  }

  try {
    const data = await sanityClient.fetch<any>(PROJECT_BY_SLUG_QUERY, { slug })
    if (!data) return fallbackProjects.find((p) => p.slug === slug) ?? null
    return normalizeSanityProject(data)
  } catch (error) {
    console.warn('[Sanity] project fetch failed, using fallback data:', error)
    return fallbackProjects.find((p) => p.slug === slug) ?? null
  }
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const projects = await getProjects()
  return projects.map((p) => p.slug)
}

/* ============================================================ */
/*  TESTIMONIALS / SERVICES                                      */
/* ============================================================ */

export type Testimonial = {
  id: string
  name: string
  role: string
  content: string
  project: string
}

import { fallbackTestimonials, fallbackServices } from './data'

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!sanityEnabled || !sanityClient) return fallbackTestimonials

  try {
    const data = await sanityClient.fetch<any[]>(TESTIMONIALS_QUERY)
    if (!data || data.length === 0) return fallbackTestimonials
    return data.map((t) => ({
      id: t._id,
      name: t.name ?? '',
      role: t.role ?? '',
      content: t.content ?? '',
      project: t.project ?? '',
    }))
  } catch (error) {
    console.warn('[Sanity] testimonials fetch failed, using fallback:', error)
    return fallbackTestimonials
  }
}

export async function getServices(): Promise<{ title: string; description: string }[]> {
  if (!sanityEnabled || !sanityClient) return fallbackServices

  try {
    const data = await sanityClient.fetch<any[]>(SERVICES_QUERY)
    if (!data || data.length === 0) return fallbackServices
    return data.map((s) => ({
      title: s.title ?? '',
      description: s.description ?? '',
    }))
  } catch (error) {
    console.warn('[Sanity] services fetch failed, using fallback:', error)
    return fallbackServices
  }
}
