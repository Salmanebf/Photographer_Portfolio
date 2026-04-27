/**
 * AwardsMarquee
 *
 * Continuous-scrolling band of award names. Inverts scroll direction
 * based on page scroll velocity for an unusual living-strip feel.
 */
'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion'

const AWARDS = [
  'Sundance — Grand Jury Prize',
  'Cannes — Climate Prize',
  'Berlin — Best Documentary',
  'Venice — Best Documentary',
  'Tribeca — Special Jury',
  'IDFA — Best Doc',
  'SXSW — Audience Award',
  'Hot Docs — Audience Award',
  'Peabody Nominee',
  'Emmy Nominee',
  'Wildscreen — Golden Panda',
  'Jackson Wild — Grand Teton',
]

export default function AwardsMarquee() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
  const speedFactor = useTransform(smooth, [-2000, 0, 2000], [-3, 1, 3], { clamp: false })
  const direction = useRef(1)

  useEffect(() => {
    const unsubscribe = speedFactor.on('change', (v) => {
      if (v < 0) direction.current = -1
      if (v > 0) direction.current = 1
    })
    return unsubscribe
  }, [speedFactor])

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden border-y border-border/40 bg-card/30 py-8"
      aria-hidden="true"
    >
      <motion.div
        className="flex gap-12 whitespace-nowrap will-change-transform"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        {[...AWARDS, ...AWARDS].map((award, i) => (
          <span
            key={i}
            className="flex items-center gap-12 text-2xl sm:text-3xl font-bold tracking-tight text-muted-foreground/40 hover:text-gold transition-colors duration-500"
          >
            {award}
            <span className="w-1.5 h-1.5 rounded-full bg-gold/60 shrink-0" />
          </span>
        ))}
      </motion.div>
    </div>
  )
}
