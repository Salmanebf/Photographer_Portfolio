import type { Locale } from '@/i18n/config'
import type { DocumentaryProject, ProjectTranslation } from '../types'
import { projects } from './en'
import { projects as fr } from './fr'

const translations: Partial<Record<Locale, Record<string, ProjectTranslation>>> = { fr }

/** The placeholder films in one language (English where a translation is missing). */
export function staticProjects(locale: Locale): DocumentaryProject[] {
  const t = translations[locale] ?? {}
  return projects.map((p) => (t[p.slug] ? { ...p, ...t[p.slug] } : p))
}
