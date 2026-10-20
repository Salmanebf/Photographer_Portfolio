import Link from 'next/link'
import { defaultLocale } from '@/i18n/config'
import { geistSans, geistMono } from './fonts'
import './globals.css'

/** Shown for URLs outside any language (e.g. /xyz). Pages inside a language use [locale]/not-found.tsx. */
export default function RootNotFound() {
  return (
    <html lang={defaultLocale} className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <span className="text-[9px] uppercase tracking-[0.5em] text-gold mb-4">404</span>
          <h1 className="text-5xl font-bold tracking-tight mb-4">Not Found · Introuvable</h1>
          <div className="flex gap-6 mt-6 text-sm">
            <Link href="/en" className="text-gold hover:underline">English</Link>
            <Link href="/fr" className="text-gold hover:underline">Français</Link>
          </div>
        </main>
      </body>
    </html>
  )
}
