import { describe, expect, it } from 'vitest'
import { photoSeries } from './content/en'
import { photoSeries as fr } from './content/fr'
import { staticPhotoSeries } from './content'
import { getAllPhotoSeriesSlugs, getPhotoSeries, getPhotoSeriesBySlug } from './data'
import { normalizeSanityPhotoSeries } from './normalize'
import { projects } from '@/features/films/content/en'

describe('placeholder photo series', () => {
  it('are translated in French with one translation per photo', () => {
    for (const s of photoSeries) {
      const t = fr[s.slug]
      expect(t, s.slug).toBeTruthy()
      expect(t.title && t.description && t.location, s.slug).toBeTruthy()
      expect(t.photos).toHaveLength(s.photos.length)
    }
    expect(Object.keys(fr).filter((k) => !photoSeries.some((s) => s.slug === k))).toEqual([])
  })
  it('differ in French but keep images, slugs and links', () => {
    const en = staticPhotoSeries('en')
    staticPhotoSeries('fr').forEach((s, i) => {
      expect(s.title).not.toBe(en[i].title)
      expect(s.slug).toBe(en[i].slug)
      expect(s.cover).toBe(en[i].cover)
      expect(s.photos.map((p) => p.src)).toEqual(en[i].photos.map((p) => p.src))
      expect(s.relatedProject).toBe(en[i].relatedProject)
    })
  })
  it('only link to films that exist, and have a cover that is one of their photos', () => {
    const slugs = new Set(projects.map((p) => p.slug))
    for (const s of photoSeries) {
      if (s.relatedProject) expect(slugs.has(s.relatedProject)).toBe(true)
      expect(s.photos.map((p) => p.src)).toContain(s.cover)
      s.photos.forEach((p) => expect(p.alt).toBeTruthy())
    }
  })
})

describe('photo series without a CMS', () => {
  it('come from the placeholders, by list and by slug', async () => {
    expect(await getPhotoSeries('en')).toEqual(photoSeries)
    expect((await getPhotoSeriesBySlug('arctic-light', 'fr'))?.title).toBe('Lumière arctique')
    expect(await getPhotoSeriesBySlug('nope', 'en')).toBeNull()
    expect(await getAllPhotoSeriesSlugs()).toEqual(photoSeries.map((s) => s.slug))
  })
})

describe('CMS photo-series documents', () => {
  const doc = {
    _id: 's1',
    slug: 'a-series',
    title: { en: 'A Series', fr: 'Une série' },
    description: { en: 'Intro' },
    location: { en: 'Rome', fr: 'Rome, Italie' },
    year: '2024',
    cover: '/cover.png',
    relatedProject: 'the-last-craftsman',
    photos: [
      { src: '/a.png', width: 800, height: 600, alt: { en: 'Alt A', fr: 'Alt A FR' }, caption: { en: 'Cap A' } },
      { src: '/b.png', alt: {} },
      { src: null, alt: { en: 'no image' } },
    ],
  }
  it('reads a series in the requested language with English fallback', () => {
    const s = normalizeSanityPhotoSeries(doc, 'fr')
    expect(s.title).toBe('Une série')
    expect(s.description).toBe('Intro')
    expect(s.location).toBe('Rome, Italie')
    expect(s.photos[0]).toEqual({ src: '/a.png', width: 800, height: 600, alt: 'Alt A FR', caption: 'Cap A' })
    expect(s.relatedProject).toBe('the-last-craftsman')
  })
  it('drops photos without an image and uses the title as alt text when none was written', () => {
    const s = normalizeSanityPhotoSeries(doc, 'en')
    expect(s.photos).toHaveLength(2)
    expect(s.photos[1].alt).toBe('A Series')
  })
  it('falls back to the first photo when there is no cover', () => {
    expect(normalizeSanityPhotoSeries({ ...doc, cover: undefined }, 'en').cover).toBe('/a.png')
  })
})
