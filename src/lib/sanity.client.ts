import { createClient, type SanityClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2024-01-01'

/** True only when Sanity env vars are set. Components fall back to static data otherwise. */
export const sanityEnabled = Boolean(projectId)

export const sanityClient: SanityClient | null = sanityEnabled
  ? createClient({
      projectId: projectId!,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === 'production',
      perspective: 'published',
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
