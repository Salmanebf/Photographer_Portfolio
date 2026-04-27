'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { MapPin, Clock, Award, ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { DocumentaryProject } from '@/lib/data'
import { useScrollReveal } from '@/hooks/use-scroll-effects'
import VideoPlayer from './video-player'

interface ProjectDetailPageProps {
  project: DocumentaryProject
}

export default function ProjectDetailPage({ project }: ProjectDetailPageProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])

  const { ref: synopsisRef, isRevealed: synopsisRevealed } = useScrollReveal(0.1)
  const { ref: galleryRef, isRevealed: galleryRevealed } = useScrollReveal(0.05)
  const { ref: sidebarRef, isRevealed: sidebarRevealed } = useScrollReveal(0.1)

  return (
    <article>
      {/* Hero — video player or image */}
      <div ref={heroRef} className="relative h-[70vh] sm:h-[85vh] overflow-hidden bg-background">
        <motion.div style={{ scale: heroScale, y: heroY }} className="absolute inset-0">
          <VideoPlayer
            url={project.video}
            poster={project.image}
            title={project.title}
          />
        </motion.div>

        {/* Top backdrop — gives the nav contrast against the image */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background via-background/70 to-transparent z-[2] pointer-events-none" />

        {/* Bottom fade into page */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/40 to-transparent z-[2] pointer-events-none" />

        {/* Letterbox bars */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 left-0 right-0 h-[5vh] bg-background origin-left z-[3]"
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-0 right-0 h-[5vh] bg-gradient-to-t from-background to-transparent origin-right z-[3]"
        />

        {/* Back link — sits above the play button area */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="absolute top-24 left-6 lg:left-10 z-[20]"
        >
          <Link
            href="/#portfolio"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-gold transition-colors duration-300 group bg-background/70 backdrop-blur-md px-4 py-2.5 border border-border/40 hover:border-gold/40"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            All Films
          </Link>
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 pb-24 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <span className="inline-block text-[9px] uppercase tracking-[0.5em] text-gold mb-4">
            {project.category}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-foreground">
            {project.title}
          </h1>
          {project.subtitle && (
            <p className="text-lg text-muted-foreground italic max-w-2xl leading-relaxed">
              {project.subtitle}
            </p>
          )}
        </motion.div>

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

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
          <div className="space-y-12">
            <div
              ref={synopsisRef}
              className={`slide-left ${synopsisRevealed ? 'revealed' : ''}`}
            >
              <h2 className="text-[9px] uppercase tracking-[0.5em] text-gold mb-5">
                Synopsis
              </h2>
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {project.fullDescription}
              </p>
            </div>

            <div
              ref={galleryRef}
              className={`scale-fade ${galleryRevealed ? 'revealed' : ''}`}
            >
              <h2 className="text-[9px] uppercase tracking-[0.5em] text-gold mb-5">
                Gallery
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.gallery.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="aspect-video overflow-hidden group relative"
                  >
                    <Image
                      src={img}
                      alt={`${project.title} — gallery image ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <aside
            ref={sidebarRef}
            className={`slide-right ${sidebarRevealed ? 'revealed' : ''} space-y-10`}
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
                    <span className="text-sm text-foreground leading-snug">{award}</span>
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

            {project.tags.length > 0 && (
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
            )}

            <Link
              href="/#contact"
              className="group flex items-center justify-center gap-2 w-full px-6 py-4 bg-gold text-background font-semibold text-[11px] uppercase tracking-[0.25em] hover:bg-gold/90 transition-all duration-300"
            >
              Discuss This Project
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </aside>
        </div>
      </div>
    </article>
  )
}
