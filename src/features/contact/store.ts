import { getDb, type SqlClient } from '@/lib/db'
import type { ContactInput } from './schema'

export type StoredContactMessage = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  /** language of the page the visitor wrote from (null for older messages) */
  locale: string | null
  /** `inquiry` today; other kinds (e.g. a booking) can be added without a database change */
  kind: string
  /** Extra answers for forms with more fields than the basic one */
  details: Record<string, string> | null
  createdAt: string
}

/** Created automatically on first use — there is no migration step on any host. */
export const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS contact_messages (
    id         uuid PRIMARY KEY,
    name       text NOT NULL,
    email      text NOT NULL,
    subject    text NOT NULL,
    message    text NOT NULL,
    is_read    boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    locale     text,
    kind       text NOT NULL DEFAULT 'inquiry',
    details    jsonb
  )`

/** Counters for the contact form's rate limit (one row per visitor key, reset every window). */
export const CREATE_RATE_TABLE = `
  CREATE TABLE IF NOT EXISTS contact_rate_limits (
    key          text PRIMARY KEY,
    window_start timestamptz NOT NULL DEFAULT now(),
    hits         integer NOT NULL DEFAULT 0
  )`

/** Brings a table created before the `locale` column existed up to date. */
const ADD_COLUMNS = [
  `ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS locale text`,
  `ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'inquiry'`,
  `ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS details jsonb`,
]

type Row = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  locale: string | null
  kind: string
  details: Record<string, string> | null
  created_at: Date | string
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Creates/upgrades the table. Several requests can arrive at once on a fresh
 * database and collide inside Postgres' catalog; every statement is idempotent,
 * so a collided attempt is simply retried a moment later.
 */
async function migrate(client: SqlClient) {
  for (let attempt = 0; ; attempt++) {
    try {
      await client.query(CREATE_TABLE)
      for (const sql of ADD_COLUMNS) await client.query(sql)
      await client.query(CREATE_RATE_TABLE)
      return
    } catch (err) {
      if (attempt >= 4) throw err
      await sleep(30 * (attempt + 1))
    }
  }
}

/** All SQL for contact messages lives here. */
export function createContactStore(getClient: () => Promise<SqlClient> = getDb) {
  let ready: Promise<unknown> | null = null
  const ensureTable = (client: SqlClient) => {
    ready ??= migrate(client).catch((err) => {
      ready = null // allow a retry on the next request
      throw err
    })
    return ready
  }

  return {
    async insert({
      name,
      email,
      subject,
      message,
      locale,
      kind,
      details,
    }: ContactInput): Promise<{ id: string }> {
      const client = await getClient()
      await ensureTable(client)
      const id = crypto.randomUUID()
      await client.query(
        `INSERT INTO contact_messages (id, name, email, subject, message, locale, kind, details)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          id,
          name,
          email,
          subject,
          message,
          locale ?? null,
          kind ?? 'inquiry',
          details ? JSON.stringify(details) : null,
        ]
      )
      return { id }
    },

    /**
     * Counts one hit for `key` in a fixed window and returns the running count; one atomic statement,
     * so concurrent requests on any number of instances all count. Also clears long-expired rows now and then.
     */
    async hitRateLimit(key: string, windowMs: number): Promise<{ count: number; resetAt: number }> {
      const client = await getClient()
      await ensureTable(client)
      const secs = windowMs / 1000
      const expired = `contact_rate_limits.window_start <= now() - make_interval(secs => $2::double precision)`
      const { rows } = await client.query<{
        hits: number
        start_ms: string | number
      }>(
        `INSERT INTO contact_rate_limits (key, window_start, hits) VALUES ($1, now(), 1)
         ON CONFLICT (key) DO UPDATE SET
           hits = CASE WHEN ${expired} THEN 1 ELSE contact_rate_limits.hits + 1 END,
           window_start = CASE WHEN ${expired} THEN now() ELSE contact_rate_limits.window_start END
         RETURNING hits, extract(epoch from window_start) * 1000 AS start_ms`,
        [key, secs]
      )
      if (Math.random() < 0.02) {
        client
          .query(`DELETE FROM contact_rate_limits WHERE window_start < now() - interval '1 day'`)
          .catch(() => {})
      }
      return {
        count: Number(rows[0].hits),
        resetAt: Number(rows[0].start_ms) + windowMs,
      }
    },

    /** Marks a message read or unread (the owner's inbox). */
    async setRead(id: string, read: boolean): Promise<void> {
      const client = await getClient()
      await ensureTable(client)
      await client.query(`UPDATE contact_messages SET is_read = $2 WHERE id = $1::uuid`, [id, read])
    },

    async remove(id: string): Promise<void> {
      const client = await getClient()
      await ensureTable(client)
      await client.query(`DELETE FROM contact_messages WHERE id = $1::uuid`, [id])
    },

    async countUnread(): Promise<number> {
      const client = await getClient()
      await ensureTable(client)
      const { rows } = await client.query<{ n: string | number }>(
        `SELECT count(*) AS n FROM contact_messages WHERE NOT is_read`
      )
      return Number(rows[0].n)
    },

    async list(limit = 50): Promise<StoredContactMessage[]> {
      const client = await getClient()
      await ensureTable(client)
      const { rows } = await client.query<Row>(
        `SELECT id, name, email, subject, message, is_read, locale, kind, details, created_at
         FROM contact_messages ORDER BY created_at DESC LIMIT $1`,
        [limit]
      )
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        subject: r.subject,
        message: r.message,
        read: r.is_read,
        locale: r.locale,
        kind: r.kind,
        details: r.details,
        createdAt: new Date(r.created_at).toISOString(),
      }))
    },
  }
}

export const contactStore = () => createContactStore()
