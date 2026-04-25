'use client'

import { motion } from 'framer-motion'
import { Film, Camera, Clapperboard, Megaphone } from 'lucide-react'
import { useScrollReveal } from '@/hooks/use-scroll-effects'
import { serviceCategories } from '@/lib/data'
import SectionHeading from './section-heading'

const icons = [Film, Clapperboard, Camera, Megaphone]

const process = [
  { step: '01', title: 'Discovery', description: 'Deep research and immersion into the subject matter, building trust with communities and identifying the emotional core.' },
  { step: '02', title: 'Production', description: 'Extended field shoots with cinematic cameras, capturing authentic moments and intimate interviews over weeks or months.' },
  { step: '03', title: 'Crafting', description: 'Meticulous editing, sound design, and color grading that transforms raw footage into a compelling narrative.' },
  { step: '04', title: 'Impact', description: 'Festival strategy, distribution, and impact campaigns that ensure your documentary reaches and moves audiences worldwide.' },
]

export default function Services() {
  const { ref: servicesRef, isRevealed: servicesRevealed } = useScrollReveal(0.1)
  const { ref: processRef, isRevealed: processRevealed } = useScrollReveal(0.1)

  return (
    <section id="services" className="py-24 sm:py-36 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-muted/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Services"
          title="What I Offer"
          description="End-to-end documentary filmmaking, from initial concept to global distribution and impact."
        />

        {/* Services grid */}
        <div ref={servicesRef} className={`grid grid-cols-1 sm:grid-cols-2 gap-6 mb-24 stagger-children ${servicesRevealed ? 'revealed' : ''}`}>
          {serviceCategories.map((service, i) => {
            const Icon = icons[i]
            return (
              <div
                key={service.title}
                className="group relative p-6 sm:p-8 bg-card/50 border border-border/50 hover:border-[#ffb005]/30 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#ffb005]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#ffb005]/10 mb-5 group-hover:bg-[#ffb005]/20 transition-colors duration-300">
                    <Icon size={22} className="text-[#ffb005]" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-[#ffb005] transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Process section */}
        <SectionHeading
          label="Process"
          title="How I Work"
          description="Every documentary begins with a question and unfolds through a deeply intentional creative process."
        />

        <div ref={processRef} className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children ${processRevealed ? 'revealed' : ''}`}>
          {process.map((step) => (
            <div key={step.step} className="relative p-6 group">
              {/* Step number */}
              <span className="text-5xl sm:text-6xl font-bold text-[#ffb005]/10 group-hover:text-[#ffb005]/20 transition-colors duration-500 absolute top-2 right-4">
                {step.step}
              </span>
              <div className="relative z-10">
                <div className="w-8 h-px bg-[#ffb005] mb-4 group-hover:w-16 transition-all duration-500" />
                <h3 className="text-base font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
