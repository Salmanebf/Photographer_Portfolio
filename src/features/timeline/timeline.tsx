'use client'

import { ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { useScrollReveal } from '@/shared/hooks/use-scroll-effects'
import SectionHeading from '@/shared/ui/section-heading'

export interface TimelineStep {
  title: string
  description: string
}

interface TimelineProps {
  steps: TimelineStep[]
  /** Home page: short list + link to the full page. Detail page: show everything, no link. */
  variant?: 'summary' | 'full'
}

/**
 * How a project comes together, step by step. Reads the editable "Timeline steps" (CMS) and works with
 * any number of steps. The home page shows it as a summary; /timeline shows it in full.
 */
export default function Timeline({ steps, variant = 'summary' }: TimelineProps) {
  const t = useTranslations('timeline')
  const { ref, isRevealed } = useScrollReveal(0.1)
  if (steps.length === 0) return null
  const full = variant === 'full'

  return (
    <section id="timeline" className={full ? 'pb-24' : 'py-24 sm:py-36 relative'}>
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        {!full && (
          <SectionHeading label={t('label')} title={t('title')} description={t('description')} />
        )}

        <div ref={ref}>
          <ol
            aria-label={t('stepsAria')}
            className={`relative ms-3 sm:ms-0 border-s border-border/60 stagger-children ${isRevealed ? 'revealed' : ''}`}
          >
            {steps.map((step, i) => (
              <li
                key={`${step.title}-${i}`}
                className="group relative ps-8 sm:ps-12 pb-12 last:pb-0"
              >
                <span
                  aria-hidden="true"
                  className="absolute -start-[5px] top-2 size-[9px] rounded-full bg-gold/50 ring-4 ring-background group-hover:bg-gold transition-colors duration-500"
                />
                <p className="text-[10px] uppercase tracking-[0.4em] text-gold/80 mb-2">
                  {t('step', { n: i + 1 })}
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 group-hover:text-gold transition-colors duration-500">
                  {step.title}
                </h3>
                {step.description && (
                  <p
                    className={`text-sm text-muted-foreground leading-relaxed ${full ? 'max-w-2xl' : 'max-w-xl line-clamp-3'}`}
                  >
                    {step.description}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-14 flex">
          {full ? (
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-gold hover:underline underline-offset-8"
            >
              {t('cta')}
              <ArrowUpRight className="size-4 rtl:-scale-x-100" />
            </Link>
          ) : (
            <Link
              href="/timeline"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-gold hover:underline underline-offset-8"
            >
              {t('more')}
              <ArrowUpRight className="size-4 rtl:-scale-x-100" />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
