import type { MetadataRoute } from 'next'
import { getAllProjectSlugs } from '@/lib/queries'
import { siteConfig } from '@/lib/site.config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.seo.siteUrl
  const slugs = await getAllProjectSlugs()
  const lastModified = new Date()

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...slugs.map((slug) => ({
      url: `${baseUrl}/work/${slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
