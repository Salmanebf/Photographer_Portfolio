/**
 * Video references.
 *
 * Content stores a video as ONE string (so CMS fields and fallback data need
 * no migration). It can be:
 *   - `bunny:<video-guid>`            a Bunny Stream video (HLS + MP4 fallback)
 *   - a YouTube / Vimeo URL
 *   - a direct file URL (.mp4 / .webm …)
 */

export type VideoRef =
  | { kind: 'bunny'; id: string }
  | { kind: 'youtube'; id: string }
  | { kind: 'vimeo'; id: string }
  | { kind: 'file'; url: string }

const BUNNY_RE = /^bunny:([A-Za-z0-9-]{8,64})$/
const YOUTUBE_RE =
  /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
const VIMEO_RE = /vimeo\.com\/(?:video\/)?(\d+)/

export function parseVideoRef(input?: string | null): VideoRef | null {
  const value = input?.trim()
  if (!value) return null

  const bunny = value.match(BUNNY_RE)
  if (bunny) return { kind: 'bunny', id: bunny[1] }

  const yt = value.match(YOUTUBE_RE)
  if (yt) return { kind: 'youtube', id: yt[1] }

  const vimeo = value.match(VIMEO_RE)
  if (vimeo) return { kind: 'vimeo', id: vimeo[1] }

  if (/^(https?:)?\/\//.test(value) || value.startsWith('/')) {
    return { kind: 'file', url: value }
  }
  return null
}

/* ---------------- Bunny Stream URLs ---------------- */

export type ClipQuality = 360 | 480 | 720 | 1080

/**
 * Bunny serves every video from your library's pull-zone hostname, e.g.
 * `vz-1a2b3c4d-5e6.b-cdn.net`. Set it in NEXT_PUBLIC_BUNNY_CDN_HOST.
 * (MP4 fallback must be enabled in the library settings for `mp4()`.)
 */
export function bunnyUrls(id: string, host = process.env.NEXT_PUBLIC_BUNNY_CDN_HOST) {
  const base = host ? `https://${host.replace(/^https?:\/\//, '').replace(/\/$/, '')}/${id}` : null
  return {
    enabled: base !== null,
    hls: base && `${base}/playlist.m3u8`,
    thumbnail: base && `${base}/thumbnail.jpg`,
    mp4: (quality: ClipQuality = 720) => base && `${base}/play_${quality}p.mp4`,
  }
}

/** The URL a muted looping clip should play, or null if it can't be resolved. */
export function clipSource(ref: VideoRef | null, quality: ClipQuality = 720): string | null {
  if (!ref) return null
  if (ref.kind === 'file') return ref.url
  if (ref.kind === 'bunny') return bunnyUrls(ref.id).mp4(quality)
  return null // YouTube/Vimeo can't be used as silent background loops
}
