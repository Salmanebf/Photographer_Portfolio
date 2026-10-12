/**
 * Sign-in for the owner-only pages (`/admin/*` and the Studio at `/studio`).
 *
 * One password (`ADMIN_PASSWORD`) → a signed, expiring, HttpOnly cookie. There is no user database and
 * no middleware (the app must stay host-neutral): each protected page checks the cookie itself on the server.
 * Pure functions here (no framework imports) so they are tested without a server.
 */
import { createHmac } from 'node:crypto'
import { secretsMatch } from '@/lib/secrets'

export const ADMIN_COOKIE = 'admin_session'
/** A sign-in lasts 8 hours. */
export const SESSION_SECONDS = 8 * 60 * 60
/** Shorter passwords are refused outright — this is the only lock on the owner's dashboard. */
export const MIN_PASSWORD_LENGTH = 12

type Env = Record<string, string | undefined>

/**
 * - `ok`      a usable password is set: sign-in is required
 * - `open`    nothing is set and this is development: pages are open so local work is easy
 * - `closed`  nothing (or a too-short password) is set in production: pages do not exist (404)
 */
export type AdminState = 'ok' | 'open' | 'closed'

export function adminState(env: Env = process.env): AdminState {
  const pw = env.ADMIN_PASSWORD ?? ''
  if (pw.length >= MIN_PASSWORD_LENGTH) return 'ok'
  return env.NODE_ENV === 'production' ? 'closed' : 'open'
}

const key = (env: Env) => env.ADMIN_SESSION_SECRET || env.ADMIN_PASSWORD || ''
const sign = (exp: number, env: Env) => createHmac('sha256', key(env)).update(`admin:${exp}`).digest('hex')

/** `<expiry seconds>.<signature>`; changing the password (or `ADMIN_SESSION_SECRET`) signs everyone out. */
export function createSessionToken(nowMs = Date.now(), env: Env = process.env): string {
  const exp = Math.floor(nowMs / 1000) + SESSION_SECONDS
  return `${exp}.${sign(exp, env)}`
}

export function verifySessionToken(
  token: string | undefined,
  nowMs = Date.now(),
  env: Env = process.env
): boolean {
  if (!token || adminState(env) !== 'ok') return false
  const [expRaw, sig, ...rest] = token.split('.')
  if (rest.length || !sig || !/^\d{1,12}$/.test(expRaw)) return false
  const exp = Number(expRaw)
  if (exp * 1000 <= nowMs) return false
  return secretsMatch(sig, sign(exp, env))
}

export function passwordMatches(input: string, env: Env = process.env): boolean {
  return adminState(env) === 'ok' && secretsMatch(input, env.ADMIN_PASSWORD ?? '')
}

/** Where a sign-in may send the visitor afterwards: only the owner-only pages, never another site. */
export function safeNext(next: unknown): string {
  const fallback = '/admin/messages'
  if (typeof next !== 'string') return fallback
  const ok = next === '/studio' || next.startsWith('/studio/') || next === '/admin/messages'
  return ok && !next.includes('//') && !next.includes('\\') ? next : fallback
}
