import type { Client } from '@libsql/client'
import { getDb } from '@/lib/db'
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

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS contact_messages (
    id         TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    subject    TEXT NOT NULL,
    message    TEXT NOT NULL,
    is_read    INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  )`

/**
 * All SQL for contact messages lives here. The table is created on first use,
 * so there is no migration step on any platform.
 */
export function createContactStore(client: Client) {
  let ready: Promise<unknown> | null = null
  const ensureTable = () => {
    ready ??= client.execute(CREATE_TABLE).catch((err) => {
      ready = null // allow a retry on the next request
      throw err
    })
    return ready
  }

  return {
    async insert({ name, email, subject, message }: ContactInput): Promise<{ id: string }> {
      await ensureTable()
      const id = crypto.randomUUID()
      await client.execute({
        sql: `INSERT INTO contact_messages (id, name, email, subject, message, created_at)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [id, name, email, subject, message, new Date().toISOString()],
      })
      return { id }
    },

    async list(limit = 50): Promise<StoredContactMessage[]> {
      await ensureTable()
      const res = await client.execute({
        sql: `SELECT id, name, email, subject, message, is_read, created_at
              FROM contact_messages ORDER BY created_at DESC LIMIT ?`,
        args: [limit],
      })
      return res.rows.map((r) => ({
        id: String(r.id),
        name: String(r.name),
        email: String(r.email),
        subject: String(r.subject),
        message: String(r.message),
        read: Number(r.is_read) === 1,
        createdAt: String(r.created_at),
      }))
    },
  }
}

export const contactStore = () => createContactStore(getDb())
