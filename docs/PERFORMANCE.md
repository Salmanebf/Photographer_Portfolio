# Performance & video

The site is video-heavy by design, so the rules below keep it fast. Anything
that plays or streams goes through `src/shared/media/` — never use a bare
`<video>` or `<iframe>` in a feature.

## Budget (mobile, throttled — Lighthouse default)

| Metric                       | Target     | Baseline (2026-10-10) |
| ---------------------------- | ---------- | --------------------- |
| Performance score            | ≥ 90       | 90                    |
| Largest Contentful Paint     | ≤ 2.5 s    | **3.5 s** ✗           |
| Total Blocking Time          | ≤ 200 ms   | 90 ms                 |
| Cumulative Layout Shift      | ≤ 0.1      | 0                     |
| Page weight before any video | ≤ 1.5 MB   | 371 KiB               |

**Known issue:** the LCP element is the hero tagline, delayed ~2.6 s by its
entrance animation (87 % "element render delay", not network). The Phase 5
hero must paint its headline immediately; animate decoration, not the LCP text.

Measure (needs Chrome/Chromium):

```bash
npm run build && npm start &
# measure a language page directly ("/" only redirects): /en and /fr
CHROME_PATH=/path/to/chrome npx lighthouse http://localhost:3000/en \
  --only-categories=performance --form-factor=mobile --chrome-flags="--headless=new --no-sandbox"
```

## What `src/shared/media` guarantees

| Piece             | Behaviour                                                                                          |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| `VideoLoop`       | Silent looping clip. **No video bytes** until on screen; pauses when scrolled away or tab hidden.   |
| `playback-limiter`| At most 3 clips play at once page-wide; the longest-playing is paused first.                       |
| `prefs`           | No autoplay for *reduce motion*, *Data Saver* or 2G. 360p on 3G, 480p on phones, 720p otherwise.   |
| `StreamPlayer`    | Click-to-play films. Only the poster loads first; hls.js is downloaded on click (not at page load). |
| `sources`         | One string describes any video: `bunny:<id>`, YouTube/Vimeo URL, or a file URL.                    |

Verified in a real browser (headless Chromium): lazy sources, hero pauses/resumes
with scroll, ≤ 3 concurrent clips on mobile, zero video requests with reduced motion.

## Rules for content

- **Preview loops** (cards, hero): 5–10 s, silent, ≤ 3 MB, 720p max, H.264 MP4 (or WebM).
- **Films**: upload the full-quality master to Bunny Stream; it makes the adaptive HLS ladder.
- Always give every video a poster image (`image` field) — it is what loads first.
- Do not add more than ~6 simultaneously visible loops to one screen.

## Bunny Stream setup (one time)

1. bunny.net → **Stream** → *Add Video Library*.
2. Library → **Encoding**: enable **MP4 Fallback** (needed for preview loops).
3. Library → **API / CDN**: copy the **CDN Hostname** (`vz-xxxxxxxx-xxx.b-cdn.net`) into
   `NEXT_PUBLIC_BUNNY_CDN_HOST` (your host's environment-variable settings, e.g. Vercel → Settings → Environment Variables).
4. Upload a video, copy its **Video ID** (a GUID), and in the CMS enter `bunny:<that-id>`
   in *Trailer / Video* (film) or *Preview loop* (card clip).

URL shapes used (from Bunny's docs; re-check against your library on first use):
`https://<host>/<id>/playlist.m3u8` (HLS), `/play_720p.mp4` (fallback), `/thumbnail.jpg`.
