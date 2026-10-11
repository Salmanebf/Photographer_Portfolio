import { createClient, type Client } from '@libsql/client'

/**
 * Database connection (libSQL / Turso).
 *
 *  - Production: set TURSO_DATABASE_URL (`libsql://…`) and TURSO_AUTH_TOKEN.
 *  - Local dev:  nothing to set — falls back to a SQLite file, `local.db`.
 *
 * The same client works on every host (Vercel, Netlify, Docker/VPS) because it
 * talks to Turso over HTTP/WebSocket. Only each feature's `store.ts` issues SQL,
 * so moving to another database means rewriting those, nothing else.
 */

const globalForDb = globalThis as unknown as { __libsql?: Client }

export function getDb(): Client {
  if (globalForDb.__libsql) return globalForDb.__libsql

  const url = process.env.TURSO_DATABASE_URL || 'file:local.db'
  if (process.env.NODE_ENV === 'production' && url.startsWith('file:')) {
    console.warn(
      '[db] TURSO_DATABASE_URL is not set — using a local file. ' +
        'Hosted platforms do not keep local files, so data will be lost. Set Turso credentials.'
    )
  }

  globalForDb.__libsql = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  })
  return globalForDb.__libsql
}
