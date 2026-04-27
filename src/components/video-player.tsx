/**
 * VideoPlayer
 *
 * Smart wrapper that supports:
 *  - YouTube URLs (youtube.com/watch?v=..., youtu.be/...)
 *  - Vimeo URLs   (vimeo.com/...)
 *  - Native video files (.mp4, .webm, etc.)
 *
 * Renders a poster image with a play button overlay; clicking swaps in
 * the embed/video element. If `url` is empty, just renders the poster.
 */
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import Image from 'next/image'

interface VideoPlayerProps {
  url?: string | null
  poster: string
  title: string
  /** When true, autoplays muted as a hero background instead of click-to-play */
  ambient?: boolean
}

function getYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  )
  return m ? m[1] : null
}

function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return m ? m[1] : null
}

export default function VideoPlayer({ url, poster, title, ambient }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false)

  const ytId = url ? getYouTubeId(url) : null
  const vimeoId = url ? getVimeoId(url) : null
  const isNative = url && !ytId && !vimeoId

  // Ambient background mode (silent autoplay)
  if (ambient && url && isNative) {
    return (
      <video
        src={url}
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        className="w-full h-full object-cover"
      />
    )
  }

  // Playing state — render the actual player
  if (playing) {
    if (ytId) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="w-full h-full"
        />
      )
    }
    if (vimeoId) {
      return (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      )
    }
    if (isNative) {
      return (
        <video
          src={url!}
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
      <Image
        src={poster}
        alt={title}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {url && (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play ${title} trailer`}
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
              className="text-gold ml-1 group-hover:text-background group-hover:scale-110 transition-all"
            />
            <span className="absolute inset-0 rounded-full border border-gold/30 animate-ping pointer-events-none" />
          </motion.span>
        </button>
      )}
    </div>
  )
}
