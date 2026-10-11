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
    locale     text
  )`

/** Brings a table created before the `locale` column existed up to date. */
const ADD_LOCALE_COLUMN = `ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS locale text`

type Row = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  locale: string | null
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
      await client.query(ADD_LOCALE_COLUMN)
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
    async insert({ name, email, subject, message, locale }: ContactInput): Promise<{ id: string }> {
      const client = await getClient()
      await ensureTable(client)
      const id = crypto.randomUUID()
      await client.query(
        `INSERT INTO contact_messages (id, name, email, subject, message, locale)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, name, email, subject, message, locale ?? null]
      )
      return { id }
    },

    async list(limit = 50): Promise<StoredContactMessage[]> {
      const client = await getClient()
      await ensureTable(client)
      const { rows } = await client.query<Row>(
        `SELECT id, name, email, subject, message, is_read, locale, created_at
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
        createdAt: new Date(r.created_at).toISOString(),
      }))
    },
  }
}

export const contactStore = () => createContactStore()
