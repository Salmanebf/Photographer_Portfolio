'use client'

import { motion } from 'framer-motion'
import { Video, Heart, Clapperboard, Globe, Film, Camera } from 'lucide-react'
import SectionHeading from './section-heading'

const services = [
  {
    icon: Heart,
    title: 'Wedding Films',
    description: 'Cinematic wedding films that capture every emotion, every glance, every precious moment of your special day.',
    features: ['Full-day coverage', 'Highlight reel', 'Drone footage', 'Same-day edit'],
  },
  {
    icon: Video,
    title: 'Commercial Production',
    description: 'High-end commercial videos that elevate your brand with stunning visuals and compelling storytelling.',
    features: ['Brand videos', 'Product launches', 'Social media content', 'Campaign films'],
  },
  {
    icon: Clapperboard,
    title: 'Music Videos',
    description: 'Creative and visually stunning music videos that bring your sound to life with cinematic artistry.',
    features: ['Concept development', 'Performance shots', 'Visual effects', 'Color grading'],
  },
  {
    icon: Globe,
    title: 'Documentary',
    description: 'Authentic documentary filmmaking that tells real stories with depth, sensitivity, and cinematic beauty.',
    features: ['Story research', 'Interview filming', 'Archival integration', 'Narrative editing'],
  },
  {
    icon: Film,
    title: 'Short Films',
    description: 'Narrative short films crafted with artistic vision, from concept to final cut, pushing creative boundaries.',
    features: ['Script development', 'Casting & direction', 'Cinematography', 'Post-production'],
  },
  {
    icon: Camera,
    title: 'Aerial & Drone',
    description: 'Breathtaking aerial cinematography using the latest drone technology for stunning perspectives and sweeping vistas.',
    features: ['Licensed pilot', '4K/6K capture', 'Interior fly-throughs', 'Real estate'],
  },
]

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Services() {
  return (
    <section id="services" className="py-20 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Services"
          title="What I Offer"
          description="From intimate wedding films to large-scale commercial productions, I bring cinematic excellence to every project."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                className="group relative p-6 sm:p-8 bg-card rounded-sm border border-border hover:border-amber/30 transition-all duration-500 overflow-hidden"
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-sm bg-amber/10 flex items-center justify-center mb-5 group-hover:bg-amber/20 transition-colors duration-300">
                    <Icon size={22} className="text-amber" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-amber transition-colors duration-300">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-amber" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
