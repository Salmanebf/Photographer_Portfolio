# Editing Content (no code required)

This site is designed so the filmmaker (or anyone) can change the brand color,
logo, hero image, films, services, and testimonials **without editing code**.

There are two paths — pick the one that fits.

---

## Path A — Simple edits in one file (no setup)

Open `src/lib/site.config.ts`. Everything you can change is there:

- **Brand color**: change `brand.color` to any hex (e.g. `'#c9a96e'`). It
  propagates to every accent on the site.
- **Logo monogram**: change `brand.logoMark` (e.g. `'AR'`).
- **Logo image**: drop a PNG/SVG into `public/images/` and set
  `brand.logoImage` to its path (e.g. `'/images/logo.png'`).
- **Name & tagline**: edit `brand.name`, `hero.tagline`, `hero.nameLine1/2`.
- **Hero image / video**: replace `/public/images/hero-doc.png` or set
  `hero.video` to an mp4/webm URL.
- **About section**, **stats**, **tools**, **contact info**, **socials**,
  **studio hours** — all in this file.

Films, services and testimonials live in `src/lib/data.ts`. Same idea:
edit the array, save, refresh.

After edits, redeploy (or restart `npm run dev`).

---

## Path B — Sanity Studio (recommended for non-devs)

Sanity is a free CMS that gives the filmmaker a friendly editor at
`yoursite.com/studio` — no code, no deploys, edits go live immediately.

### One-time setup

1. Sign up free at <https://www.sanity.io/>
2. Create a project — copy the **Project ID** it gives you.
3. Create a `.env.local` file in the project root (copy from `.env.example`):
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
4. Restart the dev server, then visit `/studio`.
5. Sign in with the Sanity account you created in step 1.
6. Click **Site Settings** to fill in brand color, logo, hero copy, etc.

That's it. Once Sanity is configured, content from the studio takes priority
over the fallback files. If you ever leave a field empty in the studio, the
site falls back to `site.config.ts` / `data.ts`.

### What can be edited in the studio

- **Site Settings** — brand color, logo (image or monogram), hero copy +
  background image/video, hero stats, about section, contact info, socials.
- **Documentary Projects** — title, slug, cover image, video URL,
  awards, credits, gallery, tags. (Each project gets a public page at
  `/work/<slug>`.)
- **Services** — title + description for each offering.
- **Testimonials** — quotes, names, roles, optional linked project.

### Deploying the studio

The studio is bundled with the site at `/studio`. No separate hosting needed.

---

## Email notifications (optional)

To receive an email every time someone submits the contact form:

1. Get a free API key at <https://resend.com>
2. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxx
   CONTACT_NOTIFICATION_EMAIL=you@example.com
   ```

Without these, the form still works — submissions just save to the database
(see `/api/contact` GET endpoint, gated by `CONTACT_ADMIN_TOKEN`).

---

## Analytics (optional)

Set `NEXT_PUBLIC_ENABLE_ANALYTICS=true` to enable a privacy-friendly pageview
ping. Replace the `/api/analytics` endpoint with your provider of choice.

---

## SEO

- The sitemap is auto-generated at `/sitemap.xml`
- `/robots.txt` is auto-generated
- Each `/work/<slug>` page has its own Open Graph + Twitter card metadata
- Set `NEXT_PUBLIC_SITE_URL` in `.env.local` so canonical URLs and
  Open Graph images use your real domain.
