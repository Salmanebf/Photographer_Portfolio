# Roadmap & decisions

Keep this file current: update the status column and decision log whenever work lands.
Last updated: 2026-10-11.

## Goal

Show the filmmaker's work and win new commissions — from businesses *and* individuals with a story
(e.g. an artist or a collector who wants their story filmed). A strong, scalable structure first; placeholder
content is replaced later. Heavy use of short video must not hurt loading.

## Phases

| #  | Phase                    | Status        | Scope / outcome |
| -- | ------------------------ | ------------- | --------------- |
| 1  | Foundation               | ✅ Done        | `features/`+`shared/` structure, pluggable contact handlers, Vitest, CI, dead code removed |
| 2  | Media engine             | ✅ Done *(real Bunny playback unverified — needs a Bunny library)* | `VideoLoop`, `StreamPlayer`, playback limiter, viewer preferences, `bunny:<id>` refs, performance budget |
| —  | Hosting stack & database | ✅ Done (pulled forward from 6) | Turso replaces Prisma/SQLite; host-neutral build; `DEPLOYMENT.md`; portability test |
| 3  | i18n                     | ⏭ Next        | EN/FR via URL locales, localized CMS fields, language switcher, `hreflang`; layout RTL-ready for AR later |
| 4  | Content model & CMS      | Planned       | Photo series type, make awards/process/SEO editable, branded Studio, draft preview, split data layer per feature |
| 5  | Sections & design        | Planned       | New hero (orbit design, video cards), creative About, Projects, Services (what I offer), Timeline, Testimonials restyle, fix LCP (see below) |
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
| 2026-10-11 | **Vercel** for code, **Turso** for DB, **Sanity** for content | Client's final choice. Turso is libSQL/SQLite, not Postgres — fine for one small table |
| 2026-10-11 | Replace Prisma with `@libsql/client` + a per-feature `store.ts` | Prisma + Turso needs an adapter and manual migrations; one table doesn't justify it; portable everywhere |
| 2026-10-11 | Stay host-neutral: standalone output opt-in, no vendor SDKs, guarded by a test | Client wants to switch hosts (e.g. Netlify) with minor adjustments |

## Open items / risks

- Bunny URL shapes were written from Bunny's docs; verify on first upload (`PERFORMANCE.md`).
- **LCP is 3.5 s** (target 2.5 s): hero tagline hidden ~2.6 s by its entrance animation. Fix in Phase 5.
- Not yet deployed anywhere; Docker image and Netlify unverified (see `DEPLOYMENT.md`).
- Rate limiting is per-instance on serverless hosts until Phase 6.
- Bunny delivery cost depends on where visitors are; confirm the audience's regions.
