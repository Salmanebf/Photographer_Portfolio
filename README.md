# Documentary Filmmaker Portfolio

A cinematic portfolio for a documentary filmmaker, built to **show the work and win new commissions** —
from businesses to individuals with a story to tell (an artist, a collector…).
Dark editorial design, one page per film, lots of short looping video, a CMS the filmmaker edits himself, and a
**bilingual site (English / French, Arabic prepared)**.

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
| Content (CMS)      | **Sanity** (embedded at `/studio`) | The filmmaker's admin dashboard: films, photo series, text, images — with a draft preview | Content lives in Sanity, independent of hosting |
| Contact email      | **Resend** (optional)           | Email notification on a new message                   | One handler: `features/contact/handlers/email.ts` |

Front end: **Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Framer Motion** · translations with **next-intl**.
Language: TypeScript. Tests: Vitest. CI: GitHub Actions.

```
Browser ─► Vercel (Next.js)
             ├─ /                  redirects to /en or /fr (saved choice → browser language → English)
             ├─ /en  /fr           home page in each language (sections, revalidate 60 s)
             ├─ /en|fr/work/[slug] one page per film per language (SSG + ISR)
             ├─ /studio            Sanity Studio — the admin dashboard
             ├─ /api/contact       POST: validate → rate-limit → handlers (PostgreSQL, email)
             │                     GET : admin list, gated by CONTACT_ADMIN_TOKEN
             ├─ /sitemap.xml (every page in every language + hreflang), /robots.txt
             ├─ /api/draft         editor-only preview of unpublished changes (secret link)
             ├─ content  ◄─ Sanity (falls back to each feature's placeholder content if unset)
             ├─ videos   ◄─ Bunny Stream (HLS) — never served from the site itself
             └─ messages ─► PostgreSQL (Neon) via DATABASE_URL
```

## Site structure

**Live today** (home page, in order): Hero · About · Awards ticker · Films · Services · Testimonials · Contact · Footer,
plus a detail page per film at `/<language>/work/<slug>`. Every page exists in **English (`/en`) and French (`/fr`)**,
with a language switcher in the header; the right-to-left layout for Arabic is prepared but Arabic is not enabled yet.

**Planned redesign** (details and phase in the roadmap): new orbit-style Hero with playing video cards ·
creative About that sells a filmmaker with no awards yet · "Films" renamed **Projects** · Services reduced to
*what I offer* · new **Timeline** section (how a project is made, linking to a detail page) ·
Testimonials restyled and renamed · Contact unchanged · later: a photo gallery page.

---

## Quick start

```bash
npm ci
cp .env.example .env.local   # everything is optional for local development
npm run dev                  # http://localhost:3000 → /en or /fr   (Studio at /studio)
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
| `npm run cms:mock`      | A fake Sanity API with test documents, to try the CMS code path without a Sanity account (see *Trying the CMS without Sanity*) |
| `BUILD_STANDALONE=1 npm run build` | Self-contained server for Docker/VPS (see `Dockerfile`)            |

CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests (with a real Postgres service) and build on every push and PR.

**Testing the latest changes yourself:** [`docs/TESTING.md`](./docs/TESTING.md) lists every update, how to test it,
and what has *not* been verified yet.

## Environment variables

Copy `.env.example`. All are optional locally; set them in the host's dashboard for production.

| Variable                                       | Purpose                                                              |
| ---------------------------------------------- | -------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                         | Canonical / hreflang / Open Graph / sitemap base URL (your real domain). **Fixed at build time** — set it before building/deploying |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `…_DATASET`   | Turns the CMS on; unset = placeholder content from code             |
| `NEXT_PUBLIC_BUNNY_CDN_HOST`                   | Bunny library hostname; unset = `bunny:` videos show only the poster |
| `DATABASE_URL`                                 | PostgreSQL connection string (any provider; Neon: use the *pooled* one). Required in production; unset in dev = in-process Postgres |
| `RESEND_API_KEY`, `CONTACT_NOTIFICATION_EMAIL` | Email on each new contact message                                    |
| `CONTACT_ADMIN_TOKEN`                          | Enables `GET /api/contact` (Bearer token); unset = 404               |
| `SANITY_API_READ_TOKEN`                        | Sanity token with **Viewer** rights; used **only** in preview mode to read unpublished changes (server-side, never sent to visitors) |
| `SANITY_PREVIEW_SECRET`                        | A long random string that protects the preview link; unset = preview is disabled (404) |
| `SANITY_API_HOST`                              | Advanced/testing: use another Sanity API address (e.g. the fake one from `npm run cms:mock`); unset = the normal Sanity cloud |
| `BUILD_STANDALONE`                             | Build-time only; `1` = standalone output for Docker                  |

---

## Architecture

The code is organised **by feature**, so one piece (e.g. the contact form → a booking form) can be replaced
without touching the rest.

```
src/
  app/                    routes only — thin adapters that compose features
    page.tsx              "/" → redirects to the visitor's language
    [locale]/             layout.tsx (html lang/dir) page.tsx work/[slug]/ not-found.tsx — one copy per language
    studio/[[...tool]]/ api/contact/ sitemap.ts robots.ts
  features/                each feature owns its UI, types, placeholder content, CMS query and normaliser
    hero/ about/ awards/   home-page sections (their text comes from site settings)
    films/                 types.ts · content/{en,fr,index}.ts (placeholders) · normalize.ts · data.ts (CMS query + fallback)
                           · portfolio grid, film detail page      (services/, testimonials/ and photography/ follow the same shape)
    services/ testimonials/   sections + their data
    photography/           photo series: data layer only (no page yet — the gallery comes later)
    contact/
      schema.ts           zod validation
      rate-limit.ts       in-memory per-IP limiter
      service.ts          runs the handlers in order (critical vs best-effort)
      handlers/           database.ts, email.ts … ← add/remove what happens on submit
      store.ts            ALL SQL for contact messages (table auto-created on first use)
      ui/contact.tsx      the form section (swap for a booking form)
  shared/
    content/              site settings (types, CMS normaliser, getter) — brand, hero, about, awards band, "how I work", SEO…
    media/                VideoLoop, StreamPlayer, playback limiter, viewer prefs  → docs/PERFORMANCE.md
    layout/               navigation, footer, language switcher, draft-preview banner
    effects/              custom cursor, magnetic, scroll progress
    ui/                   shadcn primitives + section heading
    hooks/ lib/           scroll effects, toast, `cn`
  i18n/                   languages: config (EN/FR, RTL list), routing, request, negotiate, seo (hreflang), cookie
  messages/               en.json, fr.json — every piece of interface text (buttons, labels, errors…)
  lib/
    cms/                  Sanity client (published + draft), `cmsFetch`, draft-mode detection, per-language `pickLocale`, preview helpers
    site.config.ts        English site copy (brand, hero, about, awards, process, contact…); French in content/fr.ts
    merge.ts secrets.ts db.ts   deep merge, constant-time compare, Postgres client
sanity/                   schemas/ (project, photoSeries, service, testimonial, siteSettings, locale) · components/ (Studio logo)
sanity.config.ts          Studio: brand theme, sidebar structure, document actions
scripts/mock-sanity/      the fake Sanity API (server + test documents)
docs/                     ROADMAP, DEPLOYMENT, PERFORMANCE
public/images/            hero, about and film images
```

Rules (also enforced by tests where possible):
- `features/*` may import from `shared/*` and `lib/*`, **never from another feature**.
- Video/iframe playback goes through `shared/media/` only.
- SQL lives only in a feature's `store.ts`; the database client comes from `src/lib/db.ts`.
- Content is fetched only through `cmsFetch` (`src/lib/cms/fetch.ts`), inside the owning feature's `data.ts`; pages in `src/app` compose the features' getters.
- **No hosting-vendor code** (`@vercel/*`, `VERCEL_*`, `NETLIFY_*`) anywhere in the app — `src/portability.test.ts` fails if it appears.
- **No visible text in components**: interface text goes in `src/messages/en.json` *and* `fr.json` (a test fails if
  their keys differ); content text goes in the CMS or the content files. Use `Link`/`useRouter` from `@/i18n/routing`
  (they keep the language in the URL), and logical CSS (`ms-`, `pe-`, `start-`, `text-start`…) instead of left/right.

### Content with graceful fallback

Each feature has a `data.ts` with its getters (`getProjects`, `getPhotoSeries`, `getServices`,
`getTestimonials`; site settings in `shared/content/site-settings.ts`). A getter asks Sanity (through
`cmsFetch`) when `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, and falls back to the feature's placeholder content
(`content/en.ts` + French overrides) when there is no CMS, it returns nothing yet, or it errors. Site settings
are merged field-by-field over the static config. So the site always renders, with or without the CMS.

A film exists **only if it is in the list** (no CMS ⇒ the placeholders; CMS in use ⇒ the CMS films), so a deleted
or unpublished film is a 404, never a leftover placeholder.

### Draft preview (seeing changes before publishing)

Editors can check unpublished changes on the real site. Set `SANITY_API_READ_TOKEN` (a Viewer token from
sanity.io → API → Tokens) and `SANITY_PREVIEW_SECRET` (any long random string). Then open
`https://your-site/api/draft?secret=<SANITY_PREVIEW_SECRET>&path=/en/work/some-film` — the site shows
unpublished edits and unpublished films, with a "Preview mode" bar and an **Exit preview** link. Visitors never see
drafts: the token is used only when the preview cookie is present, preview pages are `noindex` and `no-store`, and
`path` can only point to this site. (Sanity's own Presentation tool is not wired in yet.)

### Trying the CMS without Sanity

`npm run cms:mock` starts a fake Sanity API (it evaluates the site's real GROQ queries with `groq-js` over test
documents in `scripts/mock-sanity/dataset.mjs`). Run the site against it:

```bash
npm run cms:mock                       # terminal 1 — prints the exact command for terminal 2
NEXT_PUBLIC_SANITY_PROJECT_ID=mock SANITY_API_HOST=http://127.0.0.1:3333 \
SANITY_API_READ_TOKEN=mock-read-token SANITY_PREVIEW_SECRET=letmein npm run dev
```

Everything from the CMS is labelled "(CMS)" / "Mock …" so it is obvious on the page. It is a **test tool**: it does
not replace checking against a real Sanity project (see `docs/TESTING.md`).

### Languages (i18n)

- **URLs** carry the language: `/en/...`, `/fr/...`. `/` redirects using the saved choice (cookie `NEXT_LOCALE`), then
  the browser's `Accept-Language`, then English. There is **no middleware**, so it behaves the same on every host.
- **Interface text** lives in `src/messages/<lang>.json` (next-intl). A missing French string shows the English one.
- **Content**: English is the base (`site.config.ts`, `data.ts`); French is a set of overrides in
  `src/lib/content/fr.ts` and each feature's `content/fr.ts` (anything not overridden stays English). In the CMS every translatable field has one box
  per language (`{ en, fr }`); an empty language falls back to English.
- **Film categories** are stable keys (`cultural-heritage`…) translated through `messages` (`categories.*`), so
  filtering works in every language. Slugs and credit *names* are the same in all languages.
- **SEO**: each page has a canonical URL and `hreflang` links (en, fr, `x-default`) and appears in the sitemap in every language.
- **Contact**: validation errors come back as codes shown in the visitor's language, and each message stores the
  language it was written in, so you know which language to reply in.
- **Add a language** (e.g. Arabic): add the code to `src/i18n/config.ts` (it is already listed as right-to-left), create
  `src/messages/<code>.json`, add `<code>.ts` next to each `fr.ts` (site: `src/lib/content`; films, services, testimonials,
  photography: their `content/` folders) and register it in that folder's `index.ts` (site: `shared/content/site-settings.ts`). The CMS
  boxes, hreflang, sitemap, `<html lang dir>` and mirrored layout follow automatically (see `docs/ROADMAP.md` for what
  Arabic still needs: translations, a font, a review of the remaining directional animations).

### Videos

A video is one string in a content field: `bunny:<video-id>`, a YouTube/Vimeo URL, or a direct file URL.
Films get a click-to-play player (adaptive HLS from Bunny, loaded only on click); cards and the hero get
short silent loops that load only when on screen, pause when scrolled away and never exceed 3 playing at once.
Reduced-motion / Data Saver / 2G visitors get the poster instead. Details, budgets and Bunny setup:
[`docs/PERFORMANCE.md`](./docs/PERFORMANCE.md).

### Data model

`DocumentaryProject` (`src/features/films/types.ts`): `id, slug, title, subtitle, category (key), image, year, duration, location,
shortDescription, fullDescription, awards[], credits[{role,name}], gallery[], tags[], video?, preview?, featured?`.
The Sanity `project` type mirrors it, plus `order`; its text fields are per-language. `PhotoSeries`
(`src/features/photography/types.ts`): `id, slug, title, description?, location, year, cover, photos[{src, width?, height?,
alt, caption?}], relatedProject? (a film slug), featured?`. `SiteSettings` (`src/shared/content/types.ts`) also carries
the awards band (`recognitions[]`), the "how I work" steps (`process[]`) and SEO (`seo.title/description/keywords/ogImage`).
Contact messages: table
`contact_messages` (`id uuid, name, email, subject, message, is_read boolean, created_at timestamptz, locale text`),
created (and upgraded) automatically on first use.
To read messages: SQL editor of your database provider (`select * from contact_messages order by created_at desc`)
or `GET /api/contact` with `CONTACT_ADMIN_TOKEN`.

## Editing content

The filmmaker edits everything at **`/studio`** (Sanity) — see [`CONTENT.md`](./CONTENT.md) (non-developer guide).
Developers can also edit the placeholder content directly: site copy in `src/lib/site.config.ts` (English) and
`src/lib/content/fr.ts` (French); films, services, testimonials and photo series in each feature's `content/en.ts` and
`content/fr.ts`; interface text in `src/messages/*.json`.

## Connecting your accounts

Step-by-step guide to creating the **Neon**, **Sanity**, **Bunny Stream** and **Vercel** accounts and plugging them into the
project (which variable goes where, how to check each one, common problems): [`docs/SERVICES-SETUP.md`](./docs/SERVICES-SETUP.md).

## Deploying

Primary target is Vercel; the code is deliberately host-neutral (Netlify or a Docker/VPS host need only
config changes, no code changes). Step-by-step setup for each service, the switch-hosts checklist and known
limitations: [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md).

## Contributing / maintenance

- Run `npm run lint && npm run typecheck && npm test` before pushing.
- **Docs are part of every change**: update `README.md`, `CONTENT.md`, `docs/*`, `.env.example`,
  `docs/ROADMAP.md` (status), `docs/TESTING.md` and `CHANGELOG.md` in the same commit as the code. See `CLAUDE.md`.
