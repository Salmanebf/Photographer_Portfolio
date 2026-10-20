import type { ContactInput } from '../schema'
import type { ContactHandler } from './types'

/** Used until a sending domain is verified with the email service (it only delivers to the account owner). */
export const DEFAULT_FROM = 'Portfolio <onboarding@resend.dev>'

/** The sender address: `CONTACT_FROM_EMAIL` (e.g. `Alex Rivera <hello@alexrivera.film>`), else the shared test sender. */
export function emailFrom(env: Record<string, string | undefined> = process.env): string {
  const v = env.CONTACT_FROM_EMAIL?.trim()
  // accept `name@host` or `Name <name@host>`; anything else would only fail at send time
  return v && /^([^<>@]+<[^<>\s@]+@[^<>\s@]+>|[^<>\s@]+@[^<>\s@]+)$/.test(v) ? v : DEFAULT_FROM
}

/** The text of the notification (separated so it can be tested). */
export function emailText(data: ContactInput): string {
  const details = Object.entries(data.details ?? {})
  return (
    `From: ${data.name} <${data.email}>\n` +
    (data.locale ? `Language: ${data.locale} (reply in this language)\n` : '') +
    (data.kind && data.kind !== 'inquiry' ? `Type: ${data.kind}\n` : '') +
    (details.length ? details.map(([k, v]) => `${k}: ${v}`).join('\n') + '\n' : '') +
    `\n${data.message}`
  )
}

/** Optional email notification via Resend; a no-op unless fully configured. */
export const emailHandler: ContactHandler = {
  name: 'email',
  critical: false,
  async handle(data) {
    const apiKey = process.env.RESEND_API_KEY
    const to = process.env.CONTACT_NOTIFICATION_EMAIL
    if (!apiKey || !to) return // not configured — silently skip

    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from: emailFrom(),
      to,
      replyTo: data.email,
      subject: `New inquiry: ${data.subject}`,
      text: emailText(data),
    })
  },
}
