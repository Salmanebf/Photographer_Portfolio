# Changelog

Notable changes, newest first. Roadmap status lives in [`docs/ROADMAP.md`](./docs/ROADMAP.md).

## 2026-10-13 — Home hero, round 1

- **Background:** the dark stage from the design is the default; an optional picture from the Studio is shown dimmed. Removed: hero video background, eyebrow and name fields (Hero tab = headline, tagline, image). `hero.image` defaults to empty.
- **Cards:** 6 (was 8), the ring is centred on the headline; the **front and back faces both play the project's Preview loop** (only the facing face plays; own 6-clip allowance; the cover picture stays underneath and is all that shows if a clip fails — a clip is also given up on after 12 s without a first frame). New pure maths module `orbit-math.ts` with tests; new motion (one tilted ring, depth blur/dim, coin flips with a glint, the pointer speeds the ring, scrolling spreads and fades it).
- **Button:** bigger, reacts from ~450 px, swells; the nav **Collaborate** button is removed.
- `VideoLoop` gained `limiter`, `suspended`, `maxQuality` and failure handling. Tests: 189 (+5 with a database). `docs/TESTING.md` entry U12.

## 2026-10-12 — Owner area: Studio at /admin/studio, /admin entry, return to last page

- Studio moved from `/studio` to **`/admin/studio`** (old address = 404); owner menu (Messages · Edit content · Sign out) now also above the Studio.
- `/admin` → `/admin/login`; signed in → the last owner page you were on (path-only cookie, validated on the server), else `/admin/messages`.
- Tests: 177 (+5 with a database). `docs/TESTING.md` entry U11.

## 2026-10-12 — Owner area: message inbox and protected Studio

- **New `/admin/messages`**: read, mark read/unread, delete and reply to contact-form messages (follows the site language). Sign-in page `/admin/login`.
- **`/admin/studio` and `/admin/messages` require `ADMIN_PASSWORD`** (≥ 12 characters; signed HttpOnly cookie, 8 h; login attempts rate-limited). Missing/short password in production = both return 404. No middleware.
- Not linked or listed anywhere public (`robots.txt` no longer mentions `/admin/studio`); `noindex`. New test guards against public links.
- New env vars `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`. Tests: 180 with a database (175 + 5 skipped without). `docs/TESTING.md` entry U10.

## 2026-10-12 — Phase 5 foundation (orbit hero, Timeline) + Phase 6 (contact rework)

- **Orbit hero** (from the supplied design): stacked headline + 3D ring of project cards (video-ready; max 3 clips at once), gold pointer-light button,
  static for reduced motion. Headline is plain server text (no entrance animation); cards mount shortly after load. New `features/hero/{orbit-hero,orbit-engine}`.
- **Content:** new per-language `hero.headline` (Studio: *Hero Headline*); hero stats removed. Hero picture/video is now a dim backdrop.
- **Timeline:** new section + page `/[locale]/timeline` using the editable steps (Studio field renamed *Timeline — Steps*); Services is "what I offer" only.
- **Renames:** Films → Projects, Testimonials → Reviews / "What Clients Say" (EN + FR); nav and footer gain Timeline; sitemap includes `/timeline`.
- **Contact:** database-backed rate limit (`contact_rate_limits`, hashed visitors, in-memory fallback); spam checks (honeypot, too-fast, >3 links) with translated errors;
  `CONTACT_FROM_EMAIL` sender; `kind` + `details` columns for a future booking form (existing tables upgrade automatically).
- Tests: 162 with a database (157 + 5 skipped without). New `docs/TESTING.md` entry U9.

## 2026-10-12 — Account setup guide + two database fixes

- **Studio video fields:** *Hero Background Video* now validates like the film video fields; hints say to type `bunny:` + the ID **without** `< >`.
- **New `docs/SERVICES-SETUP.md`:** step-by-step creation and connection of Neon, Sanity, Bunny Stream and Vercel (variables, checks, problems).
  Linked from the README, `DEPLOYMENT.md`, `TESTING.md` and `.env.example`.
- **Database URL:** `sslmode=require|prefer|verify-ca` is rewritten to the strict `verify-full` (what the driver already did) so a Neon URL works unchanged,
  without the driver's "SECURITY WARNING" and without relying on semantics that change in the driver's next major version (`uselibpqcompat=true` opts out).
- **Startup log** says which database is used (`[db] using PostgreSQL at <host>`, never credentials) or that the built-in development database is in use
  because `DATABASE_URL` is not set.
- Tests: 139 with a database (135 without). New `docs/TESTING.md` entry U8.

## 2026-10-11 — Phase 4: content model & CMS

- **Data layer split per feature:** `features/{films,services,testimonials,photography}/{types,content,normalize,data}.ts`,
  site settings in `shared/content`, shared CMS plumbing in `lib/cms` (client, `cmsFetch`, draft detection, `pickLocale`).
  Old `lib/queries.ts`, `lib/data.ts`, `lib/sanity-normalize.ts` removed. Behaviour unchanged.
- **A film (or photo series) exists only if it is in the list** — a deleted/unpublished film is a 404, no longer a leftover placeholder.
- **New content:** Photo Series (Studio type + data layer; no public page yet); editable **Awards & Press** band (empty = hidden) and
  **How I Work** steps (any number; grid adapts; empty = hidden), moved from the translation files; **SEO keywords** and a **sharing image**
  (defaults to the hero image) in Site Settings.
- **Draft preview:** `/api/draft?secret=…` (+ `/api/draft/disable`) shows unpublished changes with a "Preview mode" bar; `SANITY_API_READ_TOKEN`
  is used only in preview mode; previews are `noindex` and `no-store`; redirect targets are restricted to this site. New env vars:
  `SANITY_API_READ_TOKEN`, `SANITY_PREVIEW_SECRET`, `SANITY_API_HOST` (advanced).
- **Studio:** brand theme + monogram logo (from `site.config.ts`), organised sidebar with icons, Site Settings tabs, `@sanity/icons` added.
- **Fake Sanity API** (`npm run cms:mock`, `scripts/mock-sanity`, `groq-js`) + 12 CMS-path tests that run the real client and real GROQ
  queries; the CMS path had never been executed before.
- Tests: 130 with a database (126 without). New `docs/TESTING.md` entry U7. GitHub CI run #5 passed every step.

## 2026-10-11 — Phase 3: English / French (Arabic prepared)

- **URLs and routing:** pages live under `/en` and `/fr` (`app/[locale]/…`); `/` redirects by saved choice → browser
  language → English. No middleware (host-neutral); the redirect is `no-store`.
- **Interface text** moved to `src/messages/{en,fr}.json` (next-intl); a test enforces identical keys/placeholders.
- **Content:** English base + French overrides (`src/lib/content/fr.ts`) for films, services, testimonials, site copy, SEO.
  Film category is now a stable key (`cultural-heritage`, …) with translated labels. Data getters take the language.
- **Sanity:** translatable fields became per-language (`localeString` / `localeText`, English fallback, old plain strings
  still read); category is a dropdown of keys; search-engine title/description added to Site Settings.
- **SEO:** canonical + hreflang (en, fr, x-default) per page; sitemap lists every page in every language.
- **Contact:** validation errors are codes shown in the visitor's language; `locale` is stored with each message
  (column added to existing tables automatically) and shown in the notification email; table creation retries safely under concurrency.
- **Switcher** (header + mobile menu) keeps the page and anchor and remembers the choice in a cookie.
- **Arabic prepared:** `dir="rtl"` from the language list, logical CSS across the components, RTL slide animations,
  mirrored arrows; checked with a temporary fake `ar` locale (not enabled).
- **Fixes found by testing:** header overflowed at tablet widths (now full nav ≥1024 px, Collaborate ≥1280 px); stray
  horizontal scrollbar from the off-screen slide-in contact column (`overflow-x: clip`).
- Tests: 95 (with a database; 91 without). New `docs/TESTING.md` entry U6. GitHub CI run #3 passed every step.

## 2026-10-11 — Database changed to PostgreSQL (Neon), provider set by one env var

- Turso/libSQL replaced by standard **PostgreSQL** (`pg` driver) configured only by `DATABASE_URL`, so any provider
  (Neon, Supabase, Railway, own server) works by changing that one value. No provider-specific SDK.
- Development/tests with no `DATABASE_URL` use an in-process Postgres (PGlite, `.pglite/`). In production a missing
  `DATABASE_URL` is an explicit error, never a silent local fallback.
- `contact_messages` is now a Postgres table (uuid, boolean, timestamptz); created on first use, safe under
  concurrent first requests.
- Tests: real-Postgres integration suite (`TEST_DATABASE_URL`), run in CI with a Postgres service.
- CI now runs on every branch push (it previously ran only for PRs and `main`, so it had never executed).
- New `docs/TESTING.md` (what to test and how, plus everything not yet verified) and a rule in `CLAUDE.md` to keep it current.
- Removed `@libsql/client`; env vars `TURSO_*` removed, `DATABASE_URL` added.
- First GitHub CI run (commit `32c76f5`) passed all steps, including the real-Postgres tests.

## 2026-10-11 — Hosting stack finalised, portability (Phase 6 database work pulled forward)

> The database part of this entry was superseded the same day by the PostgreSQL entry above it.

- **Database:** Prisma + SQLite replaced by **Turso (libSQL)** via `@libsql/client`. All contact SQL is in
  `features/contact/store.ts`; the table is created automatically. Local dev uses a `local.db` file.
  Removed `prisma/`, `db:*` scripts and the `DATABASE_URL` variable. New: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`.
- **Portability:** `output: "standalone"` is now opt-in (`BUILD_STANDALONE=1`); `build` is plain `next build`
  and `start` is `next start`. Added `Dockerfile` (untested image build — equivalent steps verified),
  `docs/DEPLOYMENT.md`, and `src/portability.test.ts` which fails if hosting-vendor code is introduced.
- **Docs:** README rewritten (stack, structure, env, architecture); added `docs/ROADMAP.md`, this changelog,
  `CLAUDE.md` (docs-maintenance rule) and a PR template.
- Tests: 44.

## 2026-10-10 — Phase 2: media engine

- `shared/media`: `VideoLoop`, `StreamPlayer`, playback limiter, viewer preferences; Bunny Stream support
  via `bunny:<id>`; new optional `preview` loop per film; hero background video uses the same engine.
- Sanity `video` / `heroVideo` fields are strings accepting `bunny:<id>` or https URLs.
- `docs/PERFORMANCE.md`: budgets, Lighthouse baseline (mobile 90, LCP 3.5 s — hero animation, fixed in Phase 5).

## 2026-10-10 — Phase 1: foundation

- Reorganised into `features/` + `shared/`; contact API split into schema / rate-limit / service / pluggable handlers.
- Added Vitest and GitHub Actions CI (lint, typecheck, test, build).
- Removed unused `styled-components`, `tailwindcss-animate` and the dead Tailwind v3 config.
