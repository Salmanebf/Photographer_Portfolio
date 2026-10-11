# Deployment & portability

**Final stack:** Vercel (code) · Bunny Stream (video) · Turso (database) · Sanity (content).
Only the first one is a *host*; the other three are independent services reached over the internet,
so **moving the code to another host never moves your data, videos or content.**

> Status: nothing is deployed yet. Verified locally: default build + `next start`, and the standalone
> build + `node server.js` (the steps in the `Dockerfile`). The Docker image itself and Netlify
> are **not yet tested** (no Docker daemon in the dev environment; no Netlify account).

## What is (and is not) tied to the host

| Piece                  | Lives at          | Tied to the host? |
| ---------------------- | ----------------- | ----------------- |
| App code               | Git repo → host   | No hosting-vendor code in the app (guarded by `src/portability.test.ts`) |
| Contact messages       | Turso             | No — any host reaches it with the same two env vars |
| Films / text / images  | Sanity            | No — only needs the host's domain added to Sanity's CORS list |
| Videos                 | Bunny Stream      | No — a hostname in an env var |
| Domain / DNS           | Registrar         | No — repoint it when you move |
| Env vars               | Host dashboard    | Re-enter them on the new host (same names) |

Build contract every Node host understands: `npm ci` → `npm run build` → `npm start` (Node 22).
No `vercel.json` / `netlify.toml` is required; the app has none.

## First-time setup (Vercel)

1. **Sanity** — create a project at sanity.io, copy the Project ID. In *manage → API → CORS origins* add
   your site URL (and `http://localhost:3000`) with **credentials allowed** so `/studio` can sign in.
2. **Turso** — create a database (dashboard, or Vercel's Turso integration, which injects the two variables
   for you). You need `TURSO_DATABASE_URL` (`libsql://…`) and `TURSO_AUTH_TOKEN`. No migration step:
   the table is created on the first message.
3. **Bunny Stream** — create a video library, enable *MP4 Fallback*, copy the CDN hostname
   (see [`PERFORMANCE.md`](./PERFORMANCE.md) for the full steps).
4. **Vercel** — import the GitHub repo; framework is auto-detected. Add the environment variables from
   the README table (Production + Preview). Deploy.
5. Attach the custom domain at launch and set `NEXT_PUBLIC_SITE_URL` to it.
6. Optional: `RESEND_API_KEY` + `CONTACT_NOTIFICATION_EMAIL` for email, `CONTACT_ADMIN_TOKEN` to read messages.

## Switching to Netlify (or another host) — checklist

Expected effort: **about an hour, no code changes.**

1. Import the repo on the new host. Build command `npm run build`; leave output settings on auto-detect.
   Netlify documents App Router and on-demand/time-based ISR support in its Next.js runtime
   (not yet verified with this project).
2. Copy **all env vars** over (same names). Do *not* set `BUILD_STANDALONE`.
3. In Sanity, add the new site URL to **CORS origins** (credentials on).
4. Point the domain/DNS at the new host; update `NEXT_PUBLIC_SITE_URL` if the URL changed.
5. Smoke test: home, a film page, `/studio` sign-in, submit the contact form, play a video.
6. Things that may differ slightly per host (config, not code): image-optimisation billing/limits, serverless
   timeouts and regions, ISR cache behaviour. Re-run Lighthouse ([`PERFORMANCE.md`](./PERFORMANCE.md)).
7. Remove the project from Vercel.

## Self-hosting (VPS, DigitalOcean + Coolify/Dokploy, Fly, Render…)

Use the `Dockerfile` (multi-stage, standalone output, Node 22 Alpine, runs as non-root). Build args carry the
`NEXT_PUBLIC_*` values; runtime secrets come from `--env-file`. A host that can run `npm start` doesn't need Docker.
Self-hosting means you own updates, backups and uptime.

## Known limitations (all hosts)

- **Rate limiter is in-memory per server instance.** On serverless hosts each instance has its own counters,
  so the limit is soft. A database-backed limiter is planned with the contact rework (Phase 6).
- Turso is **SQLite-compatible, not Postgres**. Fine for this data; a different database later means rewriting
  only each feature's `store.ts`.
- Local `file:` databases don't persist on hosted platforms — the app logs a warning if production runs without Turso credentials.
