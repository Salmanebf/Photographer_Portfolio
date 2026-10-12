/**
 * Per-IP rate limiting for the contact form.
 *
 * The counters live in the database (`store.hitRateLimit`), so the limit holds across serverless
 * instances and restarts. If the database cannot be reached, the form must not break, so we fall
 * back to an in-memory counter (per instance — weaker, but better than nothing).
 */
import { createHash } from 'node:crypto'
import { contactStore } from './store'

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

/** The in-memory limiter (the fallback, and what tests of the pure logic use). */
export function checkMemoryRateLimit(ip: string): RateResult {
  const perIp = hit(ip, PER_IP_MAX)
  if (!perIp.allowed) return perIp
  return hit(GLOBAL_KEY, GLOBAL_MAX)
}

type RateStore = Pick<ReturnType<typeof contactStore>, 'hitRateLimit'>

/** Visitors' addresses are never stored in readable form. */
const keyFor = (ip: string) => 'ip:' + createHash('sha256').update(ip).digest('hex').slice(0, 32)

/** Database-backed check; falls back to memory if the database is unavailable. */
export async function checkRateLimit(
  ip: string,
  store: RateStore = contactStore()
): Promise<RateResult> {
  try {
    const perIp = await store.hitRateLimit(keyFor(ip), WINDOW_MS)
    if (perIp.count > PER_IP_MAX) return { allowed: false, resetAt: perIp.resetAt }
    const global = await store.hitRateLimit('global', WINDOW_MS)
    if (global.count > GLOBAL_MAX) return { allowed: false, resetAt: global.resetAt }
    return { allowed: true, resetAt: perIp.resetAt }
  } catch (err) {
    console.warn('[contact] rate-limit database unavailable, using the in-memory limit:', err)
    return checkMemoryRateLimit(ip)
  }
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

/** Sign-in attempts to the owner area: 10 per 10 minutes per visitor (stored hashed, like the contact limit). */
const LOGIN_WINDOW_MS = 10 * 60_000
const LOGIN_MAX = 10

export async function checkLoginAttempts(
  ip: string,
  store: RateStore = contactStore()
): Promise<RateResult> {
  try {
    const r = await store.hitRateLimit('login:' + keyFor(ip), LOGIN_WINDOW_MS)
    return { allowed: r.count <= LOGIN_MAX, resetAt: r.resetAt }
  } catch (err) {
    console.warn('[admin] rate-limit database unavailable, using the in-memory limit:', err)
    const key = 'login:' + ip
    const now = Date.now()
    const b = buckets.get(key)
    if (!b || now > b.resetAt) {
      const resetAt = now + LOGIN_WINDOW_MS
      buckets.set(key, { count: 1, resetAt })
      return { allowed: true, resetAt }
    }
    b.count++
    return { allowed: b.count <= LOGIN_MAX, resetAt: b.resetAt }
  }
}
