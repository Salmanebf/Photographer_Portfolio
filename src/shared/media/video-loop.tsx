'use client'

import { useEffect, useRef, useState } from 'react'
import { clipSource, parseVideoRef } from './sources'
import { pagePlayback } from './playback-limiter'
import { useMediaPrefs } from './use-media-prefs'

interface VideoLoopProps {
  /** Video reference string: `bunny:<id>`, or a direct .mp4/.webm URL */
  src?: string | null
  /** Shown until (and instead of) playback */
  poster?: string
  className?: string
  /** Assume on-screen at first paint, so above-the-fold clips start without waiting for the observer */
  eager?: boolean
}

/**
 * A muted, looping background clip that is cheap by default:
 *  - requests NO video bytes until it is on screen and the viewer allows autoplay
 *  - pauses (and frees its play slot) when scrolled away or the tab is hidden, and
 *    resumes when it is back
 *  - at most a few clips play at once across the page
 *  - falls back to the poster for reduced-motion / data-saver / slow connections
 */
export default function VideoLoop({ src, poster, className, eager }: VideoLoopProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [visible, setVisible] = useState(Boolean(eager))
  const [tabHidden, setTabHidden] = useState(false)
  const { autoplay, quality } = useMediaPrefs()

  const url = clipSource(parseVideoRef(src), quality)
  const active = Boolean(url) && autoplay && visible && !tabHidden

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      rootMargin: '200px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    const el = videoRef.current
    if (!el || !active) return

    const release = pagePlayback.acquire(() => el.pause())
    el.play().catch(() => {
      /* autoplay blocked — the poster stays visible */
    })

    return () => {
      release()
      el.pause()
    }
  }, [active, url])

  return (
    <video
      ref={videoRef}
      src={active && url ? url : undefined}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      className={className}
    />
  )
}
