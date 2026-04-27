/**
 * Magnetic
 *
 * Subtle attraction toward the cursor on hover. Wrap any clickable
 * element (or its child) to add the effect.
 *
 * Disabled on touch devices and when prefers-reduced-motion is set.
 */
'use client'

import { useRef, useSyncExternalStore } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const QUERY = '(pointer: coarse), (prefers-reduced-motion: reduce)'

const subscribe = (cb: () => void) => {
  if (typeof window === 'undefined') return () => {}
  const mql = window.matchMedia(QUERY)
  mql.addEventListener('change', cb)
  return () => mql.removeEventListener('change', cb)
}
const getDisabled = () =>
  typeof window === 'undefined' ? true : window.matchMedia(QUERY).matches
const getServerDisabled = () => true

interface MagneticProps {
  children: React.ReactNode
  className?: string
  /** Multiplier applied to the offset from center (0–1). Higher = stronger pull. */
  strength?: number
}

export default function Magnetic({
  children,
  className,
  strength = 0.3,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 })

  const disabled = useSyncExternalStore(subscribe, getDisabled, getServerDisabled)

  if (disabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
        y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
