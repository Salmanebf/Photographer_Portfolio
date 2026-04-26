'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useScrollReveal } from '@/hooks/use-scroll-effects'
import SectionHeading from './section-heading'

const testimonials = [
  {
    name: 'Dr. Maria Santos',
    role: 'Linguist, Subject of "Vanishing Voices"',
    content:
      "Alex didn't just document our work — she became part of the journey. The film has brought more attention to language preservation than a thousand academic papers ever could.",
    project: 'Vanishing Voices',
  },
  {
    name: 'Ingrid Larsen',
    role: 'Producer, "Beneath the Ice"',
    content:
      "Working with Alex on the Arctic expedition was a masterclass in documentary filmmaking. She endured -40°C temperatures while producing some of the most breathtaking footage I've ever seen.",
    project: 'Beneath the Ice',
  },
  {
    name: 'Denise Williams',
    role: 'Community Leader, Detroit',
    content:
      "She earned our trust by showing up — not just with a camera, but with her hands in the soil. 'Urban Roots' tells our story with the dignity and honesty we deserve.",
    project: 'Urban Roots',
  },
  {
    name: 'Yuki Tanaka',
    role: 'Co-Producer, "The Last Craftsman"',
    content:
      "Alex spent three years building the relationship that made 'The Last Craftsman' possible. That patience and respect is what sets her apart. A masterpiece of restraint and emotional depth.",
    project: 'The Last Craftsman',
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const { ref, isRevealed } = useScrollReveal(0.1)

  const next = useCallback(() => {
    setDirection(1)
    setCurrentIndex((i) => (i + 1) % testimonials.length)
  }, [])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    const t = setInterval(next, 8000)
    return () => clearInterval(t)
  }, [next])

  const current = testimonials[currentIndex]

  return (
    <section id="testimonials" className="py-24 sm:py-36 relative overflow-hidden">
      {/* Background marquee */}
      <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none opacity-[0.012]">
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
          {/* Quote container */}
          <div className="relative min-h-[260px] sm:min-h-[300px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Giant quote mark */}
                <div className="text-gold text-[8rem] sm:text-[10rem] font-serif leading-none opacity-[0.12] -mb-10 sm:-mb-14 select-none">
                  &ldquo;
                </div>

                <p className="text-xl sm:text-2xl md:text-3xl text-foreground font-medium leading-[1.45] tracking-tight mb-12">
                  {current.content}
                </p>

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
                  <span className="text-[9px] uppercase tracking-[0.4em] text-gold border border-gold/20 px-3 py-1.5">
                    {current.project}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
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
                aria-label="Previous"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/40 transition-all duration-300"
                aria-label="Next"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
