import { describe, expect, it } from 'vitest'
import { siteConfig } from '@/lib/site.config'
import { baseSettings, getSiteSettings, staticSettings } from './site-settings'
import { applySanitySettings } from './normalize'

describe('site settings without a CMS', () => {
  it('use site.config for English and the French overrides for French', async () => {
    const en = await getSiteSettings('en')
    expect(en.brand.name).toBe(siteConfig.brand.name)
    expect(en.hero.tagline).toBe(siteConfig.hero.tagline)
    const fr = await getSiteSettings('fr')
    expect(fr.brand.name).toBe(siteConfig.brand.name)
    expect(fr.hero.tagline).not.toBe(en.hero.tagline)
  })

  it('translate the site copy but keep shared settings', () => {
    const en = staticSettings('en')
    const fr = staticSettings('fr')
    expect(fr.about.paragraphs).toHaveLength(en.about.paragraphs.length)
    expect(fr.seo.title).not.toBe(en.seo.title)
    expect(fr.hero.stats.map((s) => s.value)).toEqual(en.hero.stats.map((s) => s.value))
    expect(fr.brand.color).toBe(en.brand.color)
    expect(fr.contact.email).toBe(en.contact.email)
  })

  it('have placeholder awards and "how I work" steps in both languages, same count', () => {
    const en = staticSettings('en')
    const fr = staticSettings('fr')
    expect(en.recognitions.length).toBeGreaterThan(0)
    expect(fr.recognitions).toHaveLength(en.recognitions.length)
    expect(en.process).toHaveLength(4)
    expect(fr.process).toHaveLength(4)
    fr.process.forEach((s, i) => {
      expect(s.title).toBeTruthy()
      // a title can legitimately be spelled the same ("Production"), a description never is
      expect(s.description).not.toBe(en.process[i].description)
    })
    expect(fr.process.some((s, i) => s.title !== en.process[i].title)).toBe(true)
  })

  it('do not modify the English base', () => {
    const before = JSON.stringify(baseSettings())
    staticSettings('fr')
    expect(JSON.stringify(baseSettings())).toBe(before)
  })
})

describe('CMS site settings', () => {
  const data = {
    discipline: { en: 'Documentary', fr: 'Documentaire' },
    heroTagline: { en: 'English tagline', fr: 'Accroche française' },
    heroStats: [{ value: 5, suffix: '+', label: { en: 'Films', fr: 'Films FR' } }],
    aboutParagraphs: [{ en: 'One', fr: 'Un' }, { en: 'Two' }],
    aboutTools: [{ en: 'Camera', fr: 'Caméra' }],
    footerTagline: { en: 'Footer' },
    brandColor: '#112233',
  }

  it('uses the requested language, falling back to English per field', () => {
    const s = applySanitySettings(baseSettings(), data, 'fr')
    expect(s.brand.discipline).toBe('Documentaire')
    expect(s.hero.tagline).toBe('Accroche française')
    expect(s.hero.stats[0].label).toBe('Films FR')
    expect(s.about.paragraphs).toEqual(['Un', 'Two'])
    expect(s.about.tools).toEqual(['Caméra'])
    expect(s.footer.tagline).toBe('Footer')
    expect(s.brand.color).toBe('#112233')
  })

  it('keeps the placeholder value for fields the CMS leaves empty', () => {
    const base = baseSettings()
    expect(applySanitySettings(base, {}, 'fr')).toEqual(base)
  })

  it('still understands plain strings saved before translations existed', () => {
    expect(applySanitySettings(baseSettings(), { heroTagline: 'Legacy tagline' }, 'fr').hero.tagline).toBe('Legacy tagline')
  })

  it('replaces the placeholder awards with the editor\'s list, and an empty list hides them', () => {
    const own = applySanitySettings(baseSettings(), { recognitions: [{ en: 'Prize A', fr: 'Prix A' }, { en: 'Prize B' }] }, 'fr')
    expect(own.recognitions).toEqual(['Prix A', 'Prize B'])
    const none = applySanitySettings(baseSettings(), { recognitions: [] }, 'en')
    expect(none.recognitions).toEqual([])
    // field never saved → placeholder kept
    expect(applySanitySettings(baseSettings(), {}, 'en').recognitions.length).toBeGreaterThan(0)
  })

  it('reads the "how I work" steps, dropping empty ones', () => {
    const s = applySanitySettings(
      baseSettings(),
      { processSteps: [{ title: { en: 'Plan', fr: 'Préparer' }, description: { en: 'We plan.' } }, { title: {}, description: { en: 'x' } }] },
      'fr'
    )
    expect(s.process).toEqual([{ title: 'Préparer', description: 'We plan.' }])
  })

  it('reads SEO keywords (per language) and the share image', () => {
    const s = applySanitySettings(baseSettings(), { seoKeywords: [{ en: 'film', fr: 'film FR' }, { en: 'story' }], seoImageUrl: '/share.png' }, 'fr')
    expect(s.seo.keywords).toEqual(['film FR', 'story'])
    expect(s.seo.ogImage).toBe('/share.png')
  })

  it('shares the hero image when no sharing image was chosen', () => {
    const s = applySanitySettings(baseSettings(), { heroImageUrl: '/new-hero.png' }, 'en')
    expect(s.seo.ogImage).toBe('/new-hero.png')
    expect(applySanitySettings(baseSettings(), { heroImageUrl: '/h.png', seoImageUrl: '/s.png' }, 'en').seo.ogImage).toBe('/s.png')
  })
})
