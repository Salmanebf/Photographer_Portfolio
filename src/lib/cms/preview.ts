/**
 * Where to send an editor after switching preview mode on or off.
 * Only a path on this same site is allowed — never another address — so the
 * preview links cannot be abused as an open redirect.
 */
export function safeRedirectPath(input: string | null | undefined, fallback = '/'): string {
  if (!input || !input.startsWith('/') || input.startsWith('//') || input.includes('\\')) return fallback
  try {
    const base = 'http://preview.local'
    const url = new URL(input, base)
    if (url.origin !== base) return fallback
    return url.pathname + url.search + url.hash
  } catch {
    return fallback
  }
}
