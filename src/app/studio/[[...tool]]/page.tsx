/**
 * Embedded Sanity Studio at /studio.
 *
 * - Set NEXT_PUBLIC_SANITY_PROJECT_ID + NEXT_PUBLIC_SANITY_DATASET in .env.local
 * - Visit /studio to edit content
 * - Without those env vars the rest of the site still works (uses static fallbacks)
 */
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export const dynamic = 'force-static'

export default function StudioPage() {
  return <NextStudio config={config} />
}
