import { getDb, type SqlClient } from '@/lib/db'
import type { ContactInput } from './schema'

export type StoredContactMessage = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
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
    created_at timestamptz NOT NULL DEFAULT now()
  )`

type Row = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: Date | string
}

/** Two requests creating the table at the same instant can collide in Postgres; that's harmless. */
const isConcurrentCreate = (err: unknown) =>
  ['42P07', '23505', '42710'].includes((err as { code?: string })?.code ?? '')

/** All SQL for contact messages lives here. */
export function createContactStore(getClient: () => Promise<SqlClient> = getDb) {
  let ready: Promise<unknown> | null = null
  const ensureTable = (client: SqlClient) => {
    ready ??= client.query(CREATE_TABLE).catch((err) => {
      if (isConcurrentCreate(err)) return
      ready = null // allow a retry on the next request
      throw err
    })
    return ready
  }

  return {
    async insert({ name, email, subject, message }: ContactInput): Promise<{ id: string }> {
      const client = await getClient()
      await ensureTable(client)
      const id = crypto.randomUUID()
      await client.query(
        `INSERT INTO contact_messages (id, name, email, subject, message)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, name, email, subject, message]
      )
      return { id }
    },

    async list(limit = 50): Promise<StoredContactMessage[]> {
      const client = await getClient()
      await ensureTable(client)
      const { rows } = await client.query<Row>(
        `SELECT id, name, email, subject, message, is_read, created_at
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
        createdAt: new Date(r.created_at).toISOString(),
      }))
    },
  }
}

export const contactStore = () => createContactStore()
