import { describe, expect, it } from 'vitest'
import { testimonials } from './content/en'
import { staticTestimonials } from './content'
import { getTestimonials } from './data'
import { normalizeSanityTestimonial } from './normalize'

describe('testimonials', () => {
  it('are translated in French while names stay the same', () => {
    const en = staticTestimonials('en')
    staticTestimonials('fr').forEach((t, i) => {
      expect(t.content).not.toBe(en[i].content)
      expect(t.role).not.toBe(en[i].role)
      expect(t.name).toBe(en[i].name)
    })
  })
  it('come from the placeholders when no CMS is configured', async () => {
    expect(await getTestimonials('en')).toEqual(testimonials)
    expect((await getTestimonials('fr')).length).toBe(testimonials.length)
  })
  it('read a CMS document in the requested language with English fallback', () => {
    expect(
      normalizeSanityTestimonial(
        { _id: 't', name: 'Ann', role: { en: 'Role', fr: 'Rôle' }, content: { en: 'Great' }, project: { en: 'P', fr: 'Pf' } },
        'fr'
      )
    ).toEqual({ id: 't', name: 'Ann', role: 'Rôle', content: 'Great', project: 'Pf' })
  })
})
