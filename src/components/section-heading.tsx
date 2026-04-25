'use client'

import { motion } from 'framer-motion'

interface SectionHeadingProps {
  label: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({ label, title, description, align = 'center' }: SectionHeadingProps) {
  return (
    <div className={`mb-12 sm:mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="inline-block text-amber text-xs uppercase tracking-[0.3em] font-semibold mb-3"
      >
        {label}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-muted-foreground max-w-2xl text-base sm:text-lg leading-relaxed mx-auto"
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}
