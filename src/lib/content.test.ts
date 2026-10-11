import { describe, expect, it } from 'vitest'
import { projects } from './data'
import { baseSettings, staticProjects, staticServices, staticSettings, staticTestimonials } from './content'
import { fr } from './content/fr'

describe('static French content', () => {
  it('translates every placeholder film, with every translatable field', () => {
    const fields = ['title', 'subtitle', 'location', 'shortDescription', 'fullDescription', 'awards', 'credits', 'tags'] as const
    for (const p of projects) {
      const t = fr.projects?.[p.slug]
      expect(t, `no French entry for "${p.slug}"`).toBeTruthy()
      for (const f of fields) expect(t?.[f], `${p.slug}.${f}`).toBeTruthy()
      expect(t?.credits?.length, `${p.slug} credits`).toBe(p.credits.length)
      expect(t?.credits?.map((c) => c.name)).toEqual(p.credits.map((c) => c.name)) // names never change
    }
  })

  it('has no French entry for a film that does not exist', () => {
    const slugs = new Set(projects.map((p) => p.slug))
    expect(Object.keys(fr.projects ?? {}).filter((s) => !slugs.has(s))).toEqual([])
  })

  it('actually differs from English (not accidentally copied)', () => {
    const en = staticProjects('en')
    const fra = staticProjects('fr')
    en.forEach((p, i) => {
      expect(fra[i].title).not.toBe(p.title)
      expect(fra[i].fullDescription).not.toBe(p.fullDescription)
      expect(fra[i].slug).toBe(p.slug) // URLs are shared
      expect(fra[i].category).toBe(p.category) // category keys are shared
      expect(fra[i].image).toBe(p.image)
    })
  })

  it('translates services and testimonials one-to-one', () => {
    expect(staticServices('fr')).toHaveLength(staticServices('en').length)
    staticServices('fr').forEach((s, i) => expect(s.title).not.toBe(staticServices('en')[i].title))
    staticTestimonials('fr').forEach((t, i) => {
      const e = staticTestimonials('en')[i]
      expect(t.content).not.toBe(e.content)
      expect(t.name).toBe(e.name)
    })
  })

  it('translates the site copy but keeps shared settings', () => {
    const en = staticSettings('en')
    const fra = staticSettings('fr')
    expect(fra.hero.tagline).not.toBe(en.hero.tagline)
    expect(fra.about.paragraphs).toHaveLength(en.about.paragraphs.length)
    expect(fra.seo.title).not.toBe(en.seo.title)
    expect(fra.hero.stats.map((s) => s.value)).toEqual(en.hero.stats.map((s) => s.value))
    expect(fra.brand.color).toBe(en.brand.color)
    expect(fra.contact.email).toBe(en.contact.email)
  })

  it('does not modify the English base', () => {
    const before = JSON.stringify(baseSettings())
    staticSettings('fr')
    expect(JSON.stringify(baseSettings())).toBe(before)
  })
})
