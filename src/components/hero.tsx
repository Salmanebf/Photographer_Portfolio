'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, Play } from 'lucide-react'
import { useCountUp } from '@/hooks/use-scroll-effects'

function StatCounter({ end, label, suffix = '' }: { end: number; label: string; suffix?: string }) {
  const { count, ref } = useCountUp(end, 2000)
  return (
    <div ref={ref} className="text-center">
      <div className="text-2xl sm:text-4xl font-bold text-[#ffb005]">{count}{suffix}</div>
      <div className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-muted-foreground mt-1">{label}</div>
    </div>
  )
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.5], ['0%', '30%'])

  return (
    <section id="home" ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax background */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 z-0"
      >
        <img
          src="/images/hero-doc.png"
          alt="Documentary filmmaking"
          className="w-full h-[120%] object-cover"
        />
      </motion.div>

      {/* Overlay gradients */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/80 via-background/40 to-background" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-background/60 via-transparent to-background/60" />

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto"
      >
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <span className="inline-block px-5 py-2 border border-[#ffb005]/30 text-[#ffb005] text-[10px] sm:text-xs uppercase tracking-[0.4em] font-medium">
            Documentary Filmmaker & Visual Storyteller
          </span>
        </motion.div>

        {/* Main heading with letter animation */}
        <div className="overflow-hidden mb-6">
          <motion.h1
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight"
          >
            <span className="text-gradient">Alex</span>
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-8">
          <motion.h1
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-foreground"
          >
            Rivera
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-muted-foreground text-sm sm:text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Telling stories that matter. Documenting cultures, uncovering truths,
          and revealing the extraordinary within the ordinary.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#portfolio"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#ffb005] text-black font-semibold text-[11px] sm:text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:shadow-lg hover:shadow-[#ffb005]/20"
          >
            <Play size={16} className="transition-transform group-hover:scale-110" />
            View My Films
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-2 px-8 py-4 border border-border text-foreground font-semibold text-[11px] sm:text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:border-[#ffb005] hover:text-[#ffb005]"
          >
            Start a Project
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-16 flex items-center justify-center gap-8 sm:gap-16"
        >
          <StatCounter end={18} label="Documentaries" suffix="+" />
          <div className="w-px h-10 bg-border" />
          <StatCounter end={12} label="Years" />
          <div className="w-px h-10 bg-border" />
          <StatCounter end={34} label="Awards" suffix="+" />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>

      {/* Side decorations */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-4">
        <div className="w-px h-16 bg-gradient-to-b from-transparent to-[#ffb005]/30" />
        <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground -rotate-90 origin-center whitespace-nowrap">
          Est. 2012
        </span>
        <div className="w-px h-16 bg-gradient-to-b from-[#ffb005]/30 to-transparent" />
      </div>
    </section>
  )
}
