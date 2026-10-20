'use client'

import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

/** Shown only in preview mode: reminds the editor these are unpublished changes and offers a way out. */
export default function DraftBanner() {
  const t = useTranslations('draft')
  const pathname = usePathname()

  return (
    <div
      role="status"
      className="fixed bottom-0 inset-x-0 z-[9990] flex items-center justify-center gap-4 bg-gold px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-background"
    >
      <span>{t('banner')}</span>
      {/* a plain link on purpose: leaving preview must reload the page without the cookie */}
      <a
        href={`/api/draft/disable?path=${encodeURIComponent(pathname)}`}
        className="underline underline-offset-4"
      >
        {t('exit')}
      </a>
    </div>
  )
}
