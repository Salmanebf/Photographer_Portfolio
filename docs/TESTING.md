# Testing guide — what changed, how to test it, what is NOT verified

This file is **for you (the client)**. Updates were built and tested by the developer, but you test them yourself
later — so every update below says (1) what changed, (2) what was already verified and how, (3) exact steps for you,
and (4) what could **not** be tested. It is updated with every phase / update (newest first).

Last updated: 2026-10-11 · Branch: `claude/great-faraday-0gulud`

**Legend:** ✅ verified by the developer (evidence given) · 🧪 you test (steps given) · ⚠️ **not tested — focus here**

---

## 0. Start here

### 0.1 Five-minute check of the whole project (your computer)

Needs Node 22 and Git. No accounts needed.

```bash
git clone https://github.com/Salmanebf/Photographer_Portfolio && cd Photographer_Portfolio
git checkout claude/great-faraday-0gulud
npm ci
npm run lint && npm run typecheck && npm test      # expect: all pass (≈ 46 tests; 3 are skipped without TEST_DATABASE_URL)
npm run dev                                         # open http://localhost:3000
```

Then on the page: scroll through every section, open a film, submit the contact form (valid message → success;
3-letter message → an error message). Nothing should crash or show a blank page.

### 0.2 ⚠️ Not yet tested — focus here (all phases)

Everything the developer could **not** check. Tick them off as you verify; tell the developer what fails.

| Pri | Item | Why it wasn't tested | Where to test |
| --- | ---- | -------------------- | ------------- |
| 🔴 | **Real Neon database** (SSL, pooled URL, cold-start latency) | No Neon account in the dev environment; tested against a real local Postgres 16 instead | U4 · step 2 |
| 🔴 | **Real Sanity project**: sign in at `/studio`, edit films/settings, new `bunny:` fields, content appears on site, CORS | No Sanity project exists; only the schema was validated (0 errors) and the no-CMS fallback tested | U5 below |
| 🔴 | **Real Bunny Stream**: URL shapes, MP4 fallback file names, playback, hotlink-protection setting | No Bunny account; tested with a fake local CDN that mimics the documented URLs | U2 · step 5 |
| 🔴 | **Deploy on Vercel** (build, env vars, ISR, `pg` on serverless, preview URL) | Nothing is deployed; needs your account | U3 · step 4 |
| 🔴 | **GitHub CI run** (does the workflow pass on GitHub, with the Postgres service?) | See CI line in U4 — status recorded there | U4 · step 6 |
| 🟠 | Safari / iPhone: native HLS, autoplay, low-power mode | Only headless Chromium available | U2 · step 7 |
| 🟠 | Real phone: scroll smoothness with many videos, battery, Data Saver mode | No device | U2 · step 6–7 |
| 🟠 | Email notification (Resend) | No API key | U4 · step 7 |
| 🟠 | Admin endpoint `GET /api/contact` on the deployed site | Only tested locally | U4 · step 1 |
| 🟡 | Docker image build (`Dockerfile`) | No Docker daemon in the dev environment (the same steps were run without Docker) | U3 · step 3 |
| 🟡 | Netlify deploy (host switch) | No Netlify account | U3 · step 5 |
| 🟡 | Visual regression after the Phase 1 restructure (looks identical?) | No screenshot comparison done; pages render and respond correctly | U1 |
| 🟡 | Keyboard & screen-reader use of the video play button | Not run | U2 |
| 🟡 | Windows/macOS local dev (in-process Postgres) | Tested on Linux only | U4 · step 1 |

### 0.3 Accounts you'll need for the 🔴 items

Neon (database) · Sanity (CMS) · Bunny (video) · Vercel (hosting). All have free tiers/trials; setup steps are in
[`DEPLOYMENT.md`](./DEPLOYMENT.md) and [`PERFORMANCE.md`](./PERFORMANCE.md).

---

## U5 · Sanity CMS checks (applies to every update that touched content fields)

Fields added/changed so far: film **Trailer / Video** (`bunny:<id>` or URL), film **Preview loop**, **Hero background video**.

- ✅ `npx sanity schema validate` → 0 errors, 0 warnings.
- ✅ The validation pattern accepts `bunny:<guid>` and `https://…`, rejects `bunny:x`, `ftp://…`, plain text (checked directly).
- ✅ With no CMS configured the site renders from placeholder content (tests + every smoke run).

**🧪 You test (needs a Sanity project):**
1. Create a project at sanity.io; in *manage → API → CORS origins* add `http://localhost:3000` with **credentials**.
2. In `.env.local` set `NEXT_PUBLIC_SANITY_PROJECT_ID` (and dataset `production`), restart `npm run dev`, open `/studio`, sign in.
3. Create a *Documentary Project*; in **Trailer / Video** type `hello` → expect the red error "Use bunny:<video-id> or a full https:// URL"; type `bunny:<real-id>` → accepted.
4. Publish; reload `/` and `/work/<slug>` → your film appears. Leave a *Site Settings* field empty → the placeholder value is used.
5. ⚠️ Not verified by the developer: all of the above (no Sanity project available).

---

## U4 · 2026-10-11 — Database is now PostgreSQL (Neon), one `DATABASE_URL`; CI runs on every push; testing guide

**What changed**
- Contact messages are stored in standard **PostgreSQL**; the provider is chosen only by `DATABASE_URL` in `.env`/host settings (Neon first; Supabase/Railway/own server work by changing that value).
- No `DATABASE_URL` in **development** → built-in in-process Postgres (no install). No `DATABASE_URL` in **production** → the form returns an error and logs why (never silently loses data).
- Table `contact_messages` is created automatically on the first message (safe if many requests arrive at once).
- CI now runs on every branch push and includes a real Postgres service. New: this file, `CLAUDE.md` testing rule.

**✅ Verified by the developer**
| Check | Result |
| ----- | ------ |
| Lint, typecheck | pass |
| Tests: 49 total = 4 store tests on in-process Postgres (ran 3× for flakiness) + 3 against a **real Postgres 16.15** + 2 `getDb` tests + the rest | all pass |
| Real Postgres: insert + list through the `pg` pool | pass |
| Real Postgres: 12 simultaneous "first requests" creating the table at once | all 12 stored, no errors |
| Real Postgres: unreachable DB → error, then recovers when reachable again | pass |
| `next dev`, no `DATABASE_URL`: form saves, admin list shows it, `.pglite/` created and git-ignored | pass |
| Production build + `next start` with `DATABASE_URL` → real Postgres: home 200, film 200, form saves, row visible with `psql`, admin 401 without token | pass |
| **Switch provider = change only `DATABASE_URL`** (pointed at a second database): new message landed only in the second DB | pass |
| Production with **no** `DATABASE_URL`: home 200, form → HTTP 500 + clear log message | pass |
| Standalone build (`BUILD_STANDALONE=1`): `pg` is packaged, server runs, form saves | pass |

**🧪 You test**
1. **Local, no database.** `cp .env.example .env.local` (leave `DATABASE_URL` empty), also set `CONTACT_ADMIN_TOKEN=test`. `npm run dev` → submit the contact form → success. Then
   `curl -H "Authorization: Bearer test" http://localhost:3000/api/contact` → JSON containing your message. Without the header → `401`.
2. **Neon.** neon.tech → create a project → *Connection details* → copy the **pooled** string (host has `-pooler`) → put it in `.env.local` as `DATABASE_URL="…"` → restart → submit the form → in Neon's **SQL Editor** run
   `select * from contact_messages order by created_at desc;` → your row is there. Note how long the first submit takes (cold start) — should be a few seconds at most.
3. **Switch test.** In Neon create a second database (or branch), put its URL in `.env.local`, restart, submit again → the new row appears only in the second one. (This proves no code change is needed to switch provider.)
4. **Production guard.** Remove `DATABASE_URL`, run `npm run build && npm start`, submit the form → error message in the page; the terminal says `DATABASE_URL is not set`; the rest of the site works.
5. **Automated, real DB.** With a *throwaway* database URL: `TEST_DATABASE_URL="postgres://…" npm test` (⚠️ it drops/recreates `contact_messages`) → 49 passed, 0 skipped.
6. **CI.** GitHub → Actions → the latest run on this branch is green (see status below).
7. **Email (optional).** Set `RESEND_API_KEY` + `CONTACT_NOTIFICATION_EMAIL`, submit → email arrives (Resend's default sender only delivers to your own Resend account email).

**⚠️ Not tested by the developer:** a real Neon database (SSL, pooler, latency, connection limits) · Vercel's serverless runtime with `pg` · email sending · load/many concurrent users · Windows/macOS for the local in-process database.
**CI status:** pending — recorded below once the push is checked.

---

## U3 · 2026-10-11 — Host-neutral build (Vercel ↔ Netlify ↔ Docker), docs overhaul

**What changed**
- `npm run build` = plain `next build`; `npm start` = `next start`. The standalone/Docker output is opt-in (`BUILD_STANDALONE=1`).
- `Dockerfile` + `.dockerignore`; `docs/DEPLOYMENT.md` (setup + switch-host checklist); `src/portability.test.ts` fails if Vercel/Netlify-specific code is added.
- README rewritten; new `docs/ROADMAP.md`, `CHANGELOG.md`, `CLAUDE.md`, PR template; `CONTENT.md`/`.env.example` refreshed.

**✅ Verified by the developer:** default `next build` produces no standalone folder and `next start` serves home/film/`/studio` (all 200) · `BUILD_STANDALONE=1` build + `node server.js` serves the same · portability test passes · no hosting-vendor references anywhere in code/config (searched) · stale-term sweep of all docs.

**🧪 You test**
1. `npm run build && npm start` → open http://localhost:3000 (all sections, a film page, `/studio` loads).
2. Standalone: `BUILD_STANDALONE=1 npm run build && cp -r .next/static .next/standalone/.next/ && cp -r public .next/standalone/ && DATABASE_URL="…" node .next/standalone/server.js`.
3. Docker (needs Docker): `docker build -t portfolio .` then `docker run -p 3000:3000 --env-file .env.local portfolio` → site on :3000.
4. **Vercel:** import the repo → add env vars (README table) → deploy → open the preview URL → smoke list: home, a film page, `/studio` sign-in, contact form, a video.
5. **Netlify (switch test):** follow the checklist in `docs/DEPLOYMENT.md` → same smoke list. Expect no code changes.
6. Read the README: does it describe the project accurately and make sense to a newcomer?

**⚠️ Not tested:** the Docker image build · any real Vercel or Netlify deploy · ISR (`revalidate`) behaviour on a host · Sanity CORS with a deployed URL.

---

## U2 · 2026-10-10 — Phase 2: media engine (lazy video, Bunny Stream)

**What changed:** `src/shared/media/` — silent looping clips load only when on screen, pause off-screen/hidden tab, max 3 playing at once, skipped for reduced-motion / Data Saver / 2G; click-to-play film player (adaptive HLS from Bunny, hls.js loaded only on click; YouTube/Vimeo/MP4 still work); a video is written as `bunny:<id>`; new optional **Preview loop** per film; hero background uses the same engine; `docs/PERFORMANCE.md` (budgets).

**✅ Verified by the developer** (headless Chromium + generated clips + a **local fake Bunny CDN** serving a real HLS stream over HTTPS)
| Check | Result |
| ----- | ------ |
| 14 unit tests (reference parsing, Bunny URLs, preferences, playback limiter) | pass |
| Hero clip plays on load, pauses when scrolled away, resumes at top (desktop + mobile viewport) | pass |
| Never more than 3 clips playing at once (mobile viewport reached exactly 3) | pass |
| Reduced motion → **zero** video requests | pass |
| Cards load their clip only when near the screen; hover on a film row starts its preview in ~60 ms (8/8 runs) | pass |
| Film page with a Bunny video: **nothing** requested from Bunny before clicking play | pass |
| Click play → hls.js downloaded only now → playlist + segments fetched → video **plays** (`currentTime` advances, blob/MediaSource) | pass |
| YouTube film: click creates the YouTube embed · MP4-file film: plays after click · film without video: poster only, no button | pass |
| Bunny preview loop uses the `play_720p.mp4` fallback URL on hover | pass (3 full runs + 8 isolated; **one early run failed once and could not be reproduced in 11 further runs** — likely first-request timing; tell the developer if you see a preview not starting) |
| Lighthouse mobile baseline: score 90, LCP 3.5 s (hero text hidden by its entrance animation — to be fixed in the Phase 5 hero), 371 KiB | recorded |

**🧪 You test**
1. **Local clip.** Put a short `.mp4` (H.264, ≤3 MB) at `public/videos/clip.mp4`. In `src/lib/site.config.ts` set `hero.video: '/videos/clip.mp4'`; in `src/lib/data.ts` add `preview: '/videos/clip.mp4'` and `video: '/videos/clip.mp4'` to one project. `npm run dev`.
2. Chrome DevTools → **Network** → filter **Media**. Load `/`: only the hero clip is requested. Scroll: other clips start only as they approach the screen. Scroll far away: the hero stops (check it has stopped via the tab's CPU or by pausing indicators).
3. Hover a film row in the list → its preview plays in the side panel. On a narrow window (<1024 px) cards show their loop when scrolled into view.
4. Open that film's page → poster + play button → click → the video plays; before clicking there is no video request.
5. **Bunny.** Follow `docs/PERFORMANCE.md → Bunny Stream setup`; upload a video; set `NEXT_PUBLIC_BUNNY_CDN_HOST`; use `video: 'bunny:<id>'` → film page: click play → in Network see `playlist.m3u8` + segments; with DevTools throttling "Slow 4G" the quality should drop instead of stalling. ⚠️ If it 403s, check Bunny's *hotlink protection / allowed referrers* and add your domain.
6. **Reduced motion.** DevTools → ⋮ → More tools → Rendering → *Emulate CSS prefers-reduced-motion: reduce* → reload → no Media requests, posters shown.
7. **Phone.** Open the (deployed) site on an iPhone and an Android: clips autoplay silently, scrolling stays smooth with several clips, page isn't hot/laggy. iPhone *Low Power Mode* blocks autoplay — then you should see the poster, not a broken box.
8. Keyboard: Tab to the play button, press Enter → plays.

**⚠️ Not tested:** real Bunny (URL shapes written from its docs) · Safari/iOS native HLS and autoplay rules · real phones · Data Saver mode · slow-network quality switching · Vimeo · YouTube actually loading video · keyboard/screen-reader use.

---

## U1 · 2026-10-10 — Phase 1: foundation (structure, contact refactor, tests, CI)

**What changed:** code moved into `src/features/*` and `src/shared/*`; contact API split into schema / rate-limit / service / pluggable handlers (database, email); Vitest + GitHub Actions CI added; unused packages and config removed. **The site should look and behave exactly as before.**

**✅ Verified by the developer:** lint, typecheck, production build · built server: home/film pages 200, form validation error, save, admin list, 401 without token · unit tests for validation, rate limiting (per-IP and global), handler pipeline (critical vs best-effort), admin token check, data-layer fallbacks.

**🧪 You test**
1. Section by section on `/`: Hero, About, Awards ticker, Films, Services, Testimonials, Contact, Footer — compare with how you remember the site; open 2 film pages; use the nav links and the mobile menu.
2. Contact form: valid → success toast; invalid (short message) → error; 6 submissions within a minute → "Too many requests".
3. Hover effects, custom cursor, scroll progress bar still work.

**⚠️ Not tested:** pixel-level visual comparison before/after · animations in Safari/Firefox · the mobile menu on a real phone.

---

## How this file is maintained
Every update adds a new entry at the top (what changed → verified → your steps → not tested) and updates the table in §0.2.
Rule recorded in `CLAUDE.md`. If you find a failure, report the entry number (e.g. "U2 step 3") and what you saw.
