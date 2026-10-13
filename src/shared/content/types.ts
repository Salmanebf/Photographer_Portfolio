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
    /** Image shown when the site is shared on social networks */
    ogImage: string
  }
  hero: {
    /** The big stacked headline (one word per line). */
    headline: string
    tagline: string
    /** Optional dimmed background picture; empty = the default dark background */
    image: string
  }
  about: {
    quote: { first: string; accent: string }
    image: string
    yearsBadge: string
    paragraphs: string[]
    stats: { value: string; label: string }[]
    tools: string[]
  }
  /** Scrolling band of awards / press mentions. Empty = the band is hidden. */
  recognitions: string[]
  /** Timeline steps (how a project comes together) */
  process: { title: string; description: string }[]
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
