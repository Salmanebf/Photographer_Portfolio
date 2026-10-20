import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'
import { defaultLocale, locales } from './config'

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  // Every page lives under its language: /en/..., /fr/...  (no middleware needed)
  localePrefix: 'always',
  localeDetection: false,
})

/** Locale-aware drop-ins for next/link and next/navigation. */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
