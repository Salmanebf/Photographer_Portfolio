import type { ContactInput } from './schema'
import type { ContactHandler } from './handlers/types'

/**
 * Runs every handler in order. A critical handler failing aborts the
 * submission (the error propagates); a non-critical one is logged and skipped.
 * Returns the first id any handler reported (e.g. the saved row).
 */
export async function submitContact(
  input: ContactInput,
  handlers: ContactHandler[]
): Promise<{ id?: string }> {
  let id: string | undefined
  for (const handler of handlers) {
    try {
      const result = await handler.handle(input)
      if (result?.id && !id) id = result.id
    } catch (err) {
      if (handler.critical) throw err
      console.error(`[contact:${handler.name}] failed:`, err)
    }
  }
  return { id }
}
