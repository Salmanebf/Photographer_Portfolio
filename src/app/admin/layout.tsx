import type { Metadata } from 'next'
import Link from 'next/link'
import { geistSans, geistMono } from '../fonts'
import '../globals.css'
import { adminState } from '@/shared/admin/session'
import { isSignedIn } from '@/shared/admin/guard'
import { adminText } from '@/shared/admin/text'
import RememberPage from '@/shared/admin/remember-page'
import { signOut } from './actions'

/** Owner-only pages: never indexed, never linked from the public site. */
export const metadata: Metadata = {
  title: 'Owner area',
  robots: { index: false, follow: false, nocache: true },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [{ locale, t }, signedIn] = await Promise.all([adminText(), isSignedIn()])
  return (
    <html lang={locale} className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <header className="border-b border-border/40 h-16">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold">{t.title}</span>
            {signedIn && (
              <nav className="flex items-center gap-6 text-[11px] uppercase tracking-[0.2em]">
                <Link href="/admin/messages" className="hover:text-gold transition-colors">
                  {t.messagesNav}
                </Link>
                <Link href="/admin/studio" className="hover:text-gold transition-colors">
                  {t.studioNav}
                </Link>
                {adminState() === 'ok' && (
                  <form action={signOut}>
                    <button className="uppercase tracking-[0.2em] text-muted-foreground hover:text-gold transition-colors">
                      {t.signOut}
                    </button>
                  </form>
                )}
              </nav>
            )}
          </div>
        </header>
        {children}
        <RememberPage />
      </body>
    </html>
  )
}
