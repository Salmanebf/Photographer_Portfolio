'use client'

import { useScrollProgress } from '@/shared/hooks/use-scroll-effects'

export default function ScrollProgress() {
  const progress = useScrollProgress()

  return (
    <div
      className="scroll-progress"
      style={{ transform: `scaleX(${progress})` }}
      suppressHydrationWarning={true}
    />
  )
}
