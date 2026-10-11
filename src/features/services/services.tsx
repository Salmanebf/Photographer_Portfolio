'use client'

import { useScrollReveal } from '@/shared/hooks/use-scroll-effects'
import { useTranslations } from 'next-intl'
import SectionHeading from '@/shared/ui/section-heading'

interface ServicesProps {
  services: { title: string; description: string }[]
  /** The "How I work" steps (editable in the CMS) */
  process: { title: string; description: string }[]
}

export default function Services({ services, process }: ServicesProps) {
  const t = useTranslations('services')
  // The steps are editable, so adapt the grid to how many there are (static class names so Tailwind sees them)
  const columns =
    process.length <= 2 ? 'lg:grid-cols-2' : process.length === 3 || process.length > 4 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
  const { ref: servicesRef, isRevealed: servicesRevealed } = useScrollReveal(0.1)
  const { ref: processRef, isRevealed: processRevealed } = useScrollReveal(0.1)

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

        {process.length > 0 && (
          <>
            <SectionHeading
              label={t('processLabel')}
              title={t('processTitle')}
              description={t('processDescription')}
            />

            <div
              ref={processRef}
              className={`grid grid-cols-1 sm:grid-cols-2 ${columns} stagger-children ${
                processRevealed ? 'revealed' : ''
              }`}
            >
              {process.map((step, i) => (
                <div
                  key={step.title}
                  className={`group relative p-6 sm:p-8 hover:bg-muted/10 transition-colors duration-500 ${
                    i !== 0 ? 'lg:border-s border-border/40' : ''
                  } ${i !== process.length - 1 ? 'border-b sm:border-b-0 border-border/40' : ''}`}
                >
                  <div className="text-5xl font-bold text-gold/10 group-hover:text-gold/30 transition-colors duration-500 mb-6 leading-none">
                    {String(i + 1).padStart(2, '0')}
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
          </>
        )}
      </div>
    </section>
  )
}
