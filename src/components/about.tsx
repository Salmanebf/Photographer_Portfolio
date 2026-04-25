'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useScrollReveal } from '@/hooks/use-scroll-effects'
import SectionHeading from './section-heading'

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  const imgParallax = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])
  const { ref: contentRef, isRevealed: contentRevealed } = useScrollReveal(0.1)

  return (
    <section id="about" ref={sectionRef} className="py-24 sm:py-36 relative overflow-hidden">
      {/* Marquee background text */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-[15vw] font-bold uppercase tracking-wider">
            Documentary &nbsp; Truth &nbsp; Story &nbsp; Reality &nbsp; Culture &nbsp; Heritage &nbsp;
          </span>
          <span className="text-[15vw] font-bold uppercase tracking-wider">
            Documentary &nbsp; Truth &nbsp; Story &nbsp; Reality &nbsp; Culture &nbsp; Heritage &nbsp;
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="About Me"
          title="The Story Behind the Lens"
          align="left"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image with parallax */}
          <motion.div
            style={{ y: imgParallax }}
            className="relative"
          >
            <div className="relative overflow-hidden">
              <img
                src="/images/about-doc.png"
                alt="Alex Rivera - Documentary Filmmaker"
                className="w-full h-auto object-cover aspect-[3/4]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
            {/* Decorative border */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-[#ffb005]/15 -z-10" />
            {/* Experience badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -bottom-6 -right-6 bg-[#ffb005] text-black px-6 py-4 shadow-lg shadow-[#ffb005]/10"
            >
              <div className="text-3xl font-bold">12+</div>
              <div className="text-[10px] uppercase tracking-[0.3em]">Years</div>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <div ref={contentRef} className={`slide-right ${contentRevealed ? 'revealed' : ''} space-y-6`}>
            <p className="text-lg sm:text-xl text-foreground leading-relaxed">
              I&apos;m Alex Rivera, a documentary filmmaker dedicated to telling
              stories that illuminate the human condition and inspire change.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              My work takes me to the farthest corners of the globe — from Arctic ice sheets
              to Amazonian villages, from bustling urban gardens to quiet artisan workshops.
              I believe documentary film is the most powerful medium we have for building
              empathy and understanding across cultures.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Every documentary I create begins with a question, not an answer. I approach
              each story with humility, letting the subjects guide the narrative. The result
              is cinema that feels authentic, intimate, and deeply human — films that don&apos;t
              just inform but transform.
            </p>

            {/* Skills */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#ffb005] font-semibold mb-4">
                Approach & Tools
              </h3>
              <div className="flex flex-wrap gap-2 stagger-children">
                {[
                  'Cinematic Vérité', 'Observational', 'Participatory', 'ARRI Alexa Mini',
                  'DaVinci Resolve', 'DJI Inspire 3', 'Immersive Sound', 'Multi-year Projects'
                ].map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1.5 text-[11px] bg-muted/50 text-muted-foreground border border-border/50 hover:border-[#ffb005]/30 hover:text-[#ffb005] transition-colors duration-300 cursor-default"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Quote */}
            <div className="mt-6 pl-4 border-l-2 border-[#ffb005]/40">
              <p className="text-sm italic text-muted-foreground">
                &ldquo;The documentary is the most honest form of filmmaking — you don&apos;t invent
                the truth, you uncover it, one frame at a time.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
