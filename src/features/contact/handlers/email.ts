import type { ContactHandler } from './types'

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
      from: 'Portfolio <onboarding@resend.dev>',
      to,
      replyTo: data.email,
      subject: `New inquiry: ${data.subject}`,
      text: `From: ${data.name} <${data.email}>\n\n${data.message}`,
    })
  },
}
