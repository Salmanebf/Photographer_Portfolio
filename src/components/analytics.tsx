/**
 * Vercel Analytics — opt-in via env var.
 *
 * Set NEXT_PUBLIC_ENABLE_ANALYTICS=true to enable. Renders nothing otherwise.
 * Uses native browser APIs only — no extra package dependency.
 */
'use client'

import { useEffect } from 'react'

export default function Analytics() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'true') return

    // Lightweight pageview ping. Replace with your analytics provider of choice.
    const send = () => {
      try {
        if ('sendBeacon' in navigator) {
          navigator.sendBeacon('/api/analytics', JSON.stringify({
            url: location.pathname,
            ref: document.referrer,
            ts: Date.now(),
          }))
        }
      } catch {
        // ignore
      }
    }

    send()
    window.addEventListener('popstate', send)
    return () => window.removeEventListener('popstate', send)
  }, [])

  return null
}
