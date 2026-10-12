# Roadmap & decisions

Keep this file current: update the status column and decision log whenever work lands.
Last updated: 2026-10-12 (account setup guide).

## Goal

Show the filmmaker's work and win new commissions — from businesses *and* individuals with a story
(e.g. an artist or a collector who wants their story filmed). A strong, scalable structure first; placeholder
content is replaced later. Heavy use of short video must not hurt loading.

## Phases

| #  | Phase                    | Status        | Scope / outcome |
| -- | ------------------------ | ------------- | --------------- |
| 1  | Foundation               | ✅ Done        | `features/`+`shared/` structure, pluggable contact handlers, Vitest, CI, dead code removed |
| 2  | Media engine             | ✅ Done *(real Bunny playback unverified — needs a Bunny library)* | `VideoLoop`, `StreamPlayer`, playback limiter, viewer preferences, `bunny:<id>` refs, performance budget |
| —  | Hosting stack & database | ✅ Done (pulled forward from 6) | PostgreSQL (Neon) via `DATABASE_URL` replaces Prisma/SQLite; host-neutral build; `DEPLOYMENT.md`; portability test |
| 3  | i18n                     | ✅ Done *(French is a draft needing native review; Arabic prepared, not enabled)* | `/en` `/fr` URLs, `/` redirect, UI messages, French content, per-language CMS fields, language switcher, hreflang + sitemap, RTL-ready layout, contact errors/locale in your language |
| 4  | Content model & CMS      | ✅ Done *(real Sanity not yet verified — see TESTING)* | Data layer split per feature (`cmsFetch`), photo-series model (no page yet), awards band / "how I work" steps / SEO keywords & sharing image editable, branded + organised Studio, secret-link draft preview, fake-Sanity test tool |
| 5  | Sections & design        | ⏭ Next        | New hero (orbit design, video cards), creative About, Projects, Services (what I offer), Timeline, Testimonials restyle, fix LCP (see below) |
| 6  | Contact rework           | Planned (partly done) | DB-backed rate limit / spam protection; email sender domain; ready for a booking form |
| 7  | Launch                   | Planned       | Domain & DNS, redirects, analytics, backups, editor walkthrough |
| ∞  | Later                    | Ideas         | Photo gallery page, booking form, Arabic, prints/client galleries (separate scope) |

Estimate for 3–7 was ~3–4 weeks of work at the time of planning; real time depends on how fast real content arrives.

## Planned site structure (from the client brief)

| Section        | Plan |
| -------------- | ---- |
| **Home**       | New hero from the supplied "orbit" design: huge stacked headline, 3D ring of project cards that **play short videos**. Keep the site's existing root style/colours. Must paint the headline immediately (LCP). |
| **About**      | Same format, modified later. The filmmaker has **no awards yet**, so it must convince a client he can deliver something great: showreel, philosophy, the finished films as proof, process, clear "tell me your story" CTA. |
| **Projects**   | Today's *Films*, renamed, with creative adjustments. 4 finished films exist. |
| **Services**   | Only a "what I offer" section. |
| **Timeline**   | **New.** How the work is done — setups and phases until a project is ready — with a short summary and a link to a detail page (designed later). |
| **Testimonials** | Restyle cards and motion; rename to something every visitor understands (e.g. "What clients say"). |
| **Contact**    | Unchanged for now; logic stays swappable (booking form later). |
| **Nav / Footer** | Updated for the new sections and languages. |
| **Photo gallery** | Maybe later, as its own page. Photography is secondary to film. |

## Decision log

| Date       | Decision | Why |
| ---------- | -------- | --- |
| 2026-10-10 | Persona stays **filmmaker**; photography is a secondary section | Client brief |
| 2026-10-10 | Keep **Sanity** (embedded `/studio`) instead of a custom admin | Already included, branded, localizable; a custom admin = weeks of work and security risk |
| 2026-10-10 | Features own their code; contact logic = pluggable handlers | Client wants to swap the form for a booking form later |
| 2026-10-10 | Video via **Bunny Stream** | Pay per GB, free standard encoding, cheaper than Cloudflare Stream / Mux for this volume. *Check delivery pricing if most clients are in Middle East / Africa.* |
| 2026-10-11 | **Vercel** for code, **Bunny** for video, **Sanity** for content | Client's final choice |
| 2026-10-11 | Database: **PostgreSQL (Neon)**, driven only by `DATABASE_URL` — *supersedes the same-day Turso choice* | Client prefers real Postgres and a provider-agnostic setup: switching provider = change one env var |
| 2026-10-11 | Replace Prisma with the plain `pg` driver + a per-feature `store.ts`; in-process Postgres (PGlite) for dev/tests | One table doesn't justify an ORM/migrations; works on any Postgres host; zero-setup local dev |
| 2026-10-11 | Stay host-neutral: standalone output opt-in, no vendor SDKs, guarded by a test | Client wants to switch hosts (e.g. Netlify) with minor adjustments |

| 2026-10-11 | Languages in the URL (`/en`, `/fr`), **no middleware**: `/` redirects from a normal page using cookie → `Accept-Language` → English | Next 16 renamed middleware to *proxy*; avoiding it keeps the site identical on Vercel, Netlify and Docker. The redirect response is `no-store`, so CDNs can't serve one visitor's language to another |
| 2026-10-11 | next-intl for interface text; English = base content, French = overrides; CMS fields stored as `{en, fr}` with English fallback | A missing translation never breaks or blanks a page; adding a language needs no structural change |
| 2026-10-11 | Film `category` stored as a stable key, label translated | Filtering must work identically in every language |
| 2026-10-11 | Gender-neutral French ("cinéaste documentariste") | The persona's gender is unspecified; real wording to be set with the filmmaker |
| 2026-10-11 | Header: full nav from 1024 px, "Collaborate" button from 1280 px; `overflow-x: clip` on `html, body` | The nav already overflowed at tablet widths (worse with the switcher and longer French); a contact column waiting to slide in caused a stray horizontal scrollbar |

| 2026-10-11 | Each feature owns its content, types, CMS query and normaliser (`features/*/{types,content,normalize,data}.ts`); shared CMS plumbing in `lib/cms`; site settings in `shared/content` | Matches the "separate parts" goal; Phase 5 can redesign a section without touching the others |
| 2026-10-11 | A film/photo series exists only if it is in the list (placeholders only when there is no CMS or it is empty) | Deleted/unpublished content must be a 404, never a leftover placeholder |
| 2026-10-11 | Awards band and "how I work" steps moved from translation files to editable content; empty awards list hides the band | The filmmaker has no awards yet; the Timeline (Phase 5) will reuse the steps model |
| 2026-10-11 | Draft preview via a **secret link** (`/api/draft?secret=…`) and a Viewer token used only in preview mode, not Sanity's Presentation tool | Presentation needs a real Sanity project to verify and a public-bundle secret handling we cannot test here; the secret link is simple, safe and testable. Can be upgraded later |
| 2026-10-11 | A **fake Sanity API** (`npm run cms:mock`, `groq-js`) for tests and local trials | The CMS code path had never run; this verifies queries, normalisers, pages and draft mode without an account — it does not replace a real Sanity check |
| 2026-10-11 | Photo series: data layer + Studio type only, no public page yet | The roadmap places the gallery page in a later phase; editors can start entering photos now |

| 2026-10-12 | Treat `sslmode=require` as `verify-full` explicitly; log which database is in use (host only) | A pasted Neon URL must work unchanged without a scary driver warning and without the security level depending on a driver version; a silently ignored `DATABASE_URL` in dev was undetectable |

## Open items / risks

- Bunny URL shapes were written from Bunny's docs; verify on first upload (`PERFORMANCE.md`).
- **LCP is 3.5 s** (target 2.5 s): hero tagline hidden ~2.6 s by its entrance animation. Fix in Phase 5.
- Not yet deployed anywhere; Docker image, Netlify, real Neon, real Sanity and real Bunny are unverified — see the "Not yet tested" table in [`TESTING.md`](./TESTING.md).
- Rate limiting is per-instance on serverless hosts until Phase 6.
- **Real Sanity is still unverified**: the Studio UI (sidebar, theme, logo, per-language boxes, validation, the "Photo Series" type),
  real GROQ results, the CDN, tokens and the draft preview with a real token. Everything else on the CMS path was run against the fake API.
- **Studio brand colour** comes from `site.config.ts`, not from the Site Settings field (the Studio cannot read content before it starts).
- Ideas not done: on-demand revalidation via a Sanity webhook (pages currently refresh within 60 s), Sanity's Presentation / visual editing,
  a public photo gallery page, image `blur` placeholders.
- **French text is a draft** (placeholder content translated for structure). It must be reviewed by a native speaker, and
  real content re-translated, before launch. The gender-neutral wording should be settled with the filmmaker.
- **Arabic** (planned later) still needs: translations, an Arabic font (the current fonts are Latin only), a native review,
  and a pass over the directional hover/slide animations that are not mirrored yet (small hover nudges on film rows and
  the hero/letterbox bars). The layout, `dir="rtl"`, the CMS boxes, hreflang and sitemap are already prepared and were
  checked with a temporary fake Arabic language.
- Old un-prefixed URLs (`/work/<slug>`) return 404 — fine before launch; add redirects if any were ever published.
- Bunny delivery cost depends on where visitors are; confirm the audience's regions.
