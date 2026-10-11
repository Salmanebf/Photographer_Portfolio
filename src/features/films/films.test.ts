import { describe, expect, it } from 'vitest'
import { projects } from './content/en'
import { projects as fr } from './content/fr'
import { staticProjects } from './content'
import { getAllProjectSlugs, getProjectBySlug, getProjects } from './data'
import { normalizeSanityProject } from './normalize'

describe('placeholder films in French', () => {
  it('translates every film, with every translatable field', () => {
    const fields = ['title', 'subtitle', 'location', 'shortDescription', 'fullDescription', 'awards', 'credits', 'tags'] as const
    for (const p of projects) {
      const t = fr[p.slug]
      expect(t, `no French entry for "${p.slug}"`).toBeTruthy()
      for (const f of fields) expect(t?.[f], `${p.slug}.${f}`).toBeTruthy()
      expect(t?.credits?.length, `${p.slug} credits`).toBe(p.credits.length)
      expect(t?.credits?.map((c) => c.name)).toEqual(p.credits.map((c) => c.name)) // names never change
    }
  })

  it('has no French entry for a film that does not exist', () => {
    const slugs = new Set(projects.map((p) => p.slug))
    expect(Object.keys(fr).filter((s) => !slugs.has(s))).toEqual([])
  })

  it('actually differs from English but keeps the shared fields', () => {
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
})

describe('films without a CMS', () => {
  it('returns the placeholder films in English', async () => {
    expect(await getProjects('en')).toEqual(projects)
  })
  it('returns the same films, translated, in French', async () => {
    const list = await getProjects('fr')
    expect(list.map((p) => p.slug)).toEqual(projects.map((p) => p.slug))
    expect(list[0].title).toBe('Le Dernier Artisan')
  })
  it('finds a film by slug in each language, and null for an unknown one', async () => {
    const first = projects[0]
    expect((await getProjectBySlug(first.slug, 'en'))?.title).toBe(first.title)
    expect((await getProjectBySlug(first.slug, 'fr'))?.title).toBe('Le Dernier Artisan')
    expect(await getProjectBySlug('does-not-exist', 'en')).toBeNull()
  })
  it('lists every slug', async () => {
    expect(await getAllProjectSlugs()).toEqual(projects.map((p) => p.slug))
  })
})

describe('CMS film documents', () => {
  const doc = {
    _id: 'p1',
    slug: 'a-film',
    title: { en: 'A Film', fr: 'Un film' },
    subtitle: { en: 'Sub' },
    category: 'environmental',
    location: { en: 'Paris', fr: 'Paris, France' },
    shortDescription: { en: 'Short', fr: 'Court' },
    fullDescription: { en: 'Long' },
    credits: [{ role: { en: 'Director', fr: 'Réalisateur' }, name: 'Sam' }],
    awards: ['Prize'],
    tags: ['x'],
    image: '/img.png',
    gallery: ['/g.png'],
  }
  it('returns the film in the requested language with English fallback', () => {
    const f = normalizeSanityProject(doc, 'fr')
    expect(f.title).toBe('Un film')
    expect(f.subtitle).toBe('Sub')
    expect(f.fullDescription).toBe('Long')
    expect(f.credits).toEqual([{ role: 'Réalisateur', name: 'Sam' }])
    expect(normalizeSanityProject(doc, 'en').title).toBe('A Film')
  })
  it('keeps shared fields identical across languages', () => {
    const a = normalizeSanityProject(doc, 'fr')
    const b = normalizeSanityProject(doc, 'en')
    expect([a.slug, a.category, a.image, a.gallery, a.awards]).toEqual([b.slug, b.category, b.image, b.gallery, b.awards])
  })
})
