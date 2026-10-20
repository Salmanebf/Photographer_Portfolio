import { secretsMatch } from '@/lib/secrets'

/** Constant-time check of an `Authorization: Bearer <token>` header. */
export function isAdminAuthorized(authHeader: string | null, token: string): boolean {
  return secretsMatch(authHeader ?? '', `Bearer ${token}`)
}
