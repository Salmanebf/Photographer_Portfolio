# Working on this repository

Documentary-filmmaker portfolio: Next.js 16 · React 19 · Tailwind 4 · Sanity · Turso (libSQL) · Bunny Stream.
Read `README.md` first (stack, structure, env vars) and `docs/ROADMAP.md` (status, decisions).

## Always keep the docs current (client requirement)

Documentation is part of the change, not a follow-up. In the **same commit** as any change that affects
behaviour, structure, content fields, env vars, scripts, hosting or roadmap status, update every affected file:

- `README.md` — must always describe the real stack, structure, commands and env vars (it is the site's "about")
- `CONTENT.md` — the non-developer guide to editing content (Studio fields, videos, contact)
- `docs/ROADMAP.md` — phase status, decision log, open items (and the "Last updated" date)
- `docs/DEPLOYMENT.md`, `docs/PERFORMANCE.md` — hosting/portability and video/perf rules
- `.env.example` — every env var, with a comment
- `CHANGELOG.md` — one entry per notable change, newest first

Before finishing a task, grep the docs for terms you changed (removed packages, renamed files/vars) so nothing stale remains.

## Commands

`npm run lint` · `npm run typecheck` · `npm test` · `npm run build` — all must pass before pushing (CI runs them).

## Architecture rules

- Code is organised by feature (`src/features/*`) with common code in `src/shared/*`. A feature never imports another feature.
- All video/iframe playback goes through `src/shared/media/` (lazy loading, playback cap, reduced-motion handling).
- SQL only in a feature's `store.ts`; the libSQL client comes from `src/lib/db.ts`.
- The app must stay host-neutral: no `@vercel/*`, `@netlify/*`, `VERCEL_*`, `NETLIFY_*` in code
  (`src/portability.test.ts` enforces it). Platform specifics belong in `docs/DEPLOYMENT.md`.
- Content must keep working with no CMS configured (fallbacks in `src/lib/site.config.ts` and `data.ts`).
- Current content is placeholder; never present it as real.
