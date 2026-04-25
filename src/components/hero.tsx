'use client'

import { motion } from 'framer-motion'
import { ChevronDown, Play } from 'lucide-react'

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-cinematic.png"
          alt="Cinematic videography scene"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      </div>

      {/* Film grain texture */}
      <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-1.5 border border-amber/30 rounded-full text-amber text-xs uppercase tracking-[0.3em] font-medium">
            Cinematographer & Visual Storyteller
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-6"
        >
          <span className="text-gradient">Alex</span>
          <br />
          <span className="text-foreground">Rivera</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Crafting cinematic stories that move hearts and captivate audiences.
          Over a decade of turning visions into unforgettable visual experiences.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#portfolio"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-amber text-amber-foreground font-semibold text-sm uppercase tracking-widest rounded-sm transition-all duration-300 hover:bg-amber/90 hover:shadow-lg hover:shadow-amber/20"
          >
            <Play size={16} className="transition-transform group-hover:scale-110" />
            View My Work
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-2 px-8 py-4 border border-border text-foreground font-semibold text-sm uppercase tracking-widest rounded-sm transition-all duration-300 hover:border-amber hover:text-amber"
          >
            Get In Touch
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 flex items-center justify-center gap-8 sm:gap-16"
        >
          {[
            { value: '200+', label: 'Projects' },
            { value: '12', label: 'Years Exp' },
            { value: '50+', label: 'Awards' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-amber">{stat.value}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
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

      {/* Side decoration */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-4">
        <div className="w-px h-20 bg-gradient-to-b from-transparent to-amber/40" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground -rotate-90 origin-center whitespace-nowrap">
          Est. 2012
        </span>
        <div className="w-px h-20 bg-gradient-to-b from-amber/40 to-transparent" />
      </div>
    </section>
  )
}
