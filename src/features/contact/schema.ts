import { z } from 'zod'
import { locales } from '@/i18n/config'

export { contactErrorMessages, isContactErrorCode, type ContactErrorCode } from './error-codes'

export const contactSchema = z.object({
  name: z.string().min(1, 'name_required').max(100, 'name_too_long').trim(),
  email: z.string().email('email_invalid').max(254, 'email_too_long').trim(),
  subject: z.string().min(1, 'subject_required').max(200, 'subject_too_long').trim(),
  message: z.string().min(10, 'message_too_short').max(5000, 'message_too_long').trim(),
  /** Language of the page the visitor wrote from — tells the filmmaker which language to reply in */
  locale: z.enum(locales).optional(),
  /**
   * What the visitor is asking for. Only `inquiry` exists today; a booking form adds its own
   * kind (and its extra answers in `details`) without any database change.
   */
  kind: z.enum(['inquiry']).optional(),
  /** Extra answers for forms with more fields than the basic one (e.g. a booking date, a budget) */
  details: z
    .record(z.string().min(1).max(60), z.string().max(1000))
    .refine((d) => Object.keys(d).length <= 20, 'invalid_input')
    .optional(),
  /** Milliseconds the form was open before sending (a form filled in by a script is sent instantly) */
  elapsedMs: z.number().int().min(0).max(86_400_000).optional(),
  /** Honeypot — real users leave it empty; bots fill it in */
  website: z.string().max(500).optional(),
})

export type ContactInput = z.infer<typeof contactSchema>
