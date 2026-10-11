import { describe, expect, it } from 'vitest'
import { baseSettings } from './content'
import {
  applySanitySettings,
  normalizeSanityProject,
  normalizeSanityService,
  normalizeSanityTestimonial,
} from './sanity-normalize'

describe('CMS settings in two languages', () => {
  const data = {
    discipline: { en: 'Documentary', fr: 'Documentaire' },
    heroTagline: { en: 'English tagline', fr: 'Accroche française' },
    heroStats: [{ value: 5, suffix: '+', label: { en: 'Films', fr: 'Films FR' } }],
    aboutParagraphs: [{ en: 'One', fr: 'Un' }, { en: 'Two' }],
    aboutTools: [{ en: 'Camera', fr: 'Caméra' }],
    footerTagline: { en: 'Footer' }, // no French → English
    brandColor: '#112233',
  }

  it('uses the requested language', () => {
    const s = applySanitySettings(baseSettings(), data, 'fr')
    expect(s.brand.discipline).toBe('Documentaire')
    expect(s.hero.tagline).toBe('Accroche française')
    expect(s.hero.stats[0].label).toBe('Films FR')
    expect(s.about.paragraphs).toEqual(['Un', 'Two']) // 2nd falls back to English
    expect(s.about.tools).toEqual(['Caméra'])
    expect(s.brand.color).toBe('#112233')
  })

  it('falls back to English where French is missing', () => {
    expect(applySanitySettings(baseSettings(), data, 'fr').footer.tagline).toBe('Footer')
  })

  it('keeps the placeholder value for fields the CMS leaves empty', () => {
    const base = baseSettings()
    const s = applySanitySettings(base, {}, 'fr')
    expect(s).toEqual(base)
  })

  it('still understands plain strings saved before translations existed', () => {
    const s = applySanitySettings(baseSettings(), { heroTagline: 'Legacy tagline' }, 'fr')
    expect(s.hero.tagline).toBe('Legacy tagline')
  })
})

describe('CMS films, services and testimonials', () => {
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
    const fr = normalizeSanityProject(doc, 'fr')
    expect(fr.title).toBe('Un film')
    expect(fr.subtitle).toBe('Sub')
    expect(fr.fullDescription).toBe('Long')
    expect(fr.credits).toEqual([{ role: 'Réalisateur', name: 'Sam' }])
    expect(normalizeSanityProject(doc, 'en').title).toBe('A Film')
  })

  it('keeps shared fields identical across languages', () => {
    const a = normalizeSanityProject(doc, 'fr')
    const b = normalizeSanityProject(doc, 'en')
    expect([a.slug, a.category, a.image, a.gallery, a.awards]).toEqual([b.slug, b.category, b.image, b.gallery, b.awards])
  })

  it('handles services and testimonials', () => {
    expect(normalizeSanityService({ title: { en: 'T', fr: 'Titre' }, description: { en: 'D' } }, 'fr')).toEqual({
      title: 'Titre',
      description: 'D',
    })
    expect(
      normalizeSanityTestimonial(
        { _id: 't', name: 'Ann', role: { en: 'Role', fr: 'Rôle' }, content: { en: 'Great' }, project: { en: 'P', fr: 'Pf' } },
        'fr'
      )
    ).toEqual({ id: 't', name: 'Ann', role: 'Rôle', content: 'Great', project: 'Pf' })
  })
})
