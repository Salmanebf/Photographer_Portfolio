import { databaseHandler } from './database'
import { emailHandler } from './email'
import type { ContactHandler } from './types'

/** Order matters: handlers run one after another. */
export const contactHandlers: ContactHandler[] = [databaseHandler, emailHandler]
