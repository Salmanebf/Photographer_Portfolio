import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import Navigation from '@/shared/layout/navigation'
import Hero from '@/features/hero/hero'
import About from '@/features/about/about'
import Portfolio from '@/features/films/portfolio'
import Services from '@/features/services/services'
import Testimonials from '@/features/testimonials/testimonials'
import Contact from '@/features/contact/ui/contact'
import Footer from '@/shared/layout/footer'
import ScrollProgress from '@/shared/effects/scroll-progress'
import CustomCursor from '@/shared/effects/custom-cursor'
import AwardsMarquee from '@/features/awards/awards-marquee'
import { getSiteSettings } from '@/shared/content/site-settings'
import { getProjects } from '@/features/films/data'
import { getServices } from '@/features/services/data'
import { getTestimonials } from '@/features/testimonials/data'
import { siteConfig } from '@/lib/site.config'
import { isLocale } from '@/i18n/config'
import { localizedAlternates } from '@/i18n/seo'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.seo.siteUrl
  return { alternates: localizedAlternates(siteUrl, '/', locale) }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  setRequestLocale(locale)

  const [settings, projects, services, testimonials] = await Promise.all([
    getSiteSettings(locale),
    getProjects(locale),
    getServices(locale),
    getTestimonials(locale),
  ])

  return (
    <div className="min-h-screen flex flex-col" suppressHydrationWarning={true}>
      <ScrollProgress />
      <CustomCursor />
      <Navigation settings={settings} />
      <main id="main" className="flex-1">
        <Hero settings={settings} />
        <About settings={settings} />
        <AwardsMarquee items={settings.recognitions} />
        <Portfolio projects={projects} />
        <Services services={services} process={settings.process} />
        <Testimonials testimonials={testimonials} />
        <Contact settings={settings} />
      </main>
      <Footer settings={settings} />
    </div>
  )
}
