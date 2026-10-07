import path from 'node:path'
import { PrismaClient } from '@prisma/client'

/**
 * Prisma resolves a relative `file:` URL against the schema directory at
 * CLI time, but against its generated client at runtime (which breaks in the
 * standalone build). Resolve it here so dev and production agree:
 * relative paths are taken relative to `<cwd>/prisma`, absolute paths as-is.
 */
function resolveDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL
  if (!url || !url.startsWith('file:')) return url
  const file = url.slice('file:'.length).split('?')[0]
  if (path.isAbsolute(file)) return url
  return `file:${path.resolve(process.cwd(), 'prisma', file)}`
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: resolveDatabaseUrl(),
    log: ['warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
