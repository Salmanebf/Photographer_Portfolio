import { contactStore } from '../store'
import type { ContactHandler } from './types'

export const databaseHandler: ContactHandler = {
  name: 'database',
  critical: true,
  async handle(input) {
    return contactStore().insert(input)
  },
}
