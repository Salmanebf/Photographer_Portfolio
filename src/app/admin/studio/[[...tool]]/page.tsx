/**
 * Embedded Sanity Studio at /admin/studio (owner only, under the owner header).
 *
 * - Set NEXT_PUBLIC_SANITY_PROJECT_ID + NEXT_PUBLIC_SANITY_DATASET in .env.local
 * - Without those env vars the rest of the site still works (uses static fallbacks)
 */
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../../sanity.config'

export default function StudioPage() {
  return (
    // Fills the screen below the 4 rem owner header; the CSS makes Sanity's own wrapper (normally a full-screen 100vh) fit this box
    <div className="admin-studio fixed inset-x-0 bottom-0 top-16">
      <style>{`.admin-studio [data-ui="NextStudioLayout"]{height:100% !important;max-height:100% !important}`}</style>
      <NextStudio config={config} />
    </div>
  )
}
