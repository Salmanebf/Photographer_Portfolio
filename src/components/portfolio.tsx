'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useScrollReveal } from '@/hooks/use-scroll-effects'
import type { DocumentaryProject } from '@/lib/data'
import SectionHeading from './section-heading'

interface PortfolioProps {
  projects: DocumentaryProject[]
}

export default function Portfolio({ projects }: PortfolioProps) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const { ref: filterRef, isRevealed: filterRevealed } = useScrollReveal(0.2)

  const categories = useMemo(() => {
    const set = new Set<string>(['All'])
    projects.forEach((p) => set.add(p.category))
    return Array.from(set)
  }, [projects])

  const filteredProjects = useMemo(
    () =>
      activeFilter === 'All'
        ? projects
        : projects.filter((p) => p.category === activeFilter),
    [projects, activeFilter]
  )

  const displayProject = filteredProjects.find((p) => p.id === hoveredId) ?? null

  if (projects.length === 0) {
    return null
  }

  return (
    <section id="portfolio" className="py-24 sm:py-36 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          label="Selected Works"
          title="Documentary Films"
          description="Each film is a journey into real stories that shape our understanding of the world."
          align="left"
        />

        <div
          ref={filterRef}
          className={`flex flex-wrap gap-x-6 gap-y-3 mb-16 blur-in ${
            filterRevealed ? 'revealed' : ''
          }`}
          role="tablist"
          aria-label="Filter projects by category"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeFilter === cat}
              onClick={() => setActiveFilter(cat)}
              className={`text-[10px] uppercase tracking-[0.3em] font-medium pb-1.5 transition-all duration-400 border-b ${
                activeFilter === cat
                  ? 'text-gold border-gold'
                  : 'text-muted-foreground hover:text-foreground border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Desktop: editorial list + sticky image panel */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_440px] gap-16 items-start">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {filteredProjects.map((project, i) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    index={i}
                    onHover={setHoveredId}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="sticky top-28">
            <div className="relative aspect-[3/4] overflow-hidden border border-border/40">
              {/* Empty state — visible until user hovers a project */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 pointer-events-none">
                <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center mb-5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                </div>
                <div className="text-[9px] uppercase tracking-[0.5em] text-gold mb-3">
                  Preview
                </div>
                <p className="text-sm text-muted-foreground max-w-[200px] leading-relaxed">
                  Hover any film to preview
                </p>
              </div>

              <AnimatePresence mode="wait">
                {displayProject && (
                  <motion.div
                    key={displayProject.id}
                    initial={{ opacity: 0, scale: 1.06, clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
                    animate={{ opacity: 1, scale: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
                    exit={{ opacity: 0, scale: 1.02, clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={displayProject.image}
                      alt={displayProject.title}
                      fill
                      sizes="440px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.25, duration: 0.5 }}
                      className="absolute bottom-0 left-0 right-0 p-6"
                    >
                      <div className="text-[9px] uppercase tracking-[0.4em] text-gold mb-2">
                        {displayProject.category}
                      </div>
                      <div className="text-2xl font-bold text-foreground leading-tight">
                        {displayProject.title}
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-2">
                        {displayProject.location} · {displayProject.year}
                      </div>
                    </motion.div>

                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                      <span className="text-[8px] uppercase tracking-[0.4em] text-gold">
                        Previewing
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute -bottom-3 -right-3 w-full h-full border border-gold/10 -z-10 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Mobile: card grid */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredProjects.map((project, i) => (
            <MobileProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectRow({
  project,
  index,
  onHover,
}: {
  project: DocumentaryProject
  index: number
  onHover: (id: string | null) => void
}) {
  const { ref, isRevealed } = useScrollReveal(0.05)
  const num = String(index + 1).padStart(2, '0')

  return (
    <div
      ref={ref}
      className={`slide-left ${isRevealed ? 'revealed' : ''}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <Link
        href={`/work/${project.slug}`}
        onMouseEnter={() => onHover(project.id)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(project.id)}
        onBlur={() => onHover(null)}
        className="group block py-7 border-b border-border/40 hover:border-gold/30 transition-all duration-500 hover:translate-x-1.5"
      >
        <div className="flex items-start justify-between gap-8">
          <div className="flex items-start gap-6 flex-1 min-w-0">
            <span className="text-gold text-[10px] tracking-[0.3em] font-medium mt-2.5 shrink-0 tabular-nums">
              {num}
            </span>

            <div className="flex-1 min-w-0">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-gold transition-colors duration-400 truncate">
                {project.title}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                <span>{project.location}</span>
                <span className="text-gold/40">·</span>
                <span>{project.year}</span>
                <span className="text-gold/40">·</span>
                <span>{project.duration}</span>
              </div>
            </div>
          </div>

          <ArrowUpRight
            size={22}
            className="shrink-0 mt-2 text-muted-foreground/30 group-hover:text-gold group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300"
          />
        </div>
      </Link>
    </div>
  )
}

function MobileProjectCard({
  project,
  index,
}: {
  project: DocumentaryProject
  index: number
}) {
  const { ref, isRevealed } = useScrollReveal(0.1)
  const num = String(index + 1).padStart(2, '0')

  return (
    <div
      ref={ref}
      className={`scale-fade ${isRevealed ? 'revealed' : ''}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <Link href={`/work/${project.slug}`} className="group block">
        <div className="aspect-[4/3] overflow-hidden relative mb-4">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="text-gold text-[9px] tracking-[0.3em] font-medium">{num}</span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-foreground bg-background/60 backdrop-blur-sm px-2 py-1">
              {project.category}
            </span>
          </div>
        </div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-foreground group-hover:text-gold transition-colors">
            {project.title}
          </h3>
          <ArrowUpRight
            size={18}
            className="text-gold shrink-0 mt-0.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
          />
        </div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1.5">
          {project.location} · {project.year}
        </p>
      </Link>
    </div>
  )
}
