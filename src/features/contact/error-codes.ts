/**
 * Validation errors are stable codes (not sentences) so the browser can show
 * them in the visitor's language. The English text is kept for API users.
 */
export const contactErrorMessages = {
  name_required: 'Name is required',
  name_too_long: 'Name is too long',
  email_invalid: 'Invalid email address',
  email_too_long: 'Email is too long',
  subject_required: 'Project is required',
  subject_too_long: 'Project title is too long',
  message_too_short: 'Message must be at least 10 characters',
  message_too_long: 'Message is too long',
  invalid_input: 'Invalid input',
  too_fast: 'That was very quick — please check your message and send it again.',
  too_many_links: 'Please include no more than 3 links in your message.',
  rate_limited: 'Too many requests — please try again in a minute.',
  server_error: 'Failed to process your message',
} as const

export type ContactErrorCode = keyof typeof contactErrorMessages

export const isContactErrorCode = (v: unknown): v is ContactErrorCode =>
  typeof v === 'string' && v in contactErrorMessages
