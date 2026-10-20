import type { ContactErrorCode } from './error-codes'
import type { ContactInput } from './schema'

/** A person cannot write a message in under this; forms filled in by scripts are sent instantly. */
export const MIN_FORM_MS = 1500
/** Real inquiries rarely carry more than a couple of links (a showreel, a website); spam carries many. */
export const MAX_LINKS = 3

const LINK = /(https?:\/\/|www\.)\S+/gi

export type SpamVerdict =
  | { ok: true }
  /** Quietly pretend it worked: nothing is saved, and the bot learns nothing */
  | { ok: false; silent: true }
  /** Tell the visitor why, so a real person can fix it and try again */
  | { ok: false; silent: false; code: ContactErrorCode }

/**
 * Cheap checks that stop most automated spam without a CAPTCHA (which hurts real visitors).
 * Pure, so it is tested without a server. The per-IP rate limit sits in front of this.
 */
export function checkSpam(
  input: Pick<ContactInput, 'website' | 'elapsedMs' | 'message' | 'subject'>
): SpamVerdict {
  if (input.website) return { ok: false, silent: true }
  if (input.elapsedMs !== undefined && input.elapsedMs < MIN_FORM_MS) {
    return { ok: false, silent: false, code: 'too_fast' }
  }
  const links = `${input.subject} ${input.message}`.match(LINK)?.length ?? 0
  if (links > MAX_LINKS) return { ok: false, silent: false, code: 'too_many_links' }
  return { ok: true }
}
