'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { useScrollReveal } from '@/hooks/use-scroll-effects'
import SectionHeading from './section-heading'

const testimonials = [
  {
    name: 'Dr. Maria Santos',
    role: 'Linguist, Subject of "Vanishing Voices"',
    content: "Alex didn't just document our work — she became part of the journey. Her camera was never intrusive, yet she captured the most intimate moments of our research. The film has brought more attention to language preservation than a thousand academic papers ever could.",
    rating: 5,
    project: 'Vanishing Voices',
  },
  {
    name: 'Ingrid Larsen',
    role: 'Producer, "Beneath the Ice"',
    content: "Working with Alex on the Arctic expedition was a masterclass in documentary filmmaking. She endured -40°C temperatures, equipment failures, and weeks of isolation — all while producing some of the most breathtaking footage I've ever seen. Her dedication is unmatched.",
    rating: 5,
    project: 'Beneath the Ice',
  },
  {
    name: 'Denise Williams',
    role: 'Community Leader, Detroit',
    content: "When Alex first came to our garden, we were skeptical of another filmmaker. But she earned our trust by showing up — not just with a camera, but with her hands in the soil. 'Urban Roots' tells our story with the dignity and honesty we deserve.",
    rating: 5,
    project: 'Urban Roots',
  },
  {
    name: 'Yuki Tanaka',
    role: 'Co-Producer, "The Last Craftsman"',
    content: "Alex spent three years building the relationship that made 'The Last Craftsman' possible. That patience and respect for the subject is what sets her apart. The film is a masterpiece of restraint and emotional depth that could only come from genuine human connection.",
    rating: 5,
    project: 'The Last Craftsman',
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const { ref, isRevealed } = useScrollReveal(0.1)

  const nextTestimonial = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prevTestimonial = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 7000)
    return () => clearInterval(timer)
  }, [nextTestimonial])

  const current = testimonials[currentIndex]

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 80 : -80, opacity: 0 }),
  }

  return (
    <section id="testimonials" className="py-24 sm:py-36 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/15 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading
          label="Testimonials"
          title="Words From the Field"
          description="What collaborators and subjects say about working together."
        />

        <div ref={ref} className={`max-w-4xl mx-auto scale-fade ${isRevealed ? 'revealed' : ''}`}>
          <div className="relative min-h-[280px] sm:min-h-[240px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="bg-card/50 border border-border/50 p-8 sm:p-12 relative"
              >
                <Quote size={36} className="text-[#ffb005]/15 absolute top-6 left-6 sm:top-8 sm:left-8" />

                <div className="flex items-center gap-1 mb-6">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-[#ffb005] fill-[#ffb005]" />
                  ))}
                </div>

                <p className="text-foreground text-base sm:text-lg leading-relaxed mb-8 relative z-10 italic">
                  &ldquo;{current.content}&rdquo;
                </p>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h4 className="font-semibold text-foreground">{current.name}</h4>
                    <p className="text-sm text-muted-foreground">{current.role}</p>
                  </div>
                  <span className="text-[10px] text-[#ffb005] uppercase tracking-[0.2em] font-medium bg-[#ffb005]/10 px-3 py-1 border border-[#ffb005]/20">
                    {current.project}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1)
                    setCurrentIndex(i)
                  }}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === currentIndex ? 'bg-[#ffb005] w-8' : 'bg-muted-foreground/20 w-3 hover:bg-muted-foreground/40'
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-[#ffb005] hover:border-[#ffb005]/30 transition-all duration-300"
                aria-label="Previous"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-[#ffb005] hover:border-[#ffb005]/30 transition-all duration-300"
                aria-label="Next"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
