'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useCountUp } from '@/shared/hooks/use-scroll-effects'
import type { SiteSettings } from '@/lib/queries'
import Magnetic from '@/shared/effects/magnetic'

function StatCounter({
  end,
  label,
  suffix = '',
}: {
  end: number
  label: string
  suffix?: string
}) {
  const { count, ref } = useCountUp(end, 2000)
  return (
    <div ref={ref}>
      <div className="text-2xl sm:text-3xl font-bold text-gold tabular-nums leading-none">
        {count}
        {suffix}
      </div>
      <div className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground mt-2">
        {label}
      </div>
    </div>
  )
}

interface HeroProps {
  settings: SiteSettings
}

export default function Hero({ settings }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.5], ['0%', '20%'])

  const { hero } = settings

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative h-screen flex items-center overflow-hidden"
    >
      {/* Parallax background — image or video */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute -inset-y-[10%] inset-x-0 z-0"
      >
        {hero.video ? (
          <video
            src={hero.video}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster={hero.image}
          />
        ) : (
          <Image
            src={hero.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
      </motion.div>

      {/* Cinematic overlay — vignette style so the image stays visible */}
      <div className="absolute inset-0 z-[1] bg-background/30" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-background via-background/30 to-background/55" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-background/55 via-background/15 to-background/55" />
      {/* Bottom-left vignette to keep stats readable */}
      <div className="absolute bottom-0 left-0 w-2/3 h-2/3 z-[1] bg-gradient-to-tr from-background/70 via-background/15 to-transparent" />

      {/* Letterbox bars */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 right-0 h-[6vh] bg-background z-[2] origin-left"
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-0 right-0 h-[6vh] bg-background z-[2] origin-right"
      />

      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 w-full px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mb-8 sm:mb-10"
        >
          <div className="h-px w-12 bg-gold/50" />
          <span className="text-[9px] uppercase tracking-[0.5em] text-gold font-medium">
            {hero.eyebrow}
          </span>
        </motion.div>

        <div className="overflow-hidden">
          <motion.div aria-hidden="true"
            aria-label={`${hero.nameLine1} ${hero.nameLine2}`}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-[18vw] sm:text-[15vw] lg:text-[13vw] font-bold leading-[0.85] tracking-tight text-foreground"
          >
            {hero.nameLine1}
          </motion.div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-px bg-gold/40 my-2 sm:my-3 origin-left max-w-[70%]"
        />

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-[18vw] sm:text-[15vw] lg:text-[13vw] font-bold leading-[0.85] tracking-tight text-gradient"
          >
            {hero.nameLine2}
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 mt-10 sm:mt-12 items-end">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <p className="text-muted-foreground text-sm sm:text-base max-w-md leading-relaxed mb-8">
              {hero.tagline}
            </p>
            <Magnetic className="inline-block">
              <a
                href="#portfolio"
                onClick={(e) => {
                  e.preventDefault()
                  document
                    .getElementById('portfolio')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-gold text-background text-[11px] uppercase tracking-[0.25em] font-semibold hover:bg-gold/90 transition-all duration-300 hover:shadow-lg hover:shadow-gold/20"
                data-cursor="hover"
              >
                View My Films
              </a>
            </Magnetic>
          </motion.div>

          {hero.stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="flex items-end gap-8 sm:gap-12"
            >
              {hero.stats.map((s, i) => (
                <div key={s.label} className="flex items-end gap-8 sm:gap-12">
                  {i > 0 && <div className="w-px h-10 bg-border" />}
                  <StatCounter end={s.value} label={s.label} suffix={s.suffix} />
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute right-6 sm:right-10 bottom-[10vh] z-10 hidden sm:flex flex-col items-center gap-3"
        aria-hidden="true"
      >
        <motion.div
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="w-px h-16 bg-gradient-to-b from-transparent via-gold/50 to-transparent origin-top"
        />
        <span className="text-[8px] uppercase tracking-[0.4em] text-muted-foreground -rotate-90 origin-center whitespace-nowrap mt-3">
          Scroll
        </span>
      </motion.div>
    </section>
  )
}
