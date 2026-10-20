'use client'

import { useScrollReveal } from '@/shared/hooks/use-scroll-effects'
import { useTranslations } from 'next-intl'
import SectionHeading from '@/shared/ui/section-heading'

interface ServicesProps {
  services: { title: string; description: string }[]
}

export default function Services({ services }: ServicesProps) {
  const t = useTranslations('services')
  const { ref: servicesRef, isRevealed: servicesRevealed } = useScrollReveal(0.1)

  return (
    <section id="services" className="py-24 sm:py-36 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          label={t('label')}
          title={t('title')}
          description={t('description')}
        />

        <div
          ref={servicesRef}
          className={`stagger-children ${servicesRevealed ? 'revealed' : ''}`}
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

      </div>
    </section>
  )
}
