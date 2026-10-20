import type { ContactInput } from '../schema'

/**
 * A contact handler is one thing that happens when someone submits the form
 * (save it, email it, push it to a CRM…). Add, remove or reorder handlers in
 * `handlers/index.ts` without touching the form, the route or the other handlers.
 */
export interface ContactHandler {
  name: string
  /**
   * Critical handlers must succeed: a failure fails the whole submission.
   * Non-critical handlers are best-effort: failures are logged and ignored.
   */
  critical: boolean
  handle(input: ContactInput): Promise<{ id?: string } | void>
}
