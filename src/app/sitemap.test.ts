import { describe, expect, it } from 'vitest'
import sitemap from './sitemap'
import { projects } from '@/features/films/content/en'

describe('sitemap', () => {
  it('lists every page in every language, each pointing at its translations', async () => {
    const entries = await sitemap()
    const urls = entries.map((e) => e.url)
    // home + each film, in en and fr
    expect(entries).toHaveLength((1 + projects.length) * 2)
    expect(urls.some((u) => u.endsWith('/en'))).toBe(true)
    expect(urls.some((u) => u.endsWith('/fr'))).toBe(true)
    const film = entries.find((e) => e.url.endsWith(`/fr/work/${projects[0].slug}`))
    expect(film?.alternates?.languages).toMatchObject({
      en: expect.stringContaining(`/en/work/${projects[0].slug}`),
      fr: expect.stringContaining(`/fr/work/${projects[0].slug}`),
      'x-default': expect.stringContaining(`/en/work/${projects[0].slug}`),
    })
  })
  it('never lists a URL without a language prefix', async () => {
    for (const e of await sitemap()) expect(new URL(e.url).pathname).toMatch(/^\/(en|fr)(\/|$)/)
  })
})
