import { z } from 'zod'
import { locales } from '@/i18n/config'

export { contactErrorMessages, isContactErrorCode, type ContactErrorCode } from './error-codes'

export const contactSchema = z.object({
  name: z.string().min(1, 'name_required').max(100, 'name_too_long').trim(),
  email: z.string().email('email_invalid').max(254, 'email_too_long').trim(),
  subject: z.string().min(1, 'subject_required').max(200, 'subject_too_long').trim(),
  message: z
    .string()
    .min(10, 'message_too_short')
    .max(5000, 'message_too_long')
    .trim(),
  /** Language of the page the visitor wrote from — tells the filmmaker which language to reply in */
  locale: z.enum(locales).optional(),
  /** Honeypot — real users leave it empty; bots fill it in */
  website: z.string().max(500).optional(),
})

export type ContactInput = z.infer<typeof contactSchema>
