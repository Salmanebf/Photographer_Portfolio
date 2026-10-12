# Connecting your accounts — Neon, Sanity, Bunny Stream (and Vercel)

A step-by-step guide to creating the accounts the site uses and plugging them in. No coding needed — only copying
values into one file. Allow about **45 minutes** the first time. Do them in this order: **Neon → Sanity → Bunny → Vercel**.

> **Honest note:** this guide was written from each provider's current documentation. The developer could not create
> accounts on your behalf, so these dashboard steps have **not been walked through end to end**. Button names can differ a
> little (the services redesign their dashboards); if you cannot find a label, look for the closest one, and tell the
> developer what you saw. Pricing and free limits change — check each pricing page before you rely on a free plan.

## 0. Ground rules (read once)

- **Use your own email** to create each account (you are the owner) and turn on two-factor sign-in.
- **Connection strings and tokens are passwords.** Never paste them into chat, issues, emails or the code. They go in
  exactly two places: the file `.env.local` on your computer (it is git-ignored, so it never gets committed) and your host's
  *Environment Variables* page.
- Create `.env.local` by copying `.env.example` (`cp .env.example .env.local`), fill in values, then **restart** `npm run dev`.
- Variables whose names start with `NEXT_PUBLIC_` are baked in when the site is **built**, so after changing one on
  your host you must **redeploy**.
- If a secret ever leaks, do not panic: use the *rotate* step in the section below, then update `.env.local` and your host.

| Service | What it does here | Variables |
| ------- | ----------------- | --------- |
| **Neon** | Stores the messages sent through the contact form | `DATABASE_URL` |
| **Sanity** | The admin dashboard (`/studio`): films, texts, photos, languages | `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` · optional preview: `SANITY_API_READ_TOKEN`, `SANITY_PREVIEW_SECRET` |
| **Bunny Stream** | Streams the videos | `NEXT_PUBLIC_BUNNY_CDN_HOST` |
| **Vercel** | Hosts the website | (you enter the variables above there too) |
| *Resend (optional)* | Emails you when someone writes | `RESEND_API_KEY`, `CONTACT_NOTIFICATION_EMAIL` |

---

## 1. Neon — the database (≈ 10 min)

1. Go to **neon.com** (also reachable as neon.tech), create an account and a **new project**. Name it e.g. `portfolio`.
   Choose a **region** close to where your visitors (or your host's servers) are.
2. On the project's dashboard click **Connect**. Keep **Connection pooling turned on** (the default): the host name then
   contains `-pooler`. That is the right one for Vercel/Netlify.
3. Copy the connection string. It looks like
   `postgresql://neondb_owner:…@ep-something-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
4. In `.env.local` add it **unchanged** (keep the `?sslmode=…` part; the site handles it):
   ```
   DATABASE_URL="postgresql://…"
   ```
5. **Check it works:** `npm run dev` — the terminal must print **`[db] using PostgreSQL at ep-…neon.tech`** (your Neon host; it never prints the password).
   Open `http://localhost:3000`, scroll to **Contact**, send a message. Then in Neon open the
   **SQL Editor** (or run `psql "$DATABASE_URL"`) and run
   `select name, subject, locale, created_at from contact_messages order by created_at desc;` — your message is there.
   The table is created automatically on the first message; you do not create anything by hand.

**Good to know:** on the free plan the database may go to sleep when idle, so the first request after a quiet period can take a
second or two. **Rotate the password:** Neon → your project → *Roles* → reset the password, then paste the new string.

| Problem | Likely cause / fix |
| ------- | ------------------ |
| The terminal says **`DATABASE_URL is not set — using the built-in development database`**, or the form works but the message never appears in Neon | The variable is not being read: the name is misspelled, the file is not called exactly `.env.local`, it is not in the project's main folder, or you did not restart `npm run dev`. Until fixed, messages go to a throw-away built-in database on your computer. |
| On the live/production site the form says "Failed to process your message" | `DATABASE_URL` is missing on the host (Vercel → Settings → Environment Variables) — add it and redeploy. The production site never falls back to the built-in database; it reports an error instead. |
| `password authentication failed` | The string was copied wrongly or the password was reset — copy it again from **Connect**. |
| `too many connections` | You pasted the *direct* string; use the **pooled** one (`-pooler`). |

---

## 2. Sanity — the content dashboard (≈ 15 min)

1. Go to **sanity.io**, sign up (Google, GitHub or email) and **create a project** (e.g. `Alex Rivera Portfolio`). Use the default dataset
   name **`production`** and keep the dataset **public**. *(Public means the website can read your **published** content without a
   secret; unpublished drafts always stay private. If the dataset is private the site cannot read it and silently shows the
   placeholder content.)*
2. Find the **Project ID** (a short code like `abc123xy`): on your project in the Sanity management page (sanity.io/manage).
3. **Allow the site to talk to Sanity (CORS).** Sanity management → your project → **API** → **CORS origins** → **Add CORS origin**:
   - `http://localhost:3000` — tick **Allow credentials** (the Studio is part of the site, so it needs them).
   - later, your real address (e.g. `https://yoursite.com`) — also with **Allow credentials**.
   Use the full address with `http://`/`https://` and no trailing slash.
4. In `.env.local` add:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID="abc123xy"
   NEXT_PUBLIC_SANITY_DATASET="production"
   ```
5. **Check it works:** restart `npm run dev` and open `http://localhost:3000/studio`. Sign in with the Sanity account. You should see the
   dark Studio with a gold accent, the **AR / ALEX RIVERA** logo, and in the sidebar *Site Settings · Documentary Projects · Photo Series ·
   Services · Testimonials*.
6. **Add your first content.** Open **Site Settings**, fill in at least *Site Title*, press **Publish**. Then reload the site (it refreshes within
   about a minute).

   **Important to understand:** the site shows the **placeholder** films/services/testimonials *until* you publish at least one of that type in the
   Studio. From then on it shows **only your own** items of that type. So publish your real films together, not one at a time on the live site.
7. **Invite the filmmaker:** Sanity management → **Members** (or *Invite*) → invite their email with an editor-level role (the roles available depend on
   your plan). They then sign in at `/studio` with their own account. No one needs your password.
8. **Optional — preview unpublished changes:** Sanity management → API → **Tokens** → add a token with **Viewer** permission → put it in
   `SANITY_API_READ_TOKEN`; choose a long random text for `SANITY_PREVIEW_SECRET`. Then open
   `http://localhost:3000/api/draft?secret=<your secret>&path=/en` (details: README → *Draft preview*). Both values are secrets.

**Rotate a token:** delete it in Sanity → API → Tokens, create a new one, update `.env.local` and your host.

| Problem | Likely cause / fix |
| ------- | ------------------ |
| The Studio page shows "An error occurred / unable to recover" or the browser console mentions CORS | The origin is missing in step 3, **or** *Allow credentials* is not ticked, **or** the Project ID in `.env.local` is wrong. |
| The Studio works, but the site still shows placeholder content | Nothing published yet (step 6) · dataset is private (step 1) · you did not restart/redeploy after editing the variables · wait ~60 s after publishing. The terminal prints `[Sanity] … fetch failed, using fallback` when a request fails. |
| Preview link answers 404 / 401 / 500 | 404 = `SANITY_PREVIEW_SECRET` not set · 401 = wrong secret in the link · 500 = `SANITY_API_READ_TOKEN` missing. |

---

## 3. Bunny Stream — the videos (≈ 15 min)

1. Go to **bunny.net**, create an account (there is a trial; a payment method is normally needed afterwards — check their pricing page).
2. In the dashboard open **Stream** → **Add Video Library**. Name it (e.g. `portfolio`) and choose the regions you want your videos stored/served from.
3. **Before uploading anything:** open the library → the **Encoding** settings → switch **MP4 Fallback** **on**.
   ⚠️ It only applies to videos uploaded *after* you turn it on. The looping preview clips on the site need it.
4. **Upload a video** (the library's *Videos* tab). Use a source that is **at least 720p** (1080p is best): Bunny does not make files larger than the
   original, and the site asks for 720p on computers, 480p on phones and 360p on slow connections.
5. **Find two values** (open the video; copy its **HLS** playlist URL, which looks like
   `https://vz-xxxxxxxx-xxx.b-cdn.net/3f1c2d4e-…-….../playlist.m3u8`):
   - the **CDN hostname** = the part after `https://` and before the first `/`  →  `vz-xxxxxxxx-xxx.b-cdn.net`
   - the **Video ID** = the long code between the hostname and `/playlist.m3u8`
6. In `.env.local` add:
   ```
   NEXT_PUBLIC_BUNNY_CDN_HOST="vz-xxxxxxxx-xxx.b-cdn.net"
   ```
7. **Use the video on the site** (in the Studio, on a film): *Trailer / Video* = `bunny:` followed by the Video ID (no `< >`, no spaces — e.g. `bunny:a746fa4f-d359-4e70-92b3-0c431ce7af60`). For the short silent loop shown on the film's card use
   a separate short clip: *Preview loop* = `bunny:` + its Video ID (no `< >`) (5–10 seconds, no sound, small).
8. **Check it works:** restart `npm run dev`, open the film's page, press **play**. In the browser's developer tools → *Network*, you should see
   `playlist.m3u8` and video pieces loading from your `b-cdn.net` host. For the card loop you should see `play_720p.mp4` answer `200`.

**Hotlink protection:** if you turn on *allowed referrers* in Bunny's security settings, add your site's domains **and** `localhost`, otherwise videos
answer 403.

| Problem | Likely cause / fix |
| ------- | ------------------ |
| The film shows only the cover image, no play button | `NEXT_PUBLIC_BUNNY_CDN_HOST` is empty, or you did not restart (local) / redeploy (host). |
| Play does nothing or errors | Wrong Video ID, or the library's hostname is wrong (copy it again from the HLS URL). |
| The card loop never plays; `play_720p.mp4` is `404` | MP4 Fallback was off when the video was uploaded (turn it on and **re-upload**), or the source video is smaller than 720p. |
| Videos answer `403` | Referrer protection is on and your domain is not listed. |

*Cost note:* Bunny charges by the amount of video delivered, so keep loops short and small; the full films stream only when someone presses play.

---

## 4. Vercel — hosting (≈ 10 min, details in [`DEPLOYMENT.md`](./DEPLOYMENT.md))

1. Sign in at **vercel.com** with GitHub, **Add New → Project**, import `Salmanebf/Photographer_Portfolio`.
2. Open **Settings → Environment Variables** and add the variables from the table at the top — the **same names** as in `.env.local`
   (tick *Production* and *Preview*). Also set `NEXT_PUBLIC_SITE_URL` to the address the site will really have.
3. **Deploy.** Right now all the work lives on the branch `claude/great-faraday-0gulud`, so Vercel makes a **preview** deployment of it
   (a temporary address you can open and share). When you are happy with it, the work is merged into the main branch to become the **production**
   site — tell the developer when you want that.
4. Add the final site address to Sanity's CORS list (section 2, step 3) and, when you have a domain, attach it in Vercel → *Domains*.
5. Free "Hobby" plans on hosting services are usually **non-commercial**; for the real client-facing site plan for a paid plan (see `DEPLOYMENT.md`).

---

## 5. Everything together — your `.env.local`

```bash
# --- the site -----------------------------------------------------------
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# --- Neon (database) ----------------------------------------------------
DATABASE_URL="postgresql://…-pooler….neon.tech/neondb?sslmode=require&channel_binding=require"

# --- Sanity (content) ---------------------------------------------------
NEXT_PUBLIC_SANITY_PROJECT_ID="abc123xy"
NEXT_PUBLIC_SANITY_DATASET="production"
# optional: preview unpublished changes
SANITY_API_READ_TOKEN=""
SANITY_PREVIEW_SECRET=""

# --- Bunny Stream (video) ----------------------------------------------
NEXT_PUBLIC_BUNNY_CDN_HOST="vz-xxxxxxxx-xxx.b-cdn.net"

# --- optional: email + reading your messages ----------------------------
RESEND_API_KEY=""
CONTACT_NOTIFICATION_EMAIL=""
CONTACT_ADMIN_TOKEN=""
```

### The 10-minute "is everything connected?" check

| # | Do this | You should see |
| - | ------- | -------------- |
| 1 | `npm run dev`, open `http://localhost:3000` | The site opens (in English or French), no red errors in the terminal |
| 2 | Send a message in **Contact** | Success message; the row appears in Neon's SQL Editor with your language |
| 3 | Open `/studio`, sign in | The Studio with the gold theme and the sidebar |
| 4 | Publish *Site Settings* with a new *Site Title* | The new name on the site after ≤ 1 minute |
| 5 | Publish one film with `bunny:<id>` as its video | Its page shows a play button; pressing it plays |
| 6 | Add the French text of that film in the *Français* box | The same film in French at `/fr` |

If a step fails, use the table of problems in the matching section above. For help, send the developer the **error text from the terminal** or
a screenshot — **with any secrets blanked out**, never the secrets themselves.

## 6. Switching providers later

The site is built so the services can be swapped without code changes where possible: another **PostgreSQL** provider = change `DATABASE_URL`
only; another **host** = copy the same variables and follow the checklist in [`DEPLOYMENT.md`](./DEPLOYMENT.md).
Sanity and Bunny content stay where they are when the host changes.
