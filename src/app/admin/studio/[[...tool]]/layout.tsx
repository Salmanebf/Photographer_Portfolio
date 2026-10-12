import type { Metadata } from 'next'
import { metadata as studioMetadata } from 'next-sanity/studio'
import { requireAdmin } from '@/shared/admin/guard'

/** The Studio is for the owner only: never indexed (and see the sign-in check below). */
export const metadata: Metadata = {
  ...(studioMetadata as Metadata),
  robots: { index: false, follow: false, nocache: true },
}

/** The Studio uses its own viewport settings (kept from the standard Sanity setup). */
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
}

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  // Signed-in owner only (a password, see docs/DEPLOYMENT.md). Sanity then asks for its own login on top.
  await requireAdmin('/admin/studio')
  return children
}
