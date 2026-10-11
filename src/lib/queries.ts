/**
 * Data layer with graceful fallback — every getter takes the visitor's language.
 *
 * - When Sanity is configured (NEXT_PUBLIC_SANITY_PROJECT_ID set), data
 *   comes from Sanity Studio, in the requested language (English where a
 *   translation is missing).
 * - When it's not, the site falls back to the static content in
 *   /lib/site.config.ts, /lib/data.ts and /lib/content/<language>.ts so devs
 *   can run the site without ever touching a CMS.
 */
import { cache } from 'react'
import { defaultLocale, type Locale } from '@/i18n/config'
import { sanityClient, sanityEnabled } from './sanity.client'
import type { DocumentaryProject } from './data'
import {
  staticProjects,
  staticServices,
  staticSettings,
  staticTestimonials,
  type Service,
  type SiteSettings,
  type Testimonial,
} from './content'
import {
  applySanitySettings,
  normalizeSanityProject,
  normalizeSanityService,
  normalizeSanityTestimonial,
} from './sanity-normalize'

export type { SiteSettings, Testimonial, Service }

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  ...,
  "logoImageUrl": logoImage.asset->url,
  "heroImageUrl": heroImage.asset->url,
  "aboutImageUrl": aboutImage.asset->url
}`

const PROJECT_FIELDS = `
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
  preview,
  featured,
  "image": image.asset->url,
  "gallery": gallery[].asset->url`

const PROJECTS_QUERY = `*[_type == "project"] | order(coalesce(order, 0) asc, year desc){${PROJECT_FIELDS}
}`

const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && slug.current == $slug][0]{${PROJECT_FIELDS}
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

export const getSiteSettings = cache(async function getSiteSettings(
  locale: Locale
): Promise<SiteSettings> {
  const base = staticSettings(locale)
  if (!sanityEnabled || !sanityClient) return base

  try {
    const data = await sanityClient.fetch<any>(SITE_SETTINGS_QUERY)
    if (!data) return base
    return applySanitySettings(base, data, locale)
  } catch (error) {
    console.warn('[Sanity] siteSettings fetch failed, using fallback config:', error)
    return base
  }
})

/* ============================================================ */
/*  PROJECTS                                                     */
/* ============================================================ */

export const getProjects = cache(async function getProjects(
  locale: Locale
): Promise<DocumentaryProject[]> {
  if (!sanityEnabled || !sanityClient) return staticProjects(locale)

  try {
    const data = await sanityClient.fetch<any[]>(PROJECTS_QUERY)
    if (!data || data.length === 0) return staticProjects(locale)
    return data.map((p) => normalizeSanityProject(p, locale))
  } catch (error) {
    console.warn('[Sanity] projects fetch failed, using fallback data:', error)
    return staticProjects(locale)
  }
})

export const getProjectBySlug = cache(async function getProjectBySlug(
  slug: string,
  locale: Locale
): Promise<DocumentaryProject | null> {
  const fallback = () => staticProjects(locale).find((p) => p.slug === slug) ?? null
  if (!sanityEnabled || !sanityClient) return fallback()

  try {
    const data = await sanityClient.fetch<any>(PROJECT_BY_SLUG_QUERY, { slug })
    if (!data) return fallback()
    return normalizeSanityProject(data, locale)
  } catch (error) {
    console.warn('[Sanity] project fetch failed, using fallback data:', error)
    return fallback()
  }
})

/** Slugs are the same in every language. */
export const getAllProjectSlugs = cache(async function getAllProjectSlugs(): Promise<string[]> {
  const projects = await getProjects(defaultLocale)
  return projects.map((p) => p.slug)
})

/* ============================================================ */
/*  TESTIMONIALS / SERVICES                                      */
/* ============================================================ */

export const getTestimonials = cache(async function getTestimonials(
  locale: Locale
): Promise<Testimonial[]> {
  if (!sanityEnabled || !sanityClient) return staticTestimonials(locale)

  try {
    const data = await sanityClient.fetch<any[]>(TESTIMONIALS_QUERY)
    if (!data || data.length === 0) return staticTestimonials(locale)
    return data.map((t) => normalizeSanityTestimonial(t, locale))
  } catch (error) {
    console.warn('[Sanity] testimonials fetch failed, using fallback:', error)
    return staticTestimonials(locale)
  }
})

export const getServices = cache(async function getServices(
  locale: Locale
): Promise<Service[]> {
  if (!sanityEnabled || !sanityClient) return staticServices(locale)

  try {
    const data = await sanityClient.fetch<any[]>(SERVICES_QUERY)
    if (!data || data.length === 0) return staticServices(locale)
    return data.map((s) => normalizeSanityService(s, locale))
  } catch (error) {
    console.warn('[Sanity] services fetch failed, using fallback:', error)
    return staticServices(locale)
  }
})
