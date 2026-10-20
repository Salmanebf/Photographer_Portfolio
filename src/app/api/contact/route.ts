import { NextRequest, NextResponse } from 'next/server'
import { contactStore } from '@/features/contact/store'
import { contactSchema } from '@/features/contact/schema'
import {
  contactErrorMessages,
  isContactErrorCode,
  type ContactErrorCode,
} from '@/features/contact/error-codes'
import { checkRateLimit, getClientIp } from '@/features/contact/rate-limit'
import { checkSpam } from '@/features/contact/spam'
import { isAdminAuthorized } from '@/features/contact/admin-auth'
import { submitContact } from '@/features/contact/service'
import { contactHandlers } from '@/features/contact/handlers'

/** Thin HTTP adapter — the contact logic lives in `src/features/contact`. */
const fail = (code: ContactErrorCode, status: number, headers?: Record<string, string>) =>
  NextResponse.json({ error: contactErrorMessages[code], code }, { status, headers })

export async function POST(request: NextRequest) {
  const rate = await checkRateLimit(getClientIp(request.headers))
  if (!rate.allowed) {
    return fail('rate_limited', 429, {
      'Retry-After': String(Math.ceil((rate.resetAt - Date.now()) / 1000)),
    })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return fail('invalid_input', 400)
  }

  const parsed = contactSchema.safeParse(payload)
  if (!parsed.success) {
    const code = parsed.error.issues[0]?.message
    return fail(isContactErrorCode(code) ? code : 'invalid_input', 400)
  }

  const spam = checkSpam(parsed.data)
  if (!spam.ok) {
    // A honeypot hit looks like a success (nothing saved); the others tell a real person what to fix
    return spam.silent ? NextResponse.json({ success: true }, { status: 201 }) : fail(spam.code, 400)
  }

  try {
    const { id } = await submitContact(parsed.data, contactHandlers)
    return NextResponse.json({ success: true, id }, { status: 201 })
  } catch (error) {
    console.error('Contact form error:', error)
    return fail('server_error', 500)
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
    const messages = await contactStore().list(50)
    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Fetch messages error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
