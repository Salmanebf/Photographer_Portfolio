'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useCountUp } from '@/hooks/use-scroll-effects'

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

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.5], ['0%', '20%'])

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative h-screen flex items-center overflow-hidden"
    >
      {/* Parallax background image */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 z-0"
      >
        <img
          src="/images/hero-doc.png"
          alt=""
          className="w-full h-[120%] object-cover"
        />
      </motion.div>

      {/* Cinematic overlay */}
      <div className="absolute inset-0 z-[1] bg-background/85" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-background via-background/40 to-background/60" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-background/50 via-transparent to-background/50" />

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

      {/* Main content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 w-full px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mb-8 sm:mb-10"
        >
          <div className="h-px w-12 bg-gold/50" />
          <span className="text-[9px] uppercase tracking-[0.5em] text-gold font-medium">
            Documentary Filmmaker
          </span>
        </motion.div>

        {/* Massive name */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-[18vw] sm:text-[15vw] lg:text-[13vw] font-bold leading-[0.85] tracking-tight text-foreground"
          >
            Alex
          </motion.h1>
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
            Rivera
          </motion.h1>
        </div>

        {/* Tagline + CTA + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 mt-10 sm:mt-12 items-end">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <p className="text-muted-foreground text-sm sm:text-base max-w-md leading-relaxed mb-8">
              Telling stories that illuminate the human condition.
              Documenting cultures, uncovering truths, revealing the extraordinary.
            </p>
            <a
              href="#portfolio"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-gold text-background text-[11px] uppercase tracking-[0.25em] font-semibold hover:bg-gold/90 transition-all duration-300 hover:shadow-lg hover:shadow-gold/20"
            >
              View My Films
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="flex items-end gap-8 sm:gap-12"
          >
            <StatCounter end={18} label="Films" suffix="+" />
            <div className="w-px h-10 bg-border" />
            <StatCounter end={12} label="Years" />
            <div className="w-px h-10 bg-border" />
            <StatCounter end={34} label="Awards" suffix="+" />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator — right side */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute right-6 sm:right-10 bottom-[10vh] z-10 hidden sm:flex flex-col items-center gap-3"
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

      {/* Side info — left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute left-10 bottom-[10vh] z-10 hidden lg:flex flex-col items-center gap-4"
      >
        <span className="text-[8px] uppercase tracking-[0.4em] text-muted-foreground -rotate-90 origin-center whitespace-nowrap">
          Est. 2012 — Los Angeles
        </span>
      </motion.div>
    </section>
  )
}
