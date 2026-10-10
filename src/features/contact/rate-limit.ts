/**
 * In-memory, per-IP rate limiting.
 * For production with multiple instances, swap the store for Redis/Upstash —
 * only `hit()` needs to change.
 */

const WINDOW_MS = 60_000 // 1 min
const PER_IP_MAX = 5 // requests per window per IP
const GLOBAL_MAX = 60 // overall ceiling per window, regardless of IP
const GLOBAL_KEY = '*'

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

export type RateResult = { allowed: boolean; resetAt: number }

function hit(key: string, max: number): RateResult {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || now > bucket.resetAt) {
    const resetAt = now + WINDOW_MS
    buckets.set(key, { count: 1, resetAt })
    return { allowed: true, resetAt }
  }
  if (bucket.count >= max) return { allowed: false, resetAt: bucket.resetAt }
  bucket.count++
  return { allowed: true, resetAt: bucket.resetAt }
}

export function checkRateLimit(ip: string): RateResult {
  const perIp = hit(ip, PER_IP_MAX)
  if (!perIp.allowed) return perIp
  return hit(GLOBAL_KEY, GLOBAL_MAX)
}

/** Test helper. */
export function resetRateLimit() {
  buckets.clear()
}

// Periodic cleanup
setInterval(() => {
  const now = Date.now()
  for (const [key, b] of buckets) if (now > b.resetAt) buckets.delete(key)
}, WINDOW_MS).unref?.()

/**
 * Client IP as seen by the closest trusted proxy. The left-most
 * X-Forwarded-For entry is client-controlled and trivially spoofed, so we use
 * the platform-set X-Real-IP or the right-most (proxy-appended) entry.
 */
export function getClientIp(headers: Pick<Headers, 'get'>): string {
  const real = headers.get('x-real-ip')
  if (real) return real.trim()
  const fwd = headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',').pop()!.trim()
  return 'unknown'
}
