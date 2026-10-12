/**
 * Database connection — plain PostgreSQL, configured by ONE variable.
 *
 *   DATABASE_URL=postgres://user:password@host:5432/dbname?sslmode=require
 *
 * Any Postgres works (Neon, Supabase, Railway, RDS, a VPS, local). To change
 * provider, change only that value in your environment / `.env` file — no code.
 *
 *  - Production: DATABASE_URL is required. On serverless hosts use your
 *    provider's *pooled* connection string (Neon: the host containing `-pooler`).
 *  - Development / tests: if DATABASE_URL is unset, an in-process Postgres
 *    (PGlite, stored in `.pglite/`) is used so nothing needs installing.
 *
 * Only each feature's `store.ts` issues SQL. The rest of the app never touches
 * the database.
 */

/** The only two things the app needs from a database client. Both `pg` and PGlite satisfy it. */
export interface SqlClient {
  query<T = Record<string, unknown>>(
    sql: string,
    params?: unknown[]
  ): Promise<{ rows: T[] }>
}

const globalForDb = globalThis as unknown as { __sql?: Promise<SqlClient> }

/** The server name in a connection URL (never the user or password) — safe to print in logs. */
export function databaseHost(url: string): string {
  const m = url.match(/^[a-z][a-z0-9+.-]*:\/\/(?:[^@/?#]*@)?([^:/?#]+)/i)
  return m ? m[1] : 'unknown host'
}

/**
 * Providers such as Neon hand out URLs ending in `?sslmode=require`. The `pg`
 * driver already treats `require` (and `prefer`, `verify-ca`) as the strict
 * `verify-full`, but prints a scary SECURITY WARNING on every start and will
 * change meaning in its next major version. Spell out what really happens, so
 * the pasted URL works unchanged, the logs stay clean and behaviour never silently weakens.
 * (A URL that opts into libpq semantics with `uselibpqcompat=true` is left alone.)
 */
export function normalizeDatabaseUrl(url: string): string {
  if (/[?&]uselibpqcompat=true(&|$)/i.test(url)) return url
  return url.replace(/([?&])sslmode=(require|prefer|verify-ca)(?=&|$)/i, '$1sslmode=verify-full')
}

async function connect(): Promise<SqlClient> {
  const url = process.env.DATABASE_URL?.trim()

  if (url) {
    const { Pool } = await import('pg')
    // Small pool: serverless instances are many and short-lived.
    const pool = new Pool({
      connectionString: normalizeDatabaseUrl(url),
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    })
    pool.on('error', (err) => console.error('[db] idle client error:', err.message))
    console.info(`[db] using PostgreSQL at ${databaseHost(url)}`)
    return pool
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'DATABASE_URL is not set. Add your Postgres connection string to the environment (see README → Environment variables).'
    )
  }

  console.info(
    '[db] DATABASE_URL is not set — using the built-in development database (messages are NOT sent to Neon/your provider)'
  )
  const { PGlite } = await import('@electric-sql/pglite')
  return new PGlite('.pglite')
}

/** One shared client per server instance (survives dev hot reloads). */
export function getDb(): Promise<SqlClient> {
  globalForDb.__sql ??= connect().catch((err) => {
    globalForDb.__sql = undefined // allow a retry on the next request
    throw err
  })
  return globalForDb.__sql
}
