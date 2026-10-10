import { db } from '@/lib/db'
import type { ContactHandler } from './types'

export const databaseHandler: ContactHandler = {
  name: 'database',
  critical: true,
  async handle({ name, email, subject, message }) {
    const saved = await db.contactMessage.create({
      data: { name, email, subject, message },
    })
    return { id: saved.id }
  },
}
