import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Guard: the app must stay deployable on any Node-capable host. Platform
 * features are fine in docs/config on the host's side, never in app code.
 * If this fails, read docs/DEPLOYMENT.md before "fixing" the test.
 */

const root = process.cwd()
const VENDOR = /@vercel\/|@netlify\/|process\.env\.(VERCEL|NETLIFY)\w*|\bVERCEL_[A-Z_]+|\bNETLIFY_[A-Z_]+/

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) return sourceFiles(full)
    return /\.(ts|tsx|mjs|js)$/.test(name) && !name.endsWith('.test.ts') ? [full] : []
  })
}

describe('platform portability', () => {
  it('app code and config reference no hosting-vendor SDKs or env vars', () => {
    const files = [...sourceFiles(join(root, 'src')), join(root, 'next.config.ts'), join(root, 'sanity.config.ts')]
    const offenders = files.filter((f) => VENDOR.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })

  it('has no hosting-vendor dependencies', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })
    expect(deps.filter((d) => /^@(vercel|netlify)\//.test(d) || d === 'vercel' || d === 'netlify-cli')).toEqual([])
  })

  it('uses the plain build/start scripts that every Node host understands', () => {
    const { scripts } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
    expect(scripts.build).toBe('next build')
    expect(scripts.start).toBe('next start')
  })
})
