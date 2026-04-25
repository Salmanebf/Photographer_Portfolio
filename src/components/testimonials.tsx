'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import SectionHeading from './section-heading'

const testimonials = [
  {
    name: 'Sarah & James Mitchell',
    role: 'Wedding Couple',
    content: "Alex captured our wedding day in a way we never thought possible. Every frame feels like a movie, every moment is preserved with such beauty and emotion. We've watched our film a hundred times and it still brings tears to our eyes.",
    rating: 5,
    project: 'Eternal Vows',
  },
  {
    name: 'Marcus Chen',
    role: 'Creative Director, Luxe Brand',
    content: "Working with Alex elevated our brand campaign to an entirely new level. His cinematic approach brought a sophistication and emotional depth to our commercial that we hadn't experienced with other videographers. The results exceeded all expectations.",
    rating: 5,
    project: 'Noir Essence',
  },
  {
    name: 'Luna Rodriguez',
    role: 'Recording Artist',
    content: "Alex has an incredible ability to translate music into visuals. He understood my vision immediately and created a music video that perfectly captured the mood and energy of my song. His attention to lighting and composition is unmatched.",
    rating: 5,
    project: 'Midnight Echo',
  },
  {
    name: 'David Park',
    role: 'Documentary Producer, PBS',
    content: "Alex's documentary work is nothing short of extraordinary. He has a rare gift for finding the emotional core of a story and presenting it with cinematic beauty. His film 'The Last Craftsman' was our highest-rated documentary of the year.",
    rating: 5,
    project: 'The Last Craftsman',
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const nextTestimonial = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prevTestimonial = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 6000)
    return () => clearInterval(timer)
  }, [nextTestimonial])

  const current = testimonials[currentIndex]

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  }

  return (
    <section id="testimonials" className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading
          label="Testimonials"
          title="Client Stories"
          description="What my clients say about working together."
        />

        <div className="max-w-4xl mx-auto">
          {/* Testimonial card */}
          <div className="relative min-h-[280px] sm:min-h-[240px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="bg-card border border-border rounded-sm p-8 sm:p-12 relative"
              >
                {/* Quote icon */}
                <Quote size={40} className="text-amber/20 absolute top-6 left-6 sm:top-8 sm:left-8" />

                {/* Stars */}
                <div className="flex items-center gap-1 mb-6">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-amber fill-amber" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-foreground text-base sm:text-lg leading-relaxed mb-8 relative z-10">
                  &ldquo;{current.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h4 className="font-semibold text-foreground">{current.name}</h4>
                    <p className="text-sm text-muted-foreground">{current.role}</p>
                  </div>
                  <span className="text-xs text-amber uppercase tracking-widest font-medium bg-amber/10 px-3 py-1 rounded-sm">
                    {current.project}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1)
                    setCurrentIndex(i)
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'bg-amber w-8' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-sm border border-border flex items-center justify-center text-muted-foreground hover:text-amber hover:border-amber/30 transition-all duration-300"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-sm border border-border flex items-center justify-center text-muted-foreground hover:text-amber hover:border-amber/30 transition-all duration-300"
                aria-label="Next testimonial"
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
