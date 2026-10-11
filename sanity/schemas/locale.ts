import { defineField, defineType } from 'sanity'
import { defaultLocale, localeNames, locales } from '../../src/i18n/config'

/**
 * Text that exists once per language, e.g. { en: "Hello", fr: "Bonjour" }.
 * Languages come from src/i18n/config.ts: adding one there adds a box here.
 * A language left empty falls back to English on the website.
 */
const perLanguage = (type: 'string' | 'text', rows?: number) =>
  locales.map((code) =>
    defineField({
      name: code,
      title: code === defaultLocale ? `${localeNames[code]} (default)` : localeNames[code],
      type,
      ...(type === 'text' ? { rows: rows ?? 3 } : {}),
    })
  )

export const localeString = defineType({
  name: 'localeString',
  title: 'Text (per language)',
  type: 'object',
  fields: perLanguage('string'),
})

export const localeText = defineType({
  name: 'localeText',
  title: 'Long text (per language)',
  type: 'object',
  fields: perLanguage('text', 4),
})

/** Validation helper: the default language must be filled in (others fall back to it). */
export const requireDefaultLanguage = (Rule: any) =>
  Rule.custom((value: Record<string, string> | undefined) =>
    value?.[defaultLocale]?.trim()
      ? true
      : `Fill in the ${localeNames[defaultLocale]} version (other languages fall back to it)`
  )
