import { createHash, timingSafeEqual } from 'node:crypto'

function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

/** Constant-time check of an `Authorization: Bearer <token>` header. */
export function isAdminAuthorized(
  authHeader: string | null,
  token: string
): boolean {
  return safeEqual(authHeader ?? '', `Bearer ${token}`)
}
