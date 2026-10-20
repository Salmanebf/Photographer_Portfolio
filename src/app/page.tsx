import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { localeCookie } from '@/i18n/config'
import { negotiateLocale } from '@/i18n/negotiate'

/**
 * `/` has no content of its own: it sends each visitor to their language —
 * their saved choice, else their browser's preference, else English.
 * Done here (not in middleware) so it behaves the same on every host.
 */
export default async function RootRedirect() {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()])
  const locale = negotiateLocale({
    cookie: cookieStore.get(localeCookie)?.value,
    acceptLanguage: headerStore.get('accept-language'),
  })
  redirect(`/${locale}`)
}
