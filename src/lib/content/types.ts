import type { DocumentaryProject } from '../data'

/** Everything the page needs about the site, already in one language. */
export type SiteSettings = {
  brand: {
    name: string
    discipline: string
    color: string
    logoMark: string
    logoImage: string
  }
  seo: {
    title: string
    description: string
    keywords: string[]
    ogImage: string
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
  }
}

export type Testimonial = {
  id: string
  name: string
  role: string
  content: string
  project: string
}

export type Service = { title: string; description: string }

/** The translatable fields of a film (everything else is shared by all languages). */
export type ProjectTranslation = Partial<
  Pick<
    DocumentaryProject,
    | 'title'
    | 'subtitle'
    | 'location'
    | 'duration'
    | 'shortDescription'
    | 'fullDescription'
    | 'awards'
    | 'credits'
    | 'tags'
  >
>

/**
 * One language's static content, laid over the English base. Anything left out
 * falls back to English, so a translation can be completed gradually.
 */
export type LocaleContent = {
  site?: import('../merge').DeepPartial<SiteSettings>
  /** keyed by project slug */
  projects?: Record<string, ProjectTranslation>
  /** same order as the English list */
  services?: Service[]
  /** keyed by testimonial id */
  testimonials?: Record<string, Partial<Pick<Testimonial, 'role' | 'content'>>>
}
