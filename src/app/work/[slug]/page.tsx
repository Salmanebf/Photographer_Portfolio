import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllProjectSlugs, getProjectBySlug, getSiteSettings } from '@/lib/queries'
import { siteConfig } from '@/lib/site.config'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import ScrollProgress from '@/components/scroll-progress'
import CustomCursor from '@/components/custom-cursor'
import ProjectDetailPage from '@/components/project-detail-page'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return { title: 'Project not found' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.seo.siteUrl
  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      type: 'article',
      url: `${siteUrl}/work/${project.slug}`,
      images: project.image
        ? [{ url: project.image, width: 1200, height: 630, alt: project.title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.shortDescription,
    },
    alternates: { canonical: `${siteUrl}/work/${project.slug}` },
  }
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [project, settings] = await Promise.all([
    getProjectBySlug(slug),
    getSiteSettings(),
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
