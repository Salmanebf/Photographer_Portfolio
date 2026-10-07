import { createHash, timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

/* ============================================================ */
/*  Validation                                                    */
/* ============================================================ */

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').trim(),
  email: z.string().email('Invalid email').max(254, 'Email too long').trim(),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject too long')
    .trim(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message too long')
    .trim(),
  /** Honeypot — real users leave it empty; bots fill it in */
  website: z.string().max(500).optional(),
})

/* ============================================================ */
/*  Rate limiting (in-memory, per-IP)                             */
/*  For production with multiple instances, swap for Redis.       */
/* ============================================================ */

const RATE_LIMIT_WINDOW_MS = 60_000 // 1 min
const RATE_LIMIT_MAX = 5 // 5 requests per minute per IP
const GLOBAL_LIMIT_MAX = 60 // overall ceiling per minute, regardless of IP
const GLOBAL_KEY = '*'

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

/**
 * Client IP as seen by the closest trusted proxy. The left-most
 * X-Forwarded-For entry is client-controlled and trivially spoofed, so we use
 * the platform-set X-Real-IP or the right-most (proxy-appended) entry.
 */
function getClientIp(req: NextRequest): string {
  const real = req.headers.get('x-real-ip')
  if (real) return real.trim()
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',').pop()!.trim()
  return 'unknown'
}

function hit(key: string, max: number): { allowed: boolean; resetAt: number } {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || now > bucket.resetAt) {
    const resetAt = now + RATE_LIMIT_WINDOW_MS
    buckets.set(key, { count: 1, resetAt })
    return { allowed: true, resetAt }
  }
  if (bucket.count >= max) return { allowed: false, resetAt: bucket.resetAt }
  bucket.count++
  return { allowed: true, resetAt: bucket.resetAt }
}

function checkRateLimit(ip: string): { allowed: boolean; resetAt: number } {
  const perIp = hit(ip, RATE_LIMIT_MAX)
  if (!perIp.allowed) return perIp
  return hit(GLOBAL_KEY, GLOBAL_LIMIT_MAX)
}

function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

// Periodic cleanup
setInterval(() => {
  const now = Date.now()
  for (const [ip, b] of buckets) if (now > b.resetAt) buckets.delete(ip)
}, RATE_LIMIT_WINDOW_MS).unref?.()

/* ============================================================ */
/*  Optional email notification via Resend                        */
/* ============================================================ */

async function sendEmail(data: z.infer<typeof contactSchema>) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_NOTIFICATION_EMAIL
  if (!apiKey || !to) return // not configured — silently skip

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to,
      replyTo: data.email,
      subject: `New inquiry: ${data.subject}`,
      text: `From: ${data.name} <${data.email}>\n\n${data.message}`,
    })
  } catch (err) {
    // Don't fail the request — log only
    console.error('[Resend] email send failed:', err)
  }
}

/* ============================================================ */
/*  Handlers                                                      */
/* ============================================================ */

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const rate = checkRateLimit(ip)
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many requests — please try again in a minute.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((rate.resetAt - Date.now()) / 1000)) },
      }
    )
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 }
    )
  }

  // Honeypot triggered — silently succeed
  if (parsed.data.website) {
    return NextResponse.json({ success: true }, { status: 201 })
  }

  try {
    const contactMessage = await db.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject,
        message: parsed.data.message,
      },
    })

    // sendEmail never throws; awaited so serverless runtimes don't cut it off
    await sendEmail(parsed.data)

    return NextResponse.json(
      { success: true, id: contactMessage.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to process your message' },
      { status: 500 }
    )
  }
}

/**
 * Admin-only: list recent submissions.
 *
 * Set `CONTACT_ADMIN_TOKEN` in env, then send `Authorization: Bearer <token>`.
 * Without a token configured, this endpoint is disabled.
 */
export async function GET(request: NextRequest) {
  const adminToken = process.env.CONTACT_ADMIN_TOKEN
  if (!adminToken) {
    return NextResponse.json({ error: 'Disabled' }, { status: 404 })
  }
  const auth = request.headers.get('authorization') ?? ''
  if (!safeEqual(auth, `Bearer ${adminToken}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Fetch messages error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
