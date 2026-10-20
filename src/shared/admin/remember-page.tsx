'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { LAST_PAGE_COOKIE, isOwnerPath } from './session'

/** Remembers which owner page you were on (a path only), so signing in again can take you back to it. */
export default function RememberPage() {
  const pathname = usePathname()
  useEffect(() => {
    if (isOwnerPath(pathname)) {
      document.cookie = `${LAST_PAGE_COOKIE}=${encodeURIComponent(pathname)}; path=/; max-age=2592000; samesite=strict`
    }
  }, [pathname])
  return null
}
