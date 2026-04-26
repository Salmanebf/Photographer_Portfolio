'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useScrollReveal } from '@/hooks/use-scroll-effects'
import SectionHeading from './section-heading'

const stats = [
  { n: '18+', label: 'Documentaries' },
  { n: '34+', label: 'Awards Won' },
  { n: '25+', label: 'Countries' },
]

const tools = [
  'Cinematic Vérité',
  'Observational',
  'Participatory',
  'ARRI Alexa Mini',
  'DaVinci Resolve',
  'DJI Inspire 3',
  'Immersive Sound',
  'Multi-year Projects',
]

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const imgParallax = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  const { ref: quoteRef, isRevealed: quoteRevealed } = useScrollReveal(0.2)
  const { ref: contentRef, isRevealed: contentRevealed } = useScrollReveal(0.1)

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 sm:py-36 relative overflow-hidden"
    >
      {/* Background marquee */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 overflow-hidden pointer-events-none opacity-[0.018]">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-[15vw] font-bold uppercase tracking-tight">
            Documentary &nbsp; Truth &nbsp; Story &nbsp; Reality &nbsp; Culture &nbsp; Heritage &nbsp;
          </span>
          <span className="text-[15vw] font-bold uppercase tracking-tight">
            Documentary &nbsp; Truth &nbsp; Story &nbsp; Reality &nbsp; Culture &nbsp; Heritage &nbsp;
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        {/* Opening pull quote */}
        <div
          ref={quoteRef}
          className={`mb-20 sm:mb-28 max-w-4xl scale-fade ${quoteRevealed ? 'revealed' : ''}`}
        >
          <div className="text-gold text-7xl sm:text-8xl font-serif leading-none mb-4 opacity-30 select-none">
            &ldquo;
          </div>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-[1.2] tracking-tight">
            The documentary is the most honest form of filmmaking — you don&apos;t invent the
            truth,<span className="text-gradient"> you uncover it.</span>
          </p>
        </div>

        <SectionHeading label="About" title="The Story Behind the Lens" align="left" />

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-12 lg:gap-20 items-start">
          {/* Image */}
          <motion.div style={{ y: imgParallax }} className="relative">
            <div className="relative overflow-hidden aspect-[3/4]">
              <img
                src="/images/about-doc.png"
                alt="Alex Rivera"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
            </div>
            {/* Gold offset frame */}
            <div className="absolute -bottom-3 -right-3 w-full h-full border border-gold/15 -z-10" />
            {/* Years badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-5 -right-5 bg-gold text-background px-6 py-4"
            >
              <div className="text-3xl font-bold leading-none">12+</div>
              <div className="text-[9px] uppercase tracking-[0.35em] mt-1">Years</div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <div
            ref={contentRef}
            className={`slide-right ${contentRevealed ? 'revealed' : ''} space-y-6 pt-2`}
          >
            <p className="text-lg text-foreground leading-relaxed">
              I&apos;m Alex Rivera, a documentary filmmaker dedicated to telling stories
              that illuminate the human condition and inspire change.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              My work takes me to the farthest corners of the globe — from Arctic ice
              sheets to Amazonian villages, from bustling urban gardens to quiet artisan
              workshops. I believe documentary film is the most powerful medium we have
              for building empathy and understanding across cultures.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Every documentary I create begins with a question, not an answer. I approach
              each story with humility, letting the subjects guide the narrative. The
              result is cinema that feels authentic, intimate, and deeply human.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-7 border-y border-border/40">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl sm:text-3xl font-bold text-gold leading-none">
                    {s.n}
                  </div>
                  <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mt-2">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Tools */}
            <div>
              <h3 className="text-[9px] uppercase tracking-[0.4em] text-gold font-medium mb-4">
                Approach &amp; Tools
              </h3>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1.5 text-[11px] text-muted-foreground border border-border/50 hover:border-gold/40 hover:text-foreground transition-all duration-300 cursor-default"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
