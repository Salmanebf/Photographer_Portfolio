'use client'

import { useScrollReveal } from '@/shared/hooks/use-scroll-effects'

interface SectionHeadingProps {
  label: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({
  label,
  title,
  description,
  align = 'center',
}: SectionHeadingProps) {
  const { ref, isRevealed } = useScrollReveal(0.15)
  const isLeft = align === 'left'

  return (
    <div ref={ref} className={`mb-16 sm:mb-20 ${isLeft ? '' : 'text-center'}`}>
      <div
        className={`flex items-center gap-3 mb-6 ${isLeft ? '' : 'justify-center'} blur-in ${
          isRevealed ? 'revealed' : ''
        }`}
      >
        <div className="h-px w-8 bg-gold/40" />
        <span className="text-[9px] uppercase tracking-[0.5em] text-gold font-medium">
          {label}
        </span>
        <div className="h-px w-8 bg-gold/40" />
      </div>

      <div className="overflow-hidden">
        <h2
          className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground reveal-text ${
            isRevealed ? 'revealed' : ''
          }`}
          style={{ transitionDelay: '120ms' }}
        >
          {title}
        </h2>
      </div>

      {description && (
        <p
          className={`mt-5 text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed blur-in ${
            isRevealed ? 'revealed' : ''
          } ${isLeft ? '' : 'mx-auto'}`}
          style={{ transitionDelay: '300ms' }}
        >
          {description}
        </p>
      )}
    </div>
  )
}
