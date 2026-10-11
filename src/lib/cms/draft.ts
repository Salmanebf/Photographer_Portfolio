import { draftMode } from 'next/headers'

/**
 * Is this request in draft (preview) mode? Only editors who opened the secret
 * preview link have the cookie. Outside a request (build, tests) it is false.
 */
export async function isDraftMode(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled
  } catch {
    return false
  }
}
