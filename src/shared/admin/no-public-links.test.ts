import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * The owner pages (`/studio`, `/admin/...`) must never be linked from the public site.
 * Only the owner area itself (and the files that implement it) may mention them.
 */
const root = join(process.cwd(), 'src')
const MENTION = /["'`]\/(studio|admin)\b/
const ALLOWED = [
  join('app', 'admin'),
  join('app', 'studio'),
  join('shared', 'admin'),
]

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const f = join(dir, n)
    if (statSync(f).isDirectory()) return files(f)
    return /\.(ts|tsx|json)$/.test(n) && !n.endsWith('.test.ts') && !n.endsWith('.test.tsx') ? [f] : []
  })
}

describe('owner pages are not linked from the public site', () => {
  it('no public component, page, message or content file points to /studio or /admin', () => {
    const offenders = files(root)
      .filter((f) => !ALLOWED.some((a) => f.includes(join(root, a))))
      .filter((f) => MENTION.test(readFileSync(f, 'utf8')))
      .map((f) => f.slice(root.length + 1))
    expect(offenders).toEqual([])
  })

  it('the sitemap and robots.txt do not mention them', () => {
    for (const f of ['sitemap.ts', 'robots.ts']) {
      expect(readFileSync(join(root, 'app', f), 'utf8'), f).not.toMatch(/\/studio|\/admin/)
    }
  })
})
