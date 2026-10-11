import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getSiteSettings } from '@/shared/content/site-settings'
import { getAllProjectSlugs, getProjectBySlug } from '@/features/films/data'
import { siteConfig } from '@/lib/site.config'
import Navigation from '@/shared/layout/navigation'
import Footer from '@/shared/layout/footer'
import ScrollProgress from '@/shared/effects/scroll-progress'
import CustomCursor from '@/shared/effects/custom-cursor'
import ProjectDetailPage from '@/features/films/project-detail-page'
import { isLocale, locales } from '@/i18n/config'
import { localizedAlternates, siteBase } from '@/i18n/seo'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs()
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const project = await getProjectBySlug(slug, locale)
  if (!project) {
    const t = await getTranslations({ locale, namespace: 'notFound' })
    return { title: t('title') }
  }

  const siteUrl = siteBase(process.env.NEXT_PUBLIC_SITE_URL || siteConfig.seo.siteUrl)
  const alternates = localizedAlternates(siteUrl, `/work/${project.slug}`, locale)
  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      type: 'article',
      url: alternates.canonical,
      images: project.image
        ? [{ url: project.image, width: 1200, height: 630, alt: project.title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.shortDescription,
    },
    alternates,
  }
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  setRequestLocale(locale)

  const [project, settings] = await Promise.all([
    getProjectBySlug(slug, locale),
    getSiteSettings(locale),
  ])

  if (!project) notFound()

  return (
    <div className="min-h-screen flex flex-col" suppressHydrationWarning>
      <ScrollProgress />
      <CustomCursor />
      <Navigation settings={settings} />
      <main id="main" className="flex-1">
        <ProjectDetailPage project={project} />
      </main>
      <Footer settings={settings} />
    </div>
  )
}
