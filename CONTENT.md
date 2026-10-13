# Editing Content (no code required)

This site is designed so the filmmaker (or anyone) can change the brand color,
logo, hero image, films, services, and testimonials **without editing code** —
in **English and French** (each language has its own box for every text).
If a French text is left empty, the English one is shown, so nothing is ever blank.

There are two paths — pick the one that fits.

---

## Path A — Simple edits in one file (no setup)

Open `src/lib/site.config.ts`. Everything you can change is there
(**English** text — the French version of each text is in `src/lib/content/fr.ts`;
change both when you change a sentence):

- **Brand color**: change `brand.color` to any hex (e.g. `'#c9a96e'`). It
  propagates to every accent on the site.
- **Logo monogram**: change `brand.logoMark` (e.g. `'AR'`).
- **Logo image**: drop a PNG/SVG into `public/images/` and set
  `brand.logoImage` to its path (e.g. `'/images/logo.png'`).
- **Home page first screen**: `brand.name` (in the menu), `hero.headline` (the big words in the middle, **one word per line** — 4–6 short words work best) and `hero.tagline` (the small text under them).
- **Hero background**: the default is the dark background of the design. To use a picture instead, set `hero.image` (e.g. `'/images/my-photo.png'`); it is shown dimmed. There is no video background.
  The six cards circling the headline are your **first six projects**: each shows its cover image, and if the project has a *Preview loop* the card plays that short silent video (on both faces).
- **About section**, **stats**, **tools**, **contact info**, **socials**,
  **studio hours** — all in this file.
- **Awards band** (`recognitions`) — the scrolling list of awards/press. Empty
  list = the band is hidden. **Timeline steps** (`process`) — title and text
  of each step; add or remove steps freely.

Films, services, testimonials and photo series each live in their own folder:
`src/features/films/content/en.ts`, `src/features/services/content/en.ts`,
`src/features/testimonials/content/en.ts` and
`src/features/photography/content/en.ts` (English), with the French versions in
the `fr.ts` next to each. Same idea: edit, save, refresh.
A film's `category` is a fixed key (`cultural-heritage`, `cultural-preservation`,
`environmental`, `social-impact`, `other`); its visible name comes from
`src/messages/en.json` / `fr.json` (`categories`).

**Interface text** (buttons, form labels, section titles that are not content, error
messages) lives in
`src/messages/en.json` and `src/messages/fr.json`. Keep both files in step —
the automated tests fail if a key exists in one but not the other.

After edits, redeploy (or restart `npm run dev`). Everything here is
placeholder content until real content replaces it.

---

## Path B — Sanity Studio (recommended for non-devs)

Sanity is a free CMS that gives the filmmaker a friendly editor at
`yoursite.com/admin/studio` — no code, no deploys, edits go live immediately.

> **Opening the Studio:** the address is private (it is not linked from the site). It first asks for the **owner password**
> (the `ADMIN_PASSWORD` set on the host), then Sanity asks for its own sign-in.

### One-time setup

1. Sign up free at <https://www.sanity.io/>
2. Create a project — copy the **Project ID** it gives you.
3. In the Sanity dashboard (*manage → API → CORS origins*) add your site's URL
   (and `http://localhost:3000` while developing) with **credentials allowed**.
   Without this, the Studio at `/admin/studio` cannot sign in.
4. Set the two variables — in `.env.local` locally, or in your hosting
   dashboard in production (see `.env.example`):
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
   Then restart/redeploy and visit `/admin/studio`.
5. Sign in with the Sanity account you created in step 1.
6. Click **Site Settings** to fill in brand color, logo, hero copy, etc.

That's it. Once Sanity is configured, content from the studio takes priority
over the fallback files. If you ever leave a field empty in the studio, the
site falls back to `site.config.ts` / `data.ts`.

### Limits to know about

- The **Studio's colour and logo** come from `src/lib/site.config.ts`
  (`brand.color`, `brand.logoMark`), not from the "Brand Color" field in Site
  Settings (the Studio cannot read its own content before it starts). The website
  itself does use the field.
- **Photo Series** are created in the Studio but the public gallery pages come in a
  later phase, so they do not appear on the site yet.
- The French content that ships with the site is a **draft translation** of the
  placeholder text — a native speaker should review it before launch.
- Images from hosts other than `cdn.sanity.io` / `images.unsplash.com` must be
  added to `images.remotePatterns` in `next.config.ts`.

### What can be edited in the studio

- **Site Settings** (tabs): *Hero*, *About*, **Awards & Press** (one line per award
  or mention; leave empty to hide the scrolling band), **Hero Headline** (the big words), **Timeline** (the project
  steps: title + what happens — shown in the *Timeline* section and on the page `/timeline`), *Contact*, *Footer*, and **Search & Sharing**
  (search-engine title, description, keywords, and the picture shown when the site
  is shared — it defaults to the hero background picture, if you set one). Also: brand color, logo (image or
  monogram).
  The **Hero** tab holds exactly three things: **Hero Headline**, **Hero Tagline**, and the optional **Hero Background Image** (leave it empty for the default dark background).
- **Translations** — every text field shows one box per language
  (*English (default)* and *Français*). Fill in English first; French can be added
  any time. An empty French box shows the English text on the French site.
  Names of people, URLs and numbers are not translated.
- **Documentary Projects** — title, slug, cover image, trailer/video
  (`bunny:<id>` or a YouTube/Vimeo/MP4 URL), a short silent *preview loop* for
  the card, awards, credits, gallery, tags.
  The *Category* is picked from a list and is translated automatically.
  See **Adding videos** below. (Each project gets a public page in every language:
  `/en/work/<slug>` and `/fr/work/<slug>`; the slug is built from the English title.)
- **Photo Series** — title, slug (from the English title), cover image, intro,
  location, year, the photos (each with a **description for screen readers and search
  engines**, and an optional caption), an optional link to the film it was shot
  alongside, order. Describe every photo — the Studio warns when it is empty.
- **Services** — title + description for each offering.
- **Testimonials** — quotes, names, roles, optional linked project.

### Previewing before you publish

Edits become visible to visitors only when you press **Publish**. To check an
unpublished edit (or a brand-new, unpublished film) on the real website first, open
the **preview link** the developer gave you:

`https://your-site/api/draft?secret=<your preview secret>&path=/en/work/your-film`

You will see the site with your unpublished changes and a bar saying **Preview
mode**. Click **Exit preview** in that bar when you are done. Nobody else sees your
unpublished changes, and the preview pages are never indexed by search engines.
Keep the link private — anyone who has it can preview unpublished content. (It
needs `SANITY_PREVIEW_SECRET` and `SANITY_API_READ_TOKEN` to be set on the server —
see the README.)

### Adding videos (Bunny Stream)

Videos are not uploaded to the website. Upload them to your **Bunny Stream**
library, then copy the video's **ID** into the Studio:

- **Trailer / Video** (film page): `bunny:` + the video ID, **without** the `< >` (e.g. `bunny:a746fa4f-d359-4e70-92b3-0c431ce7af60`) — plays on click, adaptive quality.
  A YouTube / Vimeo / MP4 link also works.
- **Preview loop** (the card / hover preview): `bunny:` + the ID of a short
  5–10 second **silent** clip, kept small (about 3 MB or less).
- The six cards on the home page play each project's **Preview loop** (muted, on both sides of the card); if a clip cannot load, the project's cover image stays visible.

Always keep a cover image — it is what shows first, and what visitors with
"reduce motion" or Data Saver see instead of the clip. One-time Bunny setup
(CDN hostname, MP4 fallback) is in `docs/PERFORMANCE.md`.

### Deploying the studio

The studio is bundled with the site at `/admin/studio`. No separate hosting needed.
Content lives in Sanity, so **changing the website's host does not affect it**
(only add the new site URL to Sanity's CORS origins).

---

## Email notifications (optional)

To receive an email every time someone submits the contact form:

1. Get a free API key at <https://resend.com>
2. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxx
   CONTACT_NOTIFICATION_EMAIL=you@example.com
   ```

Without these, the form still works — submissions are still saved in the database.
**To read them:** open `yoursite.com/admin/messages` (private address, not linked from the site) and sign in with the owner
password (`ADMIN_PASSWORD`). You see every message, newest first, with the language to reply in; you can mark messages
read/unread, delete them (two clicks), and reply by email. (For scripts there is also `GET /api/contact` with
`CONTACT_ADMIN_TOKEN`; without that token it is disabled.)

> Resend's default sender (`onboarding@resend.dev`) only delivers to the email
> address of your Resend account. To email anyone else, verify your own domain
> in Resend and set `CONTACT_FROM_EMAIL="Alex Rivera <hello@yourdomain>"` — no code change.

> **Where messages are stored:** in a PostgreSQL database (`DATABASE_URL`, e.g. a
> free Neon database). To read them, open your database provider's SQL editor and
> run `select * from contact_messages order by created_at desc`. The `locale`
> column (`en` / `fr`) tells you **which language the visitor wrote from — reply in
> that language** (the notification email says it too). On your own
> computer (no `DATABASE_URL`) a built-in test database is used. **In production
> `DATABASE_URL` is required** — without it the form reports an error instead of
> silently losing messages. The table is created automatically.

---

## SEO

- The sitemap is auto-generated at `/sitemap.xml`
- `/robots.txt` is auto-generated
- Each `/<language>/work/<slug>` page has its own Open Graph + Twitter card metadata,
  plus `hreflang` links to its other-language version
- Set `NEXT_PUBLIC_SITE_URL` in `.env.local` so canonical URLs and
  Open Graph images use your real domain.
