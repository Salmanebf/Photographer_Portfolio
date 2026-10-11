import { describe, expect, it } from 'vitest'
import { services } from './content/en'
import { staticServices } from './content'
import { getServices } from './data'
import { normalizeSanityService } from './normalize'

describe('services', () => {
  it('are translated one-to-one in French', () => {
    const en = staticServices('en')
    const fr = staticServices('fr')
    expect(fr).toHaveLength(en.length)
    fr.forEach((s, i) => {
      expect(s.title).not.toBe(en[i].title)
      expect(s.description).toBeTruthy()
    })
  })
  it('come from the placeholders when no CMS is configured', async () => {
    expect(await getServices('en')).toEqual(services)
    expect((await getServices('fr')).length).toBe(services.length)
  })
  it('read a CMS document in the requested language with English fallback', () => {
    expect(normalizeSanityService({ title: { en: 'T', fr: 'Titre' }, description: { en: 'D' } }, 'fr')).toEqual({
      title: 'Titre',
      description: 'D',
    })
  })
})
