import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { geistSans, geistMono } from '../fonts'
import '../globals.css'
import { Toaster } from '@/shared/ui/toaster'
import { getSiteSettings } from '@/shared/content/site-settings'
import { siteConfig } from '@/lib/site.config'
import { dirOf, isLocale, locales, ogLocales } from '@/i18n/config'
import { siteBase } from '@/i18n/seo'
import { isDraftMode } from '@/lib/cms/draft'
import DraftBanner from '@/shared/layout/draft-banner'

/** Only the configured languages exist; anything else is a 404. */
export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}

  const [settings, draft] = await Promise.all([getSiteSettings(locale), isDraftMode()])
  const siteUrl = siteBase(process.env.NEXT_PUBLIC_SITE_URL || siteConfig.seo.siteUrl)
  const image = settings.seo.ogImage || settings.hero.image

  return {
    // unpublished previews must never be indexed
    ...(draft ? { robots: { index: false, follow: false } } : {}),
    title: { default: settings.seo.title, template: `%s | ${settings.brand.name}` },
    description: settings.seo.description,
    keywords: settings.seo.keywords,
    authors: [{ name: settings.brand.name }],
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: settings.seo.title,
      description: settings.seo.description,
      type: 'website',
      locale: ogLocales[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
      url: `${siteUrl}/${locale}`,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.seo.title,
      description: settings.seo.description,
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  setRequestLocale(locale)

  const [settings, messages, t, draft] = await Promise.all([
    getSiteSettings(locale),
    getMessages({ locale }),
    getTranslations({ locale, namespace: 'common' }),
    isDraftMode(),
  ])

  const DEFAULT_BRAND = '#c9a96e'
  // Only a plain hex colour may reach the inline <style> below
  const brandColor = /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(settings.brand.color)
    ? settings.brand.color
    : DEFAULT_BRAND

  // Brand color override — non-devs change this in /studio or site.config.ts
  const themeStyle = `
    :root, .dark { --gold: ${brandColor}; }
    ::selection { background: ${brandColor}55; color: #f0ebe2; }
    ::-webkit-scrollbar-thumb:hover { background: ${brandColor}; }
  `

  return (
    <html lang={locale} dir={dirOf(locale)} className="dark" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeStyle }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[9999] focus:bg-gold focus:text-background focus:px-4 focus:py-2 focus:text-xs focus:uppercase focus:tracking-widest focus:font-semibold"
          >
            {t('skipToContent')}
          </a>
          {children}
          {draft && <DraftBanner />}
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
