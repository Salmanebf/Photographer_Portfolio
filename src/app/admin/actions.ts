'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { checkLoginAttempts, getClientIp } from '@/features/contact/rate-limit'
import {
  ADMIN_COOKIE,
  SESSION_SECONDS,
  adminState,
  createSessionToken,
  passwordMatches,
  safeNext,
} from '@/shared/admin/session'

export async function signIn(formData: FormData) {
  if (adminState() !== 'ok') redirect('/admin/login')
  const next = safeNext(formData.get('next'))
  const back = (error: string) => redirect(`/admin/login?error=${error}&next=${encodeURIComponent(next)}`)

  const attempts = await checkLoginAttempts(getClientIp(await headers()))
  if (!attempts.allowed) return back('rate')
  const password = formData.get('password')
  if (typeof password !== 'string' || !passwordMatches(password)) return back('password')

  ;(await cookies()).set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_SECONDS,
  })
  redirect(next)
}

export async function signOut() {
  ;(await cookies()).delete(ADMIN_COOKIE)
  redirect('/admin/login')
}
