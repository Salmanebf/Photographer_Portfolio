import { createHash, timingSafeEqual } from 'node:crypto'

/** Compare two secrets in constant time (so response timing reveals nothing about them). */
export function secretsMatch(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}
