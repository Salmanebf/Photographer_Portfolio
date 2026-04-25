'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Clock, Award, ArrowRight, Play } from 'lucide-react'
import { DocumentaryProject } from '@/lib/data'
import { useLockBodyScroll } from '@/hooks/use-scroll-effects'

interface ProjectDetailProps {
  project: DocumentaryProject | null
  onClose: () => void
}

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useLockBodyScroll(!!project)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-xl overflow-y-auto"
          ref={scrollRef}
        >
          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={onClose}
            className="fixed top-6 right-6 z-[70] w-12 h-12 flex items-center justify-center border border-border hover:border-[#ffb005]/40 text-muted-foreground hover:text-[#ffb005] transition-all duration-300 bg-background/80 backdrop-blur-sm"
            aria-label="Close project details"
          >
            <X size={20} />
          </motion.button>

          <div className="max-w-6xl mx-auto">
            {/* Hero Image */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'top' }}
              className="relative h-[50vh] sm:h-[60vh] overflow-hidden"
            >
              <motion.img
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#ffb005]/10 backdrop-blur-sm border border-[#ffb005]/30 flex items-center justify-center cursor-pointer hover:bg-[#ffb005]/20 transition-colors group"
                >
                  <Play size={28} className="text-[#ffb005] ml-1 group-hover:scale-110 transition-transform" />
                  {/* Pulse ring */}
                  <div className="absolute inset-0 rounded-full border border-[#ffb005]/20 animate-ping" />
                </motion.div>
              </div>
            </motion.div>

            {/* Content */}
            <div className="px-4 sm:px-8 lg:px-12 pb-20 -mt-20 relative z-10">
              {/* Title block */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <span className="inline-block px-3 py-1 bg-[#ffb005]/10 border border-[#ffb005]/20 text-[#ffb005] text-[10px] uppercase tracking-[0.3em] font-medium mb-4">
                  {project.category}
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-3">
                  {project.title}
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground italic leading-relaxed max-w-3xl">
                  {project.subtitle}
                </p>
              </motion.div>

              {/* Meta row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-wrap gap-6 mt-8 mb-10 pb-8 border-b border-border/50"
              >
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-[#ffb005]" />
                  <span className="text-muted-foreground">{project.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-[#ffb005]" />
                  <span className="text-muted-foreground">{project.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award size={16} className="text-[#ffb005]" />
                  <span className="text-muted-foreground">{project.awards.length} Awards</span>
                </div>
              </motion.div>

              {/* Two column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main content */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="lg:col-span-2 space-y-8"
                >
                  {/* Synopsis */}
                  <div>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#ffb005] font-semibold mb-4">Synopsis</h2>
                    <p className="text-foreground leading-relaxed text-base">
                      {project.fullDescription}
                    </p>
                  </div>

                  {/* Gallery */}
                  <div>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#ffb005] font-semibold mb-4">Gallery</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {project.gallery.map((img, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                          className="aspect-video overflow-hidden group"
                        >
                          <img
                            src={img}
                            alt={`${project.title} gallery ${i + 1}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Sidebar */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="space-y-8"
                >
                  {/* Awards */}
                  <div>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#ffb005] font-semibold mb-4">Awards</h2>
                    <div className="space-y-3">
                      {project.awards.map((award, i) => (
                        <motion.div
                          key={award}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
                          className="flex items-start gap-3 p-3 bg-muted/20 border border-border/30"
                        >
                          <Award size={14} className="text-[#ffb005] shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{award}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Credits */}
                  <div>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#ffb005] font-semibold mb-4">Credits</h2>
                    <div className="space-y-2.5">
                      {project.credits.map((credit) => (
                        <div key={credit.role} className="flex justify-between items-start gap-4">
                          <span className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground shrink-0">{credit.role}</span>
                          <span className="text-sm text-foreground text-right">{credit.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#ffb005] font-semibold mb-4">Topics</h2>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 text-[11px] bg-muted/30 text-muted-foreground border border-border/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-4 border-t border-border/50">
                    <a
                      href="#contact"
                      onClick={(e) => {
                        e.preventDefault()
                        onClose()
                        setTimeout(() => {
                          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                        }, 500)
                      }}
                      className="group inline-flex items-center gap-2 w-full justify-center px-6 py-4 bg-[#ffb005] text-black font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#ffb005]/90 transition-all duration-300"
                    >
                      Discuss This Project
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
