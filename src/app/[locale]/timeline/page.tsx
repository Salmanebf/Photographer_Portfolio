import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getSiteSettings } from '@/shared/content/site-settings'
import { siteConfig } from '@/lib/site.config'
import Navigation from '@/shared/layout/navigation'
import Footer from '@/shared/layout/footer'
import ScrollProgress from '@/shared/effects/scroll-progress'
import CustomCursor from '@/shared/effects/custom-cursor'
import Timeline from '@/features/timeline/timeline'
import { Link } from '@/i18n/routing'
import { isLocale } from '@/i18n/config'
import { localizedAlternates, siteBase } from '@/i18n/seo'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = await getTranslations({ locale, namespace: 'timeline' })
  const siteUrl = siteBase(process.env.NEXT_PUBLIC_SITE_URL || siteConfig.seo.siteUrl)
  return {
    title: t('pageTitle'),
    description: t('pageIntro'),
    alternates: localizedAlternates(siteUrl, '/timeline', locale),
  }
}

/** The full step-by-step page (the design of this page is finished in a later round). */
export default async function TimelinePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  setRequestLocale(locale)
  const [t, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'timeline' }),
    getSiteSettings(locale),
  ])

  return (
    <div className="min-h-screen flex flex-col" suppressHydrationWarning>
      <ScrollProgress />
      <CustomCursor />
      <Navigation settings={settings} />
      <main id="main" className="flex-1 pt-32 sm:pt-40">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 mb-14">
          <Link href="/" className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-gold transition-colors">
            ← {t('back')}
          </Link>
          <h1 className="mt-8 text-4xl sm:text-6xl font-bold tracking-tight">{t('pageTitle')}</h1>
          <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">{t('pageIntro')}</p>
        </div>
        <Timeline steps={settings.process} variant="full" />
      </main>
      <Footer settings={settings} />
    </div>
  )
}
