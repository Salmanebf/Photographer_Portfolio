'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useScrollReveal } from '@/hooks/use-scroll-effects'
import { projects, DocumentaryProject } from '@/lib/data'
import SectionHeading from './section-heading'

const categories = [
  'All',
  'Cultural Heritage',
  'Environmental',
  'Social Impact',
  'Cultural Preservation',
]

interface PortfolioProps {
  onSelectProject: (project: DocumentaryProject) => void
}

export default function Portfolio({ onSelectProject }: PortfolioProps) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const { ref: filterRef, isRevealed: filterRevealed } = useScrollReveal(0.2)

  const filteredProjects =
    activeFilter === 'All' ? projects : projects.filter((p) => p.category === activeFilter)

  const displayProject =
    filteredProjects.find((p) => p.id === hoveredId) ?? filteredProjects[0]

  return (
    <section id="portfolio" className="py-24 sm:py-36 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          label="Selected Works"
          title="Documentary Films"
          description="Each film is a journey into real stories that shape our understanding of the world."
          align="left"
        />

        {/* Category filters — text tabs */}
        <div
          ref={filterRef}
          className={`flex flex-wrap gap-x-6 gap-y-3 mb-16 blur-in ${
            filterRevealed ? 'revealed' : ''
          }`}
        >
          {categories.map((cat) => (
            <button
              key={cat}
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
          {/* Project list */}
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
                    onClick={() => onSelectProject(project)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sticky hover-reveal image panel */}
          <div className="sticky top-28">
            <div className="relative aspect-[3/4] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayProject?.id ?? 'default'}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={displayProject?.image}
                    alt={displayProject?.title ?? ''}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

                  {/* Project info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-[9px] uppercase tracking-[0.4em] text-gold mb-2">
                      {displayProject?.category}
                    </div>
                    <div className="text-2xl font-bold text-foreground leading-tight">
                      {displayProject?.title}
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-2">
                      {displayProject?.location} · {displayProject?.year}
                    </div>
                  </div>

                  {/* Corner indicator */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                    <span className="text-[8px] uppercase tracking-[0.4em] text-gold">
                      {hoveredId ? 'Hovering' : 'Latest'}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Decorative gold offset */}
              <div className="absolute -bottom-3 -right-3 w-full h-full border border-gold/10 -z-10 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Mobile: card grid */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredProjects.map((project, i) => (
            <MobileProjectCard
              key={project.id}
              project={project}
              index={i}
              onClick={() => onSelectProject(project)}
            />
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
  onClick,
}: {
  project: DocumentaryProject
  index: number
  onHover: (id: string | null) => void
  onClick: () => void
}) {
  const { ref, isRevealed } = useScrollReveal(0.05)
  const num = String(index + 1).padStart(2, '0')

  return (
    <div
      ref={ref}
      className={`slide-left ${isRevealed ? 'revealed' : ''}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <motion.button
        onClick={onClick}
        onHoverStart={() => onHover(project.id)}
        onHoverEnd={() => onHover(null)}
        whileHover={{ x: 6 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="group w-full text-left py-7 border-b border-border/40 flex items-start justify-between gap-8 hover:border-gold/30 transition-colors duration-500"
      >
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
      </motion.button>
    </div>
  )
}

function MobileProjectCard({
  project,
  index,
  onClick,
}: {
  project: DocumentaryProject
  index: number
  onClick: () => void
}) {
  const { ref, isRevealed } = useScrollReveal(0.1)
  const num = String(index + 1).padStart(2, '0')

  return (
    <div
      ref={ref}
      className={`scale-fade ${isRevealed ? 'revealed' : ''}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <button onClick={onClick} className="group w-full text-left">
        <div className="aspect-[4/3] overflow-hidden relative mb-4">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
      </button>
    </div>
  )
}
