'use client'

import { useLocale, useTranslations } from 'next-intl'
import { localeNames, locales, type Locale } from '@/i18n/config'
import { rememberLocale } from '@/i18n/cookie'
import { usePathname, useRouter } from '@/i18n/routing'

interface LanguageSwitcherProps {
  className?: string
}

/**
 * EN | FR toggle. Keeps the visitor on the same page in the other language
 * and remembers the choice (cookie read by the `/` redirect).
 */
export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const current = useLocale() as Locale
  const t = useTranslations('language')
  const pathname = usePathname()
  const router = useRouter()

  const choose = (next: Locale) => {
    if (next === current) return
    rememberLocale(next)
    router.replace(pathname + window.location.hash, { locale: next })
  }

  return (
    <div role="group" aria-label={t('label')} className={`flex items-center gap-1 ${className}`}>
      {locales.map((code, i) => (
        <span key={code} className="flex items-center gap-1">
          {i > 0 && <span className="text-border" aria-hidden="true">/</span>}
          <button
            type="button"
            lang={code}
            onClick={() => choose(code)}
            aria-pressed={code === current}
            aria-label={t('switchTo', { language: localeNames[code] })}
            title={localeNames[code]}
            data-cursor="hover"
            className={`px-1.5 py-1 text-[10px] uppercase tracking-[0.2em] font-medium transition-colors duration-300 ${
              code === current ? 'text-gold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {code}
          </button>
        </span>
      ))}
    </div>
  )
}
