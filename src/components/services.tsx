'use client'

import { useScrollReveal } from '@/hooks/use-scroll-effects'
import SectionHeading from './section-heading'

const process = [
  {
    step: '01',
    title: 'Discovery',
    description:
      'Deep research and immersion, building trust with communities and identifying the emotional core.',
  },
  {
    step: '02',
    title: 'Production',
    description:
      'Extended field shoots with cinematic cameras, capturing authentic moments and intimate interviews.',
  },
  {
    step: '03',
    title: 'Crafting',
    description:
      'Meticulous editing, sound design, and color grading that transforms raw footage into a compelling narrative.',
  },
  {
    step: '04',
    title: 'Impact',
    description:
      'Festival strategy, distribution, and impact campaigns ensuring your documentary reaches and moves audiences.',
  },
]

interface ServicesProps {
  services: { title: string; description: string }[]
}

export default function Services({ services }: ServicesProps) {
  const { ref: servicesRef, isRevealed: servicesRevealed } = useScrollReveal(0.1)
  const { ref: processRef, isRevealed: processRevealed } = useScrollReveal(0.1)

  return (
    <section id="services" className="py-24 sm:py-36 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          label="Services"
          title="What I Offer"
          description="End-to-end documentary filmmaking, from initial concept to global distribution and impact."
        />

        <div
          ref={servicesRef}
          className={`mb-32 stagger-children ${servicesRevealed ? 'revealed' : ''}`}
        >
          {services.map((service, i) => (
            <div
              key={service.title}
              className="group grid grid-cols-[60px_1fr_auto] sm:grid-cols-[80px_1fr_auto] gap-6 sm:gap-10 py-8 sm:py-10 border-b border-border/40 hover:border-gold/30 transition-colors duration-500"
            >
              <div className="text-3xl sm:text-4xl font-bold text-gold/20 group-hover:text-gold/50 transition-colors duration-500 leading-none tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 group-hover:text-gold transition-colors duration-400">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  {service.description}
                </p>
              </div>
              <div className="hidden sm:flex items-center">
                <div className="w-6 h-px bg-border group-hover:w-12 group-hover:bg-gold transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>

        <SectionHeading
          label="Process"
          title="How I Work"
          description="Every documentary begins with a question and unfolds through a deeply intentional creative process."
        />

        <div
          ref={processRef}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 stagger-children ${
            processRevealed ? 'revealed' : ''
          }`}
        >
          {process.map((step, i) => (
            <div
              key={step.step}
              className={`group relative p-6 sm:p-8 hover:bg-muted/10 transition-colors duration-500 ${
                i !== 0 ? 'lg:border-l border-border/40' : ''
              } ${i !== process.length - 1 ? 'border-b sm:border-b-0 border-border/40' : ''}`}
            >
              <div className="text-5xl font-bold text-gold/10 group-hover:text-gold/30 transition-colors duration-500 mb-6 leading-none">
                {step.step}
              </div>
              <div className="w-6 h-px bg-gold mb-5 group-hover:w-12 transition-all duration-500" />
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-gold transition-colors duration-400">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
