import { z } from 'zod'

export const contactSchema = z.object({
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

export type ContactInput = z.infer<typeof contactSchema>
