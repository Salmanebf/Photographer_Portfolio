import { describe, expect, it } from 'vitest'
import { projects } from './data'
import {
  getAllProjectSlugs,
  getProjectBySlug,
  getProjects,
  getServices,
  getSiteSettings,
  getTestimonials,
} from './queries'
import { siteConfig } from './site.config'

// No NEXT_PUBLIC_SANITY_PROJECT_ID in the test env → the CMS is disabled and
// every getter must fall back to the static content.
describe('data layer without a CMS', () => {
  it('returns the static projects in English', async () => {
    expect(await getProjects('en')).toEqual(projects)
  })

  it('returns the same films, translated, in French', async () => {
    const fr = await getProjects('fr')
    expect(fr.map((p) => p.slug)).toEqual(projects.map((p) => p.slug))
    expect(fr[0].title).toBe('Le Dernier Artisan')
  })

  it('finds a project by slug in each language, and null for an unknown one', async () => {
    const first = projects[0]
    expect((await getProjectBySlug(first.slug, 'en'))?.title).toBe(first.title)
    expect((await getProjectBySlug(first.slug, 'fr'))?.title).toBe('Le Dernier Artisan')
    expect(await getProjectBySlug('does-not-exist', 'en')).toBeNull()
  })

  it('lists every slug', async () => {
    expect(await getAllProjectSlugs()).toEqual(projects.map((p) => p.slug))
  })

  it('has non-empty services and testimonials in both languages', async () => {
    for (const l of ['en', 'fr'] as const) {
      expect((await getServices(l)).length).toBeGreaterThan(0)
      expect((await getTestimonials(l)).length).toBeGreaterThan(0)
    }
  })

  it('uses site.config for English settings and French overrides for French', async () => {
    const en = await getSiteSettings('en')
    expect(en.brand.name).toBe(siteConfig.brand.name)
    expect(en.hero.tagline).toBe(siteConfig.hero.tagline)
    const fr = await getSiteSettings('fr')
    expect(fr.brand.name).toBe(siteConfig.brand.name)
    expect(fr.hero.tagline).not.toBe(en.hero.tagline)
  })
})
