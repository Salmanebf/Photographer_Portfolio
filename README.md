# Documentary Filmmaker Portfolio

A cinematic portfolio for a documentary filmmaker, built to **show the work and win new commissions** —
from businesses to individuals with a story to tell (an artist, a collector…).
Dark editorial design, one page per film, lots of short looping video, and a CMS the filmmaker edits himself.

> **All current content (name "Alex Rivera", films, awards, testimonials, images) is generated placeholder
> content.** The structure is what matters; real content replaces it later through the CMS.

**Status:** under active development on a phased plan → see [`docs/ROADMAP.md`](./docs/ROADMAP.md)
(what is done, what is next, and the decisions behind it). Notable changes → [`CHANGELOG.md`](./CHANGELOG.md).
**What to test and how → [`docs/TESTING.md`](./docs/TESTING.md).**

---

## The stack at a glance

| Concern            | Service / tech                  | Why                                                   | Portable?                                  |
| ------------------ | ------------------------------- | ----------------------------------------------------- | ------------------------------------------ |
| Code & hosting     | **Vercel** (Next.js 16)         | Zero-config Next.js, preview URL per branch           | **Yes** — see [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) |
| Video streaming    | **Bunny Stream**                | Adaptive HLS, pay per GB, cheapest quality/price      | Swap by editing `src/shared/media/`        |
| Database           | **Neon** (serverless **PostgreSQL**) | Contact messages; standard Postgres, so the provider is just a connection string | **Yes — any Postgres: change only `DATABASE_URL`** |
| Content (CMS)      | **Sanity** (embedded at `/studio`) | The filmmaker's admin dashboard: films, text, images | Content lives in Sanity, independent of hosting |
| Contact email      | **Resend** (optional)           | Email notification on a new message                   | One handler: `features/contact/handlers/email.ts` |

Front end: **Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Framer Motion**. Language: TypeScript.
Tests: Vitest. CI: GitHub Actions.

```
Browser ─► Vercel (Next.js)
             ├─ /                  home page (sections, server-rendered, revalidate 60 s)
             ├─ /work/[slug]       one page per film (SSG + ISR)
             ├─ /studio            Sanity Studio — the admin dashboard
             ├─ /api/contact       POST: validate → rate-limit → handlers (PostgreSQL, email)
             │                     GET : admin list, gated by CONTACT_ADMIN_TOKEN
             ├─ /sitemap.xml, /robots.txt
             ├─ content  ◄─ Sanity (falls back to src/lib/site.config.ts + data.ts if unset)
             ├─ videos   ◄─ Bunny Stream (HLS) — never served from the site itself
             └─ messages ─► PostgreSQL (Neon) via DATABASE_URL
```

## Site structure

**Live today** (home page, in order): Hero · About · Awards ticker · Films · Services · Testimonials · Contact · Footer,
plus a detail page per film at `/work/<slug>`.

**Planned redesign** (details and phase in the roadmap): new orbit-style Hero with playing video cards ·
creative About that sells a filmmaker with no awards yet · "Films" renamed **Projects** · Services reduced to
*what I offer* · new **Timeline** section (how a project is made, linking to a detail page) ·
Testimonials restyled and renamed · Contact unchanged · later: a photo gallery page. Languages: **EN/FR now, AR later**.

---

## Quick start

```bash
npm ci
cp .env.example .env.local   # everything is optional for local development
npm run dev                  # http://localhost:3000   (Studio at /studio)
```

With **no environment variables** the site runs fully on placeholder content and an in-process Postgres
(PGlite, stored in `.pglite/`, git-ignored) — nothing external needs installing to develop.
To develop against a real Postgres, set `DATABASE_URL` in `.env.local`.

| Command                 | What it does                                                                 |
| ----------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`           | Dev server on :3000                                                          |
| `npm run build`         | `next build` — what Vercel/Netlify run                                       |
| `npm start`             | `next start` — production server on any Node host                            |
| `npm run lint`          | ESLint                                                                       |
| `npm run typecheck`     | `tsc --noEmit`                                                               |
| `npm test`              | Vitest tests (`npm run test:watch` for watch mode). Set `TEST_DATABASE_URL` to also run the real-Postgres tests |
| `BUILD_STANDALONE=1 npm run build` | Self-contained server for Docker/VPS (see `Dockerfile`)            |

CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests (with a real Postgres service) and build on every push and PR.

**Testing the latest changes yourself:** [`docs/TESTING.md`](./docs/TESTING.md) lists every update, how to test it,
and what has *not* been verified yet.

## Environment variables

Copy `.env.example`. All are optional locally; set them in the host's dashboard for production.

| Variable                                       | Purpose                                                              |
| ---------------------------------------------- | -------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                         | Canonical / Open Graph / sitemap base URL (your real domain)         |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `…_DATASET`   | Turns the CMS on; unset = placeholder content from code             |
| `NEXT_PUBLIC_BUNNY_CDN_HOST`                   | Bunny library hostname; unset = `bunny:` videos show only the poster |
| `DATABASE_URL`                                 | PostgreSQL connection string (any provider; Neon: use the *pooled* one). Required in production; unset in dev = in-process Postgres |
| `RESEND_API_KEY`, `CONTACT_NOTIFICATION_EMAIL` | Email on each new contact message                                    |
| `CONTACT_ADMIN_TOKEN`                          | Enables `GET /api/contact` (Bearer token); unset = 404               |
| `BUILD_STANDALONE`                             | Build-time only; `1` = standalone output for Docker                  |

---

## Architecture

The code is organised **by feature**, so one piece (e.g. the contact form → a booking form) can be replaced
without touching the rest.

```
src/
  app/                    routes only — thin adapters that compose features
    layout.tsx page.tsx work/[slug]/ studio/[[...tool]]/ api/contact/ sitemap.ts robots.ts
  features/
    hero/ about/ awards/ services/ testimonials/   home-page sections
    films/                project grid + hover preview, film detail page
    contact/
      schema.ts           zod validation
      rate-limit.ts       in-memory per-IP limiter
      service.ts          runs the handlers in order (critical vs best-effort)
      handlers/           database.ts, email.ts … ← add/remove what happens on submit
      store.ts            ALL SQL for contact messages (table auto-created on first use)
      ui/contact.tsx      the form section (swap for a booking form)
  shared/
    media/                VideoLoop, StreamPlayer, playback limiter, viewer prefs  → docs/PERFORMANCE.md
    layout/               navigation, footer
    effects/              custom cursor, magnetic, scroll progress
    ui/                   shadcn primitives + section heading
    hooks/ lib/           scroll effects, toast, `cn`
  lib/                    data layer: site.config, data (fallback content), queries (Sanity), db (Postgres client)
sanity/schemas/           project, service, testimonial, siteSettings (singleton)
docs/                     ROADMAP, DEPLOYMENT, PERFORMANCE
public/images/            hero, about and film images
```

Rules (also enforced by tests where possible):
- `features/*` may import from `shared/*` and `lib/*`, **never from another feature**.
- Video/iframe playback goes through `shared/media/` only.
- SQL lives only in a feature's `store.ts`; the database client comes from `src/lib/db.ts`.
- **No hosting-vendor code** (`@vercel/*`, `VERCEL_*`, `NETLIFY_*`) anywhere in the app — `src/portability.test.ts` fails if it appears.

### Content with graceful fallback

`src/lib/queries.ts` is the single data-access layer. Each getter reads Sanity if
`NEXT_PUBLIC_SANITY_PROJECT_ID` is set, and falls back to `site.config.ts` / `data.ts` on a missing
config, an error or an empty result. Site settings are merged field-by-field over the static config.
So the site always renders, with or without the CMS.

### Videos

A video is one string in a content field: `bunny:<video-id>`, a YouTube/Vimeo URL, or a direct file URL.
Films get a click-to-play player (adaptive HLS from Bunny, loaded only on click); cards and the hero get
short silent loops that load only when on screen, pause when scrolled away and never exceed 3 playing at once.
Reduced-motion / Data Saver / 2G visitors get the poster instead. Details, budgets and Bunny setup:
[`docs/PERFORMANCE.md`](./docs/PERFORMANCE.md).

### Data model

`DocumentaryProject` (`src/lib/data.ts`): `id, slug, title, subtitle, category, image, year, duration, location,
shortDescription, fullDescription, awards[], credits[{role,name}], gallery[], tags[], video?, preview?, featured?`.
The Sanity `project` type mirrors it, plus `order`. Contact messages: table `contact_messages`
(`id uuid, name, email, subject, message, is_read boolean, created_at timestamptz`), created automatically on first use.
To read messages: SQL editor of your database provider (`select * from contact_messages order by created_at desc`)
or `GET /api/contact` with `CONTACT_ADMIN_TOKEN`.

## Editing content

The filmmaker edits everything at **`/studio`** (Sanity) — see [`CONTENT.md`](./CONTENT.md) (non-developer guide).
Developers can also edit the fallback content directly in `src/lib/site.config.ts` and `src/lib/data.ts`.

## Deploying

Primary target is Vercel; the code is deliberately host-neutral (Netlify or a Docker/VPS host need only
config changes, no code changes). Step-by-step setup for each service, the switch-hosts checklist and known
limitations: [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md).

## Contributing / maintenance

- Run `npm run lint && npm run typecheck && npm test` before pushing.
- **Docs are part of every change**: update `README.md`, `CONTENT.md`, `docs/*`, `.env.example`,
  `docs/ROADMAP.md` (status), `docs/TESTING.md` and `CHANGELOG.md` in the same commit as the code. See `CLAUDE.md`.
