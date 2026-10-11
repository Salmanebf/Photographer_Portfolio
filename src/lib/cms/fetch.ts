import { sanityClient, sanityDraftClient, sanityEnabled } from './client'
import { isDraftMode } from './draft'

/** Is a CMS configured at all? (If not, every feature uses its static content.) */
export const cmsEnabled = sanityEnabled

/**
 * Run a GROQ query. Visitors get published content. In draft mode — and only
 * then — the read token is used and unpublished changes are included, uncached.
 * Returns `null` when no CMS is configured.
 */
export async function cmsFetch<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T | null> {
  if (!sanityEnabled || !sanityClient) return null

  if (sanityDraftClient && (await isDraftMode())) {
    return sanityDraftClient.fetch<T>(query, params, { cache: 'no-store' })
  }
  return sanityClient.fetch<T>(query, params)
}
