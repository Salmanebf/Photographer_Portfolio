import { describe, expect, it } from 'vitest'
import en from './en.json'
import fr from './fr.json'
import { contactErrorMessages } from '@/features/contact/error-codes'
import { projects } from '@/features/films/content/en'

type Json = string | Json[] | { [k: string]: Json }

/** "contact.errors.name_required" → the string, for every leaf (arrays are indexed). */
function flatten(value: Json, prefix = ''): Record<string, string> {
  if (typeof value === 'string') return { [prefix]: value }
  const entries = Array.isArray(value)
    ? value.map((v, i) => [String(i), v] as const)
    : Object.entries(value)
  return Object.assign({}, ...entries.map(([k, v]) => flatten(v, prefix ? `${prefix}.${k}` : k)))
}

const flatEn = flatten(en as Json)
const flatFr = flatten(fr as Json)

/** `{name}` and plural `{count, plural, …}` placeholders used by a message. */
const placeholders = (s: string) => [...s.matchAll(/\{(\w+)[,}]/g)].map((m) => m[1]).sort()

describe('UI messages: English and French stay in sync', () => {
  it('French has exactly the same keys as English', () => {
    const missing = Object.keys(flatEn).filter((k) => !(k in flatFr))
    const extra = Object.keys(flatFr).filter((k) => !(k in flatEn))
    expect({ missingInFrench: missing, extraInFrench: extra }).toEqual({
      missingInFrench: [],
      extraInFrench: [],
    })
  })

  it('no message is empty', () => {
    const empty = [...Object.entries(flatEn), ...Object.entries(flatFr)]
      .filter(([, v]) => v.trim() === '')
      .map(([k]) => k)
    expect(empty).toEqual([])
  })

  it('French uses the same {placeholders} as English', () => {
    const mismatched = Object.keys(flatEn).filter(
      (k) => JSON.stringify(placeholders(flatEn[k])) !== JSON.stringify(placeholders(flatFr[k] ?? ''))
    )
    expect(mismatched).toEqual([])
  })

  it('every contact error code has a message in both languages', () => {
    for (const code of Object.keys(contactErrorMessages)) {
      expect(flatEn[`contact.errors.${code}`], `en ${code}`).toBeTruthy()
      expect(flatFr[`contact.errors.${code}`], `fr ${code}`).toBeTruthy()
    }
  })

  it('every film category key has a label in both languages', () => {
    for (const key of new Set(projects.map((p) => p.category))) {
      expect(flatEn[`categories.${key}`], `en ${key}`).toBeTruthy()
      expect(flatFr[`categories.${key}`], `fr ${key}`).toBeTruthy()
    }
  })
})
