import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { safeRedirectPath } from '@/lib/cms/preview'

/** Leaves preview mode (the banner's "Exit preview" link). Harmless to open without a secret. */
export async function GET(request: Request) {
  ;(await draftMode()).disable()
  redirect(safeRedirectPath(new URL(request.url).searchParams.get('path')))
}
