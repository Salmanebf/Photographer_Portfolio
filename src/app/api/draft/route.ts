import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import { hasPreviewToken } from '@/lib/cms/client'
import { safeRedirectPath } from '@/lib/cms/preview'
import { secretsMatch } from '@/lib/secrets'

/**
 * Turns on preview mode for the editor who opens this link, so they can see
 * unpublished changes on the real site:
 *
 *   /api/draft?secret=<SANITY_PREVIEW_SECRET>&path=/en/work/some-film
 *
 * Disabled (404) until SANITY_PREVIEW_SECRET is set. Needs SANITY_API_READ_TOKEN too.
 */
export async function GET(request: Request) {
  const secret = process.env.SANITY_PREVIEW_SECRET
  if (!secret) return NextResponse.json({ error: 'Disabled' }, { status: 404 })

  const { searchParams } = new URL(request.url)
  if (!secretsMatch(searchParams.get('secret') ?? '', secret)) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }
  if (!hasPreviewToken) {
    return NextResponse.json(
      { error: 'Preview needs SANITY_API_READ_TOKEN to be set on the server' },
      { status: 500 }
    )
  }

  ;(await draftMode()).enable()
  redirect(safeRedirectPath(searchParams.get('path')))
}
