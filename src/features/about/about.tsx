'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useScrollReveal } from '@/shared/hooks/use-scroll-effects'
import SectionHeading from '@/shared/ui/section-heading'
import type { SiteSettings } from '@/lib/queries'

interface AboutProps {
  settings: SiteSettings
}

export default function About({ settings }: AboutProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const imgParallax = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.04])

  const { ref: quoteRef, isRevealed: quoteRevealed } = useScrollReveal(0.2)
  const { ref: contentRef, isRevealed: contentRevealed } = useScrollReveal(0.1)

  const { about } = settings

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 sm:py-36 relative overflow-hidden"
    >
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
        <div
          ref={quoteRef}
          className={`mb-20 sm:mb-28 max-w-4xl scale-fade ${quoteRevealed ? 'revealed' : ''}`}
        >
          <div
            className="text-gold text-7xl sm:text-8xl font-serif leading-none mb-4 opacity-30 select-none"
            aria-hidden="true"
          >
            &ldquo;
          </div>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-[1.2] tracking-tight">
            {about.quote.first}
            <span className="text-gradient">{about.quote.accent}</span>
          </p>
        </div>

        <SectionHeading label="About" title="The Story Behind the Lens" align="left" />

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-12 lg:gap-20 items-start">
          <motion.div style={{ y: imgParallax }} className="relative">
            <motion.div
              style={{ scale: imgScale }}
              className="relative overflow-hidden aspect-[3/4]"
            >
              <Image
                src={about.image}
                alt={`${settings.brand.name}, documentary filmmaker`}
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
            </motion.div>
            <div className="absolute -bottom-3 -right-3 w-full h-full border border-gold/15 -z-10" />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-5 -right-5 bg-gold text-background px-6 py-4"
            >
              <div className="text-3xl font-bold leading-none">{about.yearsBadge}</div>
              <div className="text-[9px] uppercase tracking-[0.35em] mt-1">Years</div>
            </motion.div>
          </motion.div>

          <div
            ref={contentRef}
            className={`slide-right ${contentRevealed ? 'revealed' : ''} space-y-6 pt-2`}
          >
            {about.paragraphs.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'text-lg text-foreground leading-relaxed'
                    : 'text-muted-foreground leading-relaxed'
                }
              >
                {p}
              </p>
            ))}

            {about.stats.length > 0 && (
              <div className="grid grid-cols-3 gap-6 py-7 border-y border-border/40">
                {about.stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                  >
                    <div className="text-2xl sm:text-3xl font-bold text-gold leading-none">
                      {s.value}
                    </div>
                    <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mt-2">
                      {s.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {about.tools.length > 0 && (
              <div>
                <h3 className="text-[9px] uppercase tracking-[0.4em] text-gold font-medium mb-4">
                  Approach &amp; Tools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {about.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-3 py-1.5 text-[11px] text-muted-foreground border border-border/50 hover:border-gold/40 hover:text-foreground transition-all duration-300 cursor-default"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
