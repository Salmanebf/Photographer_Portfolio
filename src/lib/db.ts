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

async function connect(): Promise<SqlClient> {
  const url = process.env.DATABASE_URL?.trim()

  if (url) {
    const { Pool } = await import('pg')
    // Small pool: serverless instances are many and short-lived.
    const pool = new Pool({
      connectionString: url,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    })
    pool.on('error', (err) => console.error('[db] idle client error:', err.message))
    return pool
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'DATABASE_URL is not set. Add your Postgres connection string to the environment (see README → Environment variables).'
    )
  }

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
