import { cache } from 'react'
import { defaultLocale, type Locale } from '@/i18n/config'
import { cmsFetch } from '@/lib/cms/fetch'
import { staticProjects } from './content'
import { normalizeSanityProject } from './normalize'
import type { DocumentaryProject } from './types'

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
  previewShape,
  featured,
  "image": image.asset->url,
  "gallery": gallery[].asset->url`

const PROJECTS_QUERY = `*[_type == "project"] | order(coalesce(order, 0) asc, year desc){${PROJECT_FIELDS}
}`

/** All films in one language: the CMS when configured, else (or on any problem) the placeholders. */
export const getProjects = cache(async function getProjects(
  locale: Locale
): Promise<DocumentaryProject[]> {
  try {
    const data = await cmsFetch<unknown[]>(PROJECTS_QUERY)
    if (!data || data.length === 0) return staticProjects(locale)
    return data.map((p) => normalizeSanityProject(p, locale))
  } catch (error) {
    console.warn('[Sanity] projects fetch failed, using fallback data:', error)
    return staticProjects(locale)
  }
})

/**
 * One film by slug. A film exists exactly when it is in the list, so the
 * list page, the film page and the sitemap can never disagree (an unpublished
 * or deleted film is a 404, not a leftover placeholder).
 */
export const getProjectBySlug = cache(async function getProjectBySlug(
  slug: string,
  locale: Locale
): Promise<DocumentaryProject | null> {
  const projects = await getProjects(locale)
  return projects.find((p) => p.slug === slug) ?? null
})

/** Slugs are the same in every language. */
export const getAllProjectSlugs = cache(async function getAllProjectSlugs(): Promise<string[]> {
  const projects = await getProjects(defaultLocale)
  return projects.map((p) => p.slug)
})
