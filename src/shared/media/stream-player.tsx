/**
 * StreamPlayer — click-to-play film player.
 *
 *  - Bunny Stream  (`bunny:<id>`)  adaptive HLS; hls.js is only downloaded on click
 *                                  (Safari plays HLS natively), MP4 fallback otherwise
 *  - YouTube / Vimeo URLs          embeds, created on click
 *  - Direct video files            native <video>
 *
 * Nothing but the poster loads until the visitor presses play. If there is no
 * playable source, only the poster is rendered.
 */
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { bunnyUrls, parseVideoRef } from './sources'
import VideoLoop from './video-loop'

interface StreamPlayerProps {
  url?: string | null
  poster: string
  title: string
  /** When true, plays as a silent looping background instead of click-to-play */
  ambient?: boolean
}

function BunnyPlayer({ id, poster, title }: { id: string; poster: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    const { hls, mp4 } = bunnyUrls(id)
    if (!video || !hls) return

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hls // Safari / iOS: native HLS
      void video.play().catch(() => {})
      return
    }

    let cancelled = false
    let instance: { destroy(): void } | undefined
    import('hls.js').then(({ default: Hls }) => {
      if (cancelled) return
      if (!Hls.isSupported()) {
        video.src = mp4(720) ?? ''
        void video.play().catch(() => {})
        return
      }
      const h = new Hls()
      instance = h
      h.loadSource(hls)
      h.attachMedia(video)
      h.on(Hls.Events.MANIFEST_PARSED, () => void video.play().catch(() => {}))
    })
    return () => {
      cancelled = true
      instance?.destroy()
    }
  }, [id])

  return (
    <video
      ref={ref}
      controls
      playsInline
      poster={poster}
      aria-label={title}
      className="w-full h-full object-cover bg-background"
    />
  )
}

export default function StreamPlayer({ url, poster, title, ambient }: StreamPlayerProps) {
  const t = useTranslations('video')
  const [playing, setPlaying] = useState(false)

  let ref = parseVideoRef(url)
  // A Bunny reference with no CDN host configured cannot play — show the poster only.
  if (ref?.kind === 'bunny' && !bunnyUrls(ref.id).enabled) ref = null

  if (ambient && (ref?.kind === 'file' || ref?.kind === 'bunny')) {
    return <VideoLoop eager src={url} poster={poster} className="w-full h-full object-cover" />
  }

  if (playing && ref) {
    switch (ref.kind) {
      case 'bunny':
        return <BunnyPlayer id={ref.id} poster={poster} title={title} />
      case 'youtube':
        return (
          <iframe
            src={`https://www.youtube.com/embed/${ref.id}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="w-full h-full"
          />
        )
      case 'vimeo':
        return (
          <iframe
            src={`https://player.vimeo.com/video/${ref.id}?autoplay=1`}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        )
      case 'file':
        return (
          <video
            src={ref.url}
            autoPlay
            controls
            playsInline
            poster={poster}
            className="w-full h-full object-cover bg-background"
          />
        )
    }
  }

  // Default: poster + play button
  return (
    <div className="relative w-full h-full group">
      <Image src={poster} alt={title} fill priority sizes="100vw" className="object-cover" />

      {ref && (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={t('play', { title })}
          className="absolute inset-0 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
          data-cursor="hover"
        >
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-background/30 backdrop-blur-md border border-gold/40 flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-400"
          >
            <Play
              size={28}
              className="text-gold ms-1 group-hover:text-background group-hover:scale-110 transition-all"
            />
            <span className="absolute inset-0 rounded-full border border-gold/30 animate-ping pointer-events-none" />
          </motion.span>
        </button>
      )}
    </div>
  )
}
