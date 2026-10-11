# Changelog

Notable changes, newest first. Roadmap status lives in [`docs/ROADMAP.md`](./docs/ROADMAP.md).

## 2026-10-11 — Hosting stack finalised, portability (Phase 6 database work pulled forward)

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
