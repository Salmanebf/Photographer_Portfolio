/**
 * Custom Cursor
 *
 * Two-part cursor: a small gold dot + a larger ring that lags behind.
 * Hidden on touch devices and when prefers-reduced-motion is set.
 * Scales up on links/buttons; hides during text inputs.
 */
'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [variant, setVariant] = useState<'default' | 'hover' | 'text' | 'hidden'>('hidden')
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 180, damping: 22, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 180, damping: 22, mass: 0.6 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    document.documentElement.classList.add('has-custom-cursor')

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = e.target as HTMLElement | null
      if (!target) {
        setVariant('default')
        return
      }
      const interactive = target.closest(
        'a, button, [role="button"], summary, label, [data-cursor="hover"]'
      )
      const text = target.closest('input, textarea, [contenteditable="true"]')
      if (text) setVariant('text')
      else if (interactive) setVariant('hover')
      else setVariant('default')
    }

    const handleLeave = () => setVariant('hidden')
    const handleEnter = () => setVariant('default')

    window.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseleave', handleLeave)
    document.addEventListener('mouseenter', handleEnter)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseleave', handleLeave)
      document.removeEventListener('mouseenter', handleEnter)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [x, y])

  const dotSize = variant === 'hover' ? 6 : variant === 'text' ? 2 : 8
  const ringSize = variant === 'hover' ? 56 : variant === 'text' ? 24 : 36
  const ringOpacity = variant === 'hidden' ? 0 : variant === 'text' ? 0.3 : 0.55
  const dotOpacity = variant === 'hidden' ? 0 : 1

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9998] rounded-full bg-gold pointer-events-none mix-blend-difference"
        style={{
          x,
          y,
          width: dotSize,
          height: dotSize,
          translateX: '-50%',
          translateY: '-50%',
          opacity: dotOpacity,
        }}
        transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      />
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9997] rounded-full border border-gold pointer-events-none"
        style={{
          x: ringX,
          y: ringY,
          width: ringSize,
          height: ringSize,
          translateX: '-50%',
          translateY: '-50%',
          opacity: ringOpacity,
        }}
      />
    </>
  )
}
