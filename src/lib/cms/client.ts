import { createClient, type SanityClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2024-01-01'

/** True only when Sanity env vars are set. Components fall back to static data otherwise. */
export const sanityEnabled = Boolean(projectId)

/**
 * Optional: talk to a different Sanity API address (a local test server — see
 * `npm run cms:mock` — or a proxy). Unset = the normal Sanity cloud.
 */
const apiHost = process.env.SANITY_API_HOST?.trim() || undefined

const base = {
  projectId: projectId ?? '',
  dataset,
  apiVersion,
  ...(apiHost ? { apiHost, useProjectHostname: false } : {}),
}

/** What visitors see: published content only, via the CDN in production. */
export const sanityClient: SanityClient | null = sanityEnabled
  ? createClient({
      ...base,
      useCdn: process.env.NODE_ENV === 'production' && !apiHost,
      perspective: 'published',
    })
  : null

/** Read token for draft preview (server only; never sent unless draft mode is on). */
export const hasPreviewToken = Boolean(process.env.SANITY_API_READ_TOKEN?.trim())

/** What an editor sees in draft mode: unpublished changes too. Needs SANITY_API_READ_TOKEN. */
export const sanityDraftClient: SanityClient | null =
  sanityEnabled && hasPreviewToken
    ? createClient({
        ...base,
        useCdn: false, // the CDN never serves drafts
        perspective: 'drafts',
        token: process.env.SANITY_API_READ_TOKEN!.trim(),
      })
    : null

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null

export function urlForImage(source: unknown) {
  if (!builder || !source) return null
  // imageUrlBuilder accepts a wide range of inputs (asset refs, image objects, etc.)
  return builder.image(source as Parameters<typeof builder.image>[0])
}

/** Resolve a Sanity image to a plain URL, or return undefined if not set. */
export function imageUrl(source: unknown): string | undefined {
  const u = urlForImage(source)
  return u ? u.auto('format').fit('max').url() : undefined
}
