'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useScrollReveal } from '@/shared/hooks/use-scroll-effects'
import SectionHeading from '@/shared/ui/section-heading'
import type { Testimonial } from '@/lib/queries'

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const { ref, isRevealed } = useScrollReveal(0.1)

  const next = useCallback(() => {
    setDirection(1)
    setCurrentIndex((i) => (i + 1) % testimonials.length)
  }, [testimonials.length])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
  }, [testimonials.length])

  useEffect(() => {
    if (testimonials.length <= 1) return
    const t = setInterval(next, 8000)
    return () => clearInterval(t)
  }, [next, testimonials.length])

  if (testimonials.length === 0) return null

  const current = testimonials[currentIndex]

  return (
    <section id="testimonials" className="py-24 sm:py-36 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none opacity-[0.012]" aria-hidden="true">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-[18vw] font-bold uppercase">
            Words &nbsp; Trust &nbsp; Story &nbsp; Truth &nbsp; Words &nbsp; Trust &nbsp; Story &nbsp; Truth &nbsp;
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        <SectionHeading label="Testimonials" title="Words From the Field" />

        <div
          ref={ref}
          className={`max-w-4xl mx-auto scale-fade ${isRevealed ? 'revealed' : ''}`}
        >
          <div className="relative min-h-[260px] sm:min-h-[300px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className="text-gold text-[8rem] sm:text-[10rem] font-serif leading-none opacity-[0.12] -mb-10 sm:-mb-14 select-none"
                  aria-hidden="true"
                >
                  &ldquo;
                </div>

                <blockquote className="text-xl sm:text-2xl md:text-3xl text-foreground font-medium leading-[1.45] tracking-tight mb-12">
                  {current.content}
                </blockquote>

                <div className="flex items-center justify-between flex-wrap gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-px bg-gold" />
                    <div>
                      <div className="font-semibold text-foreground">{current.name}</div>
                      <div className="text-sm text-muted-foreground mt-0.5">
                        {current.role}
                      </div>
                    </div>
                  </div>
                  {current.project && (
                    <span className="text-[9px] uppercase tracking-[0.4em] text-gold border border-gold/20 px-3 py-1.5">
                      {current.project}
                    </span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {testimonials.length > 1 && (
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-border/40">
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > currentIndex ? 1 : -1)
                      setCurrentIndex(i)
                    }}
                    className={`transition-all duration-500 rounded-full ${
                      i === currentIndex
                        ? 'w-8 h-1 bg-gold'
                        : 'w-1 h-1 bg-border hover:bg-muted-foreground'
                    }`}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/40 transition-all duration-300"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={next}
                  className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/40 transition-all duration-300"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
