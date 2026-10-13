/**
 * The CMS code path, end to end, against a FAKE Sanity API (scripts/mock-sanity):
 * the real Sanity client, the real GROQ queries (evaluated by groq-js) and the
 * real data layer. It proves our queries and normalisers work on realistic
 * documents. It does NOT prove Sanity's own behaviour — see docs/TESTING.md.
 */
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { MOCK_TOKEN, startMockSanity } from '../../../scripts/mock-sanity/server.mjs'
import { baseDocuments } from '../../../scripts/mock-sanity/dataset.mjs'

type Mock = Awaited<ReturnType<typeof startMockSanity>>
let mock: Mock

beforeAll(async () => {
  mock = await startMockSanity()
})
afterAll(async () => {
  await mock.close()
})
afterEach(() => {
  vi.unstubAllEnvs()
  vi.doUnmock('@/lib/cms/draft')
  vi.restoreAllMocks()
  mock.reset()
  mock.setDocuments() // back to the default documents
})

/** Fresh copies of every data module, configured against the fake API. */
async function load({ draft = false, token = MOCK_TOKEN }: { draft?: boolean; token?: string } = {}) {
  vi.resetModules()
  vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'mock')
  vi.stubEnv('SANITY_API_HOST', mock.url)
  vi.stubEnv('SANITY_API_READ_TOKEN', token)
  vi.doMock('@/lib/cms/draft', () => ({ isDraftMode: async () => draft }))
  return {
    settings: await import('@/shared/content/site-settings'),
    films: await import('@/features/films/data'),
    photos: await import('@/features/photography/data'),
    services: await import('@/features/services/data'),
    testimonials: await import('@/features/testimonials/data'),
  }
}

describe('published content from the CMS', () => {
  it('site settings: language, fallbacks, brand colour, awards, steps, SEO', async () => {
    const { settings } = await load()
    const en = await settings.getSiteSettings('en')
    expect(en.brand.name).toBe('Alex Rivera (CMS)')
    expect(en.brand.color).toBe('#3b9d8f')
    expect(en.brand.discipline).toBe('Documentary (CMS)')
    expect(en.hero.tagline).toBe('A tagline written in the CMS.')
    expect(en.hero.image).toBe('/images/hero-doc.png') // reference followed: heroImage.asset->url
    expect(en.hero.headline).toBe('Stories from the CMS')
    expect(en.recognitions).toEqual(['Mock Festival — Jury Prize', 'Mock Press — Featured', 'Mock Award — Nominee'])
    expect(en.process.map((s) => s.title)).toEqual(['Listen', 'Film', 'Finish'])
    expect(en.seo.title).toBe('CMS Title — Documentary Filmmaker')
    expect(en.seo.keywords).toEqual(['cms keyword', 'second keyword'])
    expect(en.seo.ogImage).toBe('/images/doc-ink.png') // the dedicated sharing image beats the hero image
    expect(en.contact.email).toBe('cms@example.com')

    const fr = await settings.getSiteSettings('fr')
    expect(fr.brand.discipline).toBe('Documentaire (CMS)')
    expect(fr.hero.tagline).toBe('Une accroche écrite dans le CMS.')
    expect(fr.recognitions[1]).toBe('Mock Press — Featured') // no French → English
    expect(fr.process[0].title).toBe('Écouter')
    expect(fr.process[1].description).toBe('We film on location.') // no French → English
    expect(fr.seo.keywords).toEqual(['mot-clé cms', 'second keyword'])
    expect(fr.about.paragraphs).toEqual(['Paragraphe CMS un.', 'CMS paragraph two (English only).'])
  })

  it('films: only the CMS films, ordered, translated with English fallback, references followed', async () => {
    const { films } = await load()
    const en = await films.getProjects('en')
    expect(en.map((p) => p.slug)).toEqual(['mock-film-one', 'mock-film-two'])
    expect(en.map((p) => p.previewShape)).toEqual(['landscape', undefined]) // card shape from the CMS; unset = detected from the clip
    expect(en[0]).toMatchObject({
      title: 'Mock Film One',
      category: 'environmental',
      image: '/images/doc-craftsman.png',
      gallery: ['/images/doc-ice.png', '/images/doc-rivers.png'],
      credits: [{ role: 'Director', name: 'Alex Rivera' }],
    })
    const fr = await films.getProjects('fr')
    expect(fr[0].title).toBe('Film fictif un')
    expect(fr[0].credits[0].role).toBe('Réalisation')
    expect(fr[1].title).toBe('Mock Film Two (English only)') // not translated → English
    expect(await films.getAllProjectSlugs()).toEqual(['mock-film-one', 'mock-film-two'])
  })

  it('a film exists only if the CMS has it — placeholder films are not reachable', async () => {
    const { films } = await load()
    expect((await films.getProjectBySlug('mock-film-one', 'fr'))?.title).toBe('Film fictif un')
    expect(await films.getProjectBySlug('the-last-craftsman', 'en')).toBeNull() // a placeholder slug
    expect(await films.getProjectBySlug('mock-film-unpublished', 'en')).toBeNull() // draft-only
  })

  it('photo series: photos with size, alt fallbacks, related film slug', async () => {
    const { photos } = await load()
    const [s] = await photos.getPhotoSeries('fr')
    expect(s).toMatchObject({ slug: 'mock-series', title: 'Série fictive', location: 'Côte fictive', description: 'A mock series.', relatedProject: 'mock-film-one', cover: '/images/doc-ice.png' })
    expect(s.photos[0]).toEqual({ src: '/images/doc-ice.png', width: 1024, height: 1024, alt: 'Un rivage glacé', caption: 'Cold light' })
    expect(s.photos[1].alt).toBe('Série fictive') // no alt written → series title
    expect((await photos.getPhotoSeriesBySlug('mock-series', 'en'))?.title).toBe('Mock Series')
  })

  it('services and testimonials, including the linked film title in the right language', async () => {
    const { services, testimonials } = await load()
    expect((await services.getServices('fr')).map((s) => s.title)).toEqual(['Service fictif un', 'Mock Service Two'])
    const [t] = await testimonials.getTestimonials('fr')
    expect(t).toMatchObject({ name: 'Mock Person', role: 'Rôle fictif', content: 'Un mot gentil fictif.', project: 'Film fictif un' })
  })

  it('never sends the read token or asks for drafts when serving visitors', async () => {
    const { settings, films, photos, services, testimonials } = await load()
    await Promise.all([settings.getSiteSettings('en'), films.getProjects('en'), photos.getPhotoSeries('en'), services.getServices('en'), testimonials.getTestimonials('en')])
    expect(mock.requests.length).toBeGreaterThanOrEqual(5)
    for (const r of mock.requests) {
      expect(r.perspective).toBe('published')
      expect(r.hasAuthHeader).toBe(false)
    }
  })
})

describe('preview (draft) mode', () => {
  it('shows unpublished changes and unpublished films, using the token — and only then', async () => {
    const { films } = await load({ draft: true })
    const list = await films.getProjects('en')
    expect(list.find((p) => p.slug === 'mock-film-one')?.title).toBe('DRAFT TITLE of Film One')
    expect(list.map((p) => p.slug)).toContain('mock-film-unpublished')
    expect((await films.getProjectBySlug('mock-film-unpublished', 'fr'))?.title).toBe('Film fictif NON PUBLIÉ')
    expect(mock.requests.every((r: { perspective: string; authorized: boolean }) => r.perspective === 'drafts' && r.authorized)).toBe(true)
  })

  it('without a read token configured, preview mode safely shows published content', async () => {
    const { films } = await load({ draft: true, token: '' })
    const list = await films.getProjects('en')
    expect(list.find((p) => p.slug === 'mock-film-one')?.title).toBe('Mock Film One')
    expect(list.map((p) => p.slug)).not.toContain('mock-film-unpublished')
    expect(mock.requests.every((r: { perspective: string; hasAuthHeader: boolean }) => r.perspective === 'published' && !r.hasAuthHeader)).toBe(true)
  })

  it('with a wrong token the site does not crash: it falls back to the placeholders', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { films } = await load({ draft: true, token: 'wrong-token' })
    const list = await films.getProjects('en')
    expect(list[0].slug).toBe('the-last-craftsman')
    expect(warn).toHaveBeenCalled()
  })
})

describe('when the CMS misbehaves, the site still renders', () => {
  it('falls back to the placeholders on a server error', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { films, settings } = await load()
    mock.failNext(2)
    expect((await films.getProjects('en'))[0].slug).toBe('the-last-craftsman')
    expect((await settings.getSiteSettings('en')).brand.name).toBe('Alex Rivera')
    expect(warn).toHaveBeenCalled()
  })

  it('falls back to the placeholders when the CMS has no documents yet', async () => {
    mock.setDocuments([])
    const { films, photos, services, testimonials, settings } = await load()
    expect((await films.getProjects('en')).length).toBe(6)
    expect((await photos.getPhotoSeries('en')).map((s) => s.slug)).toEqual(['behind-the-scenes', 'arctic-light'])
    expect((await services.getServices('en')).length).toBe(4)
    expect((await testimonials.getTestimonials('en')).length).toBe(4)
    expect((await settings.getSiteSettings('en')).recognitions.length).toBeGreaterThan(0)
  })

  it('an editor who empties "Awards & Press" hides the band; clearing the steps keeps the placeholders', async () => {
    const docs = baseDocuments().map((d: { _id: string }) => (d._id === 'siteSettings' ? { ...d, recognitions: [], processSteps: [] } : d))
    mock.setDocuments(docs)
    const { settings } = await load()
    const s = await settings.getSiteSettings('en')
    expect(s.recognitions).toEqual([])
    expect(s.process).toHaveLength(4) // placeholder steps are kept so the section never looks broken
  })
})
