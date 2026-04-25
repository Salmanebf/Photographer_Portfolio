'use client'

import { motion } from 'framer-motion'
import SectionHeading from './section-heading'

export default function About() {
  return (
    <section id="about" className="py-20 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="About Me"
          title="The Story Behind the Lens"
          align="left"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-sm">
              <img
                src="/images/about-portrait.png"
                alt="Alex Rivera - Cinematographer"
                className="w-full h-auto object-cover aspect-[3/4]"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>
            {/* Decorative frame */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-amber/20 rounded-sm -z-10" />
            {/* Experience badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -bottom-6 -right-6 bg-amber text-amber-foreground px-6 py-4 rounded-sm shadow-lg"
            >
              <div className="text-3xl font-bold">12+</div>
              <div className="text-xs uppercase tracking-widest">Years</div>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <p className="text-lg sm:text-xl text-foreground leading-relaxed">
              I&apos;m Alex Rivera, a cinematographer and visual storyteller based in Los Angeles. 
              For over a decade, I&apos;ve been passionate about capturing life&apos;s most compelling 
              moments through the lens.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              My journey began with a borrowed camera and a dream to tell stories that matter. 
              Today, I work with brands, artists, and couples around the world, bringing their 
              visions to life with cinematic precision and emotional depth.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Every frame I compose is intentional, every edit purposeful. I believe great 
              videography isn&apos;t just about recording — it&apos;s about revealing the extraordinary 
              within the ordinary, finding beauty in unexpected places, and crafting narratives 
              that resonate long after the screen goes dark.
            </p>

            {/* Skills/Tools */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-xs uppercase tracking-[0.2em] text-amber font-semibold mb-4">Tools & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'RED V-Raptor', 'ARRI Alexa', 'Sony Venice', 'DaVinci Resolve',
                  'Premiere Pro', 'After Effects', 'DJI Inspire 3', 'Steadicam',
                  'Underwater', 'Aerial'
                ].map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1.5 text-xs bg-muted text-muted-foreground rounded-sm border border-border hover:border-amber/30 hover:text-foreground transition-colors cursor-default"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
