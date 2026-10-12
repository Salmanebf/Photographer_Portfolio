import { cookies } from 'next/headers'
import { defaultLocale, isLocale, localeCookie, type Locale } from '@/i18n/config'
import en from '@/messages/en.json'
import fr from '@/messages/fr.json'

const all = { en, fr } satisfies Record<Locale, unknown>

/** The owner pages are outside the language URLs, so they follow the language last chosen on the site. */
export async function adminText() {
  const saved = (await cookies()).get(localeCookie)?.value
  const locale: Locale = isLocale(saved) ? saved : defaultLocale
  return { locale, t: all[locale].admin }
}
