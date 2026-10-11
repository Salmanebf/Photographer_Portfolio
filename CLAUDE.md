# Working on this repository

Documentary-filmmaker portfolio: Next.js 16 · React 19 · Tailwind 4 · Sanity · PostgreSQL (Neon, via `DATABASE_URL`) · Bunny Stream.
Read `README.md` first (stack, structure, env vars) and `docs/ROADMAP.md` (status, decisions).

## Always keep the docs current (client requirement)

Documentation is part of the change, not a follow-up. In the **same commit** as any change that affects
behaviour, structure, content fields, env vars, scripts, hosting or roadmap status, update every affected file:

- `README.md` — must always describe the real stack, structure, commands and env vars (it is the site's "about")
- `CONTENT.md` — the non-developer guide to editing content (Studio fields, videos, contact)
- `docs/ROADMAP.md` — phase status, decision log, open items (and the "Last updated" date)
- `docs/DEPLOYMENT.md`, `docs/PERFORMANCE.md` — hosting/portability and video/perf rules
- `docs/TESTING.md` — the client's test guide (see below)
- `.env.example` — every env var, with a comment
- `CHANGELOG.md` — one entry per notable change, newest first

Before finishing a task, grep the docs for terms you changed (removed packages, renamed files/vars) so nothing stale remains.

## Test everything you build, and tell the client what to test (client requirement)

The client does not test changes as they land; they test later from `docs/TESTING.md`. So after finishing
**any** feature or update:

1. **Test it fully yourself** — beyond unit tests: run the real thing (dev server, production build, real
   Postgres, headless browser as relevant) and fix what breaks. Never report "done" on code that was only type-checked.
2. **Update `docs/TESTING.md`** in the same commit: a new entry (newest first) with *what changed*, *what you
   verified and how*, *step-by-step instructions for the client to test it with the expected result*, and
   **everything you could not test** (needs an account, device, deployed URL, real service…).
3. Add anything unverified to the "Not yet tested" table at the top of that file, and remove items once verified.
4. Be honest: if something was not run, say so. Do not mark an item verified from reasoning alone.

## Commands

`npm run lint` · `npm run typecheck` · `npm test` · `npm run build` — all must pass before pushing (CI runs them).

## Architecture rules

- Code is organised by feature (`src/features/*`) with common code in `src/shared/*`. A feature never imports another feature.
- All video/iframe playback goes through `src/shared/media/` (lazy loading, playback cap, reduced-motion handling).
- SQL only in a feature's `store.ts`; the Postgres client comes from `src/lib/db.ts`. The database provider must stay switchable by changing `DATABASE_URL` alone (no provider-specific SDKs).
- The app must stay host-neutral: no `@vercel/*`, `@netlify/*`, `VERCEL_*`, `NETLIFY_*` in code
  (`src/portability.test.ts` enforces it). Platform specifics belong in `docs/DEPLOYMENT.md`.
- Content must keep working with no CMS configured (fallbacks in `src/lib/site.config.ts` and `data.ts`).
- Current content is placeholder; never present it as real.
