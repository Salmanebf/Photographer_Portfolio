import type { MetadataRoute } from 'next'
import { getAllProjectSlugs } from '@/features/films/data'
import { siteConfig } from '@/lib/site.config'
import { locales } from '@/i18n/config'
import { localizedAlternates } from '@/i18n/seo'

/** Every page in every language, each listing its translations (hreflang). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.seo.siteUrl
  const slugs = await getAllProjectSlugs()
  const lastModified = new Date()

  const entry = (
    path: string,
    changeFrequency: 'weekly' | 'monthly',
    priority: number
  ): MetadataRoute.Sitemap =>
    locales.map((locale) => {
      const { canonical, languages } = localizedAlternates(baseUrl, path, locale)
      return { url: canonical, lastModified, changeFrequency, priority, alternates: { languages } }
    })

  return [
    ...entry('/', 'weekly', 1),
    ...slugs.flatMap((slug) => entry(`/work/${slug}`, 'monthly', 0.8)),
  ]
}
