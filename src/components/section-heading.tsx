'use client'

import { useScrollReveal } from '@/hooks/use-scroll-effects'

interface SectionHeadingProps {
  label: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({ label, title, description, align = 'center' }: SectionHeadingProps) {
  const { ref, isRevealed } = useScrollReveal(0.2)

  return (
    <div ref={ref} className={`mb-12 sm:mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <div className={`reveal-text ${isRevealed ? 'revealed' : ''}`}>
        <span className="inline-block text-[#ffb005] text-[10px] sm:text-xs uppercase tracking-[0.4em] font-semibold mb-4">
          {label}
        </span>
      </div>
      <div className={`reveal-text ${isRevealed ? 'revealed' : ''}`} style={{ transitionDelay: '0.1s' }}>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">{title}</h2>
      </div>
      {description && (
        <div className={`blur-in ${isRevealed ? 'revealed' : ''}`} style={{ transitionDelay: '0.3s' }}>
          <p className="mt-4 text-muted-foreground max-w-2xl text-sm sm:text-base leading-relaxed mx-auto">
            {description}
          </p>
        </div>
      )}
    </div>
  )
}
