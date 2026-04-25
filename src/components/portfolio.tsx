'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useScrollReveal } from '@/hooks/use-scroll-effects'
import { projects, DocumentaryProject } from '@/lib/data'
import SectionHeading from './section-heading'

const categories = ['All', 'Cultural Heritage', 'Environmental', 'Social Impact', 'Cultural Preservation']

interface PortfolioProps {
  onSelectProject: (project: DocumentaryProject) => void
}

export default function Portfolio({ onSelectProject }: PortfolioProps) {
  const [activeFilter, setActiveFilter] = useState('All')
  const { ref: filterRef, isRevealed: filterRevealed } = useScrollReveal(0.2)

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category === activeFilter)

  return (
    <section id="portfolio" className="py-24 sm:py-36 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading
          label="Films"
          title="Documentary Works"
          description="Each film is a journey — deep dives into real stories that shape our understanding of the world."
        />

        {/* Filter */}
        <div ref={filterRef} className={`flex flex-wrap justify-center gap-2 mb-14 blur-in ${filterRevealed ? 'revealed' : ''}`}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 border ${
                activeFilter === cat
                  ? 'bg-[#ffb005] text-black border-[#ffb005]'
                  : 'bg-transparent text-muted-foreground border-border hover:border-[#ffb005]/40 hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects - Horizontal scroll on mobile, grid on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, i) => (
            <ProjectCard
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

function ProjectCard({ project, index, onClick }: { project: DocumentaryProject; index: number; onClick: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start']
  })

  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15])
  const { ref: revealRef, isRevealed } = useScrollReveal(0.1)

  return (
    <div ref={revealRef} className={`scale-fade ${isRevealed ? 'revealed' : ''}`} style={{ transitionDelay: `${index * 100}ms` }}>
      <motion.div
        ref={cardRef}
        onClick={onClick}
        className="group relative overflow-hidden cursor-pointer bg-card border border-border/50 hover:border-[#ffb005]/30 transition-all duration-500"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image */}
        <div className="aspect-[16/10] overflow-hidden relative">
          <motion.img
            src={project.image}
            alt={project.title}
            style={{ scale: imgScale }}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

          {/* Category badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 bg-[#ffb005]/10 backdrop-blur-sm border border-[#ffb005]/20 text-[#ffb005] text-[10px] uppercase tracking-[0.2em] font-medium">
              {project.category}
            </span>
          </div>

          {/* Year badge */}
          <div className="absolute top-4 right-4 z-10">
            <span className="px-2 py-1 bg-background/60 backdrop-blur-sm text-[11px] text-muted-foreground font-medium">
              {project.year}
            </span>
          </div>

          {/* Play/View button - appears on hover */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-14 h-14 rounded-full bg-[#ffb005]/10 backdrop-blur-sm border border-[#ffb005]/30 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500">
              <ArrowUpRight size={20} className="text-[#ffb005]" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <h3 className="text-lg font-bold text-foreground group-hover:text-[#ffb005] transition-colors duration-300 flex items-center gap-2">
            {project.title}
          </h3>
          <p className="text-[#ffb005]/70 text-xs uppercase tracking-[0.2em] mt-1 mb-3">
            {project.location} &middot; {project.duration}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {project.shortDescription}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-[10px] text-muted-foreground bg-muted/50 border border-border/50">
                {tag}
              </span>
            ))}
          </div>

          {/* View details link */}
          <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#ffb005] font-medium group-hover:tracking-[0.3em] transition-all duration-300">
              View Details
            </span>
            <ArrowUpRight size={14} className="text-[#ffb005] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
