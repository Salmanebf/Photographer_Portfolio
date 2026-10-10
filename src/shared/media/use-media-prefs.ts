'use client'

import { useSyncExternalStore } from 'react'
import { allowAutoplay, pickClipQuality } from './prefs'

type Connection = EventTarget & { saveData?: boolean; effectiveType?: string }
const getConnection = () =>
  (navigator as Navigator & { connection?: Connection }).connection

function subscribe(onChange: () => void) {
  const mq = matchMedia('(prefers-reduced-motion: reduce)')
  const conn = getConnection()
  mq.addEventListener('change', onChange)
  conn?.addEventListener('change', onChange)
  window.addEventListener('resize', onChange)
  return () => {
    mq.removeEventListener('change', onChange)
    conn?.removeEventListener('change', onChange)
    window.removeEventListener('resize', onChange)
  }
}

/** A primitive snapshot so React can compare it cheaply. */
function getSnapshot() {
  const conn = getConnection()
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const quality = pickClipQuality(window.innerWidth, conn?.effectiveType)
  return [reduced, Boolean(conn?.saveData), conn?.effectiveType ?? '', quality].join('|')
}

/**
 * Viewer-aware media settings. On the server (and during hydration) autoplay is
 * off, so no video bytes are requested until the client has checked preferences.
 */
export function useMediaPrefs(): { autoplay: boolean; quality: 360 | 480 | 720 } {
  const snap = useSyncExternalStore(subscribe, getSnapshot, () => 'ssr')
  if (snap === 'ssr') return { autoplay: false, quality: 720 }
  const [reduced, saveData, effectiveType, quality] = snap.split('|')
  return {
    autoplay: allowAutoplay({
      reducedMotion: reduced === 'true',
      saveData: saveData === 'true',
      effectiveType: effectiveType || undefined,
    }),
    quality: Number(quality) as 360 | 480 | 720,
  }
}
