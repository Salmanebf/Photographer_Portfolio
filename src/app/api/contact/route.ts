import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contactSchema } from '@/features/contact/schema'
import { checkRateLimit, getClientIp } from '@/features/contact/rate-limit'
import { isAdminAuthorized } from '@/features/contact/admin-auth'
import { submitContact } from '@/features/contact/service'
import { contactHandlers } from '@/features/contact/handlers'

/** Thin HTTP adapter — the contact logic lives in `src/features/contact`. */
export async function POST(request: NextRequest) {
  const rate = checkRateLimit(getClientIp(request.headers))
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
    const { id } = await submitContact(parsed.data, contactHandlers)
    return NextResponse.json({ success: true, id }, { status: 201 })
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
  if (!isAdminAuthorized(request.headers.get('authorization'), adminToken)) {
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
