'use client'

import { useEffect, useRef, useState } from 'react'
import { clipSource, parseVideoRef } from './sources'
import { pagePlayback, type PlaybackLimiter } from './playback-limiter'
import { useMediaPrefs } from './use-media-prefs'

interface VideoLoopProps {
  /** Video reference string: `bunny:<id>`, or a direct .mp4/.webm URL */
  src?: string | null
  /** Shown until (and instead of) playback */
  poster?: string
  className?: string
  /** Assume on-screen at first paint, so above-the-fold clips start without waiting for the observer */
  eager?: boolean
  /** Which "at most N clips at once" allowance this clip counts against (default: the page-wide one) */
  limiter?: PlaybackLimiter
  /** Rest (stop loading and playing) while true, e.g. a card face that is turned away */
  suspended?: boolean
  /** Never fetch a clip sharper than this (small cards do not need 720p) */
  maxQuality?: 360 | 480 | 720
}

/**
 * A muted, looping background clip that is cheap by default:
 *  - requests NO video bytes until it is on screen and the viewer allows autoplay
 *  - pauses (and frees its play slot) when scrolled away or the tab is hidden, and
 *    resumes when it is back
 *  - at most a few clips play at once across the page
 *  - falls back to the poster for reduced-motion / data-saver / slow connections
 */
export default function VideoLoop({
  src,
  poster,
  className,
  eager,
  limiter = pagePlayback,
  suspended = false,
  maxQuality,
}: VideoLoopProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [visible, setVisible] = useState(Boolean(eager))
  const [tabHidden, setTabHidden] = useState(false)
  const { autoplay, quality } = useMediaPrefs()

  const url = clipSource(
    parseVideoRef(src),
    maxQuality ? (Math.min(quality, maxQuality) as 360 | 480 | 720) : quality
  )
  // A clip that cannot be loaded is given up on (the poster / picture underneath stays visible)
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const failed = url !== null && failedUrl === url
  const loadable = Boolean(url) && autoplay && visible && !tabHidden && !failed
  // `suspended` keeps the clip loaded (so it resumes with no flicker) but not playing
  const active = loadable && !suspended

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

    const release = limiter.acquire(() => el.pause())
    // no first frame after a long wait = treat it as failed
    const giveUp = window.setTimeout(() => {
      if (el.readyState < 2) setFailedUrl(url)
    }, 12000)
    el.play().catch(() => {
      /* autoplay blocked — the poster stays visible */
    })

    return () => {
      window.clearTimeout(giveUp)
      release()
      el.pause()
    }
  }, [active, url, limiter])

  return (
    <video
      ref={videoRef}
      src={loadable && url ? url : undefined}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      onError={() => setFailedUrl(url)}
      aria-hidden="true"
      tabIndex={-1}
      className={className}
    />
  )
}
