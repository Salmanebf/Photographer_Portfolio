'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Clock, Award, ArrowRight, Play } from 'lucide-react'
import { DocumentaryProject } from '@/lib/data'
import { useLockBodyScroll } from '@/hooks/use-scroll-effects'

interface ProjectDetailProps {
  project: DocumentaryProject | null
  onClose: () => void
}

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  useLockBodyScroll(!!project)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[60] bg-background overflow-y-auto"
        >
          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
            onClick={onClose}
            className="fixed top-6 right-6 z-[70] flex items-center gap-2 text-[9px] uppercase tracking-[0.35em] text-muted-foreground hover:text-gold transition-colors duration-300 bg-background/80 backdrop-blur-sm px-4 py-2.5 border border-border/50 hover:border-gold/40"
            aria-label="Close"
          >
            <X size={12} /> Close
          </motion.button>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[55vh] sm:h-[65vh] overflow-hidden"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

            {/* Cinematic letterbox bars */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 left-0 right-0 h-[5vh] bg-background origin-left"
            />
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 left-0 right-0 h-[5vh] bg-gradient-to-t from-background to-transparent origin-right"
            />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gold/10 backdrop-blur-md border border-gold/40 flex items-center justify-center group hover:bg-gold/20 transition-all"
                aria-label="Play trailer"
              >
                <Play
                  size={28}
                  className="text-gold ml-1 group-hover:scale-110 transition-transform"
                />
                <div className="absolute inset-0 rounded-full border border-gold/20 animate-ping" />
              </motion.button>
            </div>
          </motion.div>

          {/* Content */}
          <div className="max-w-6xl mx-auto px-6 lg:px-10 pb-24">
            {/* Title block */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-10 mt-12"
            >
              <span className="inline-block text-[9px] uppercase tracking-[0.5em] text-gold mb-4">
                {project.category}
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-foreground">
                {project.title}
              </h1>
              <p className="text-lg text-muted-foreground italic max-w-2xl leading-relaxed">
                {project.subtitle}
              </p>
            </motion.div>

            {/* Meta row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-6 sm:gap-10 py-6 border-y border-border/40 mb-12 text-sm"
            >
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gold" />
                <span className="text-muted-foreground">{project.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gold" />
                <span className="text-muted-foreground">
                  {project.duration} · {project.year}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={14} className="text-gold" />
                <span className="text-muted-foreground">
                  {project.awards.length} Awards
                </span>
              </div>
            </motion.div>

            {/* Two-column content */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
              {/* Left: synopsis + gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="space-y-12"
              >
                <div>
                  <h2 className="text-[9px] uppercase tracking-[0.5em] text-gold mb-5">
                    Synopsis
                  </h2>
                  <p className="text-foreground leading-relaxed">
                    {project.fullDescription}
                  </p>
                </div>

                <div>
                  <h2 className="text-[9px] uppercase tracking-[0.5em] text-gold mb-5">
                    Gallery
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.gallery.map((img, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 + i * 0.1, duration: 0.5 }}
                        className="aspect-video overflow-hidden group"
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right: awards + credits */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="space-y-10"
              >
                <div>
                  <h2 className="text-[9px] uppercase tracking-[0.5em] text-gold mb-5">
                    Awards
                  </h2>
                  <div className="space-y-0">
                    {project.awards.map((award, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 py-3 border-b border-border/30 last:border-0"
                      >
                        <div className="w-1 h-1 rounded-full bg-gold mt-2 shrink-0" />
                        <span className="text-sm text-foreground leading-snug">
                          {award}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-[9px] uppercase tracking-[0.5em] text-gold mb-5">
                    Credits
                  </h2>
                  <div className="space-y-3">
                    {project.credits.map((credit) => (
                      <div
                        key={credit.role}
                        className="flex justify-between items-baseline gap-4"
                      >
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {credit.role}
                        </span>
                        <span className="text-sm text-foreground text-right">
                          {credit.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-[9px] uppercase tracking-[0.5em] text-gold mb-4">
                    Topics
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-[10px] text-muted-foreground border border-border/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault()
                    onClose()
                    setTimeout(() => {
                      document
                        .getElementById('contact')
                        ?.scrollIntoView({ behavior: 'smooth' })
                    }, 500)
                  }}
                  className="group flex items-center justify-center gap-2 w-full px-6 py-4 bg-gold text-background font-semibold text-[11px] uppercase tracking-[0.25em] hover:bg-gold/90 transition-all duration-300"
                >
                  Discuss This Project
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
