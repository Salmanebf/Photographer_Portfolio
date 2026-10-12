import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { ADMIN_COOKIE, LAST_PAGE_COOKIE, adminState, isOwnerPath, verifySessionToken } from './session'

/** Is the current request signed in as the owner? (Open in local development when no password is set.) */
export async function isSignedIn(): Promise<boolean> {
  const state = adminState()
  if (state === 'open') return true
  if (state === 'closed') return false
  return verifySessionToken((await cookies()).get(ADMIN_COOKIE)?.value)
}

/**
 * Call at the top of an owner-only page or layout. Not configured in production → the page does not exist (404);
 * not signed in → the sign-in page, which returns here afterwards.
 */
export async function requireAdmin(returnTo: string): Promise<void> {
  if (adminState() === 'closed') notFound()
  if (!(await isSignedIn())) redirect(`/admin/login?next=${encodeURIComponent(returnTo)}`)
}

/** For server actions: stop (without redirecting) when the caller is not signed in. */
export async function assertAdmin(): Promise<void> {
  if (!(await isSignedIn())) throw new Error('Not signed in')
}

/** The last owner page visited (validated; null if none or not an owner page). */
export async function lastOwnerPage(): Promise<string | null> {
  const raw = (await cookies()).get(LAST_PAGE_COOKIE)?.value
  if (!raw) return null
  let value = raw
  try {
    value = decodeURIComponent(raw)
  } catch {
    return null
  }
  return isOwnerPath(value) ? value : null
}
