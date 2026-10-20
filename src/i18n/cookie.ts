import { localeCookie, type Locale } from './config'

/** Remember the visitor's language for a year (read by the `/` redirect). Browser only. */
export function rememberLocale(locale: Locale) {
  document.cookie = `${localeCookie}=${locale}; path=/; max-age=31536000; samesite=lax`
}
