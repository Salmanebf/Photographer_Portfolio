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
  it('returns the static projects', async () => {
    expect(await getProjects()).toEqual(projects)
  })

  it('finds a project by slug, and null for an unknown one', async () => {
    const first = projects[0]
    expect((await getProjectBySlug(first.slug))?.title).toBe(first.title)
    expect(await getProjectBySlug('does-not-exist')).toBeNull()
  })

  it('lists every slug', async () => {
    expect(await getAllProjectSlugs()).toEqual(projects.map((p) => p.slug))
  })

  it('has non-empty services and testimonials', async () => {
    expect((await getServices()).length).toBeGreaterThan(0)
    expect((await getTestimonials()).length).toBeGreaterThan(0)
  })

  it('uses site.config for settings', async () => {
    const s = await getSiteSettings()
    expect(s.brand.name).toBe(siteConfig.brand.name)
  })
})
