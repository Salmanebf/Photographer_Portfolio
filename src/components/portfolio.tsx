'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Eye, ArrowUpRight } from 'lucide-react'
import SectionHeading from './section-heading'

const categories = ['All', 'Wedding', 'Commercial', 'Music Video', 'Documentary', 'Short Film']

const projects = [
  {
    id: 1,
    title: 'Eternal Vows',
    category: 'Wedding',
    image: '/images/project-wedding.png',
    description: 'A romantic wedding film capturing the magical union of Sarah & James in Tuscany.',
    year: '2024',
  },
  {
    id: 2,
    title: 'Noir Essence',
    category: 'Commercial',
    image: '/images/project-commercial.png',
    description: 'Luxury fragrance commercial with dramatic liquid dynamics and moody lighting.',
    year: '2024',
  },
  {
    id: 3,
    title: 'Midnight Echo',
    category: 'Music Video',
    image: '/images/project-music.png',
    description: 'Neon-drenched music video featuring urban nightscapes and dynamic performances.',
    year: '2024',
  },
  {
    id: 4,
    title: 'The Last Craftsman',
    category: 'Documentary',
    image: '/images/project-documentary.png',
    description: 'Documentary exploring the vanishing art of traditional craftsmanship in modern times.',
    year: '2023',
  },
  {
    id: 5,
    title: 'Island Dreams',
    category: 'Documentary',
    image: '/images/project-travel.png',
    description: 'Breathtaking aerial travel film capturing the pristine beauty of remote islands.',
    year: '2023',
  },
  {
    id: 6,
    title: 'Shadows & Light',
    category: 'Short Film',
    image: '/images/project-shortfilm.png',
    description: 'Award-winning short film exploring the duality of human nature through noir aesthetics.',
    year: '2023',
  },
]

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category === activeFilter)

  return (
    <section id="portfolio" className="py-20 sm:py-32 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading
          label="Portfolio"
          title="Selected Works"
          description="A curated collection of my recent projects spanning weddings, commercials, music videos, and documentary filmmaking."
        />

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-widest font-medium rounded-sm transition-all duration-300 ${
                activeFilter === cat
                  ? 'bg-amber text-amber-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative overflow-hidden rounded-sm cursor-pointer"
              >
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  {/* Play button */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={hoveredId === project.id ? { scale: 1 } : { scale: 0 }}
                      className="relative w-16 h-16 rounded-full bg-amber/20 backdrop-blur-sm flex items-center justify-center border border-amber/30"
                    >
                      <Play size={24} className="text-amber ml-1" />
                    </motion.div>
                  </div>

                  <div>
                    <span className="text-amber text-xs uppercase tracking-widest font-medium">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold text-foreground mt-1 flex items-center gap-2">
                      {project.title}
                      <ArrowUpRight size={16} className="text-amber" />
                    </h3>
                    <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Bottom info (always visible) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/80 to-transparent group-hover:opacity-0 transition-opacity duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{project.title}</h3>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">{project.category}</span>
                    </div>
                    <Eye size={16} className="text-muted-foreground" />
                  </div>
                </div>

                {/* Year badge */}
                <div className="absolute top-3 right-3 px-2 py-1 bg-background/60 backdrop-blur-sm rounded-sm text-xs text-amber font-medium">
                  {project.year}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground text-xs uppercase tracking-widest font-medium rounded-sm hover:border-amber hover:text-amber transition-all duration-300">
            View All Projects
            <ArrowUpRight size={14} />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
