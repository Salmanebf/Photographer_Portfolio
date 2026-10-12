# Testing guide — what changed, how to test it, what is NOT verified

This file is **for you (the client)**. Updates were built and tested by the developer, but you test them yourself
later — so every update below says (1) what changed, (2) what was already verified and how, (3) exact steps for you,
and (4) what could **not** be tested. It is updated with every phase / update (newest first).

Last updated: 2026-10-12 · Branch: `claude/great-faraday-0gulud`

**Legend:** ✅ verified by the developer (evidence given) · 🧪 you test (steps given) · ⚠️ **not tested — focus here**

---

## 0. Start here

### 0.1 Five-minute check of the whole project (your computer)

Needs Node 22 and Git. No accounts needed.

```bash
git clone https://github.com/Salmanebf/Photographer_Portfolio && cd Photographer_Portfolio
git checkout claude/great-faraday-0gulud
npm ci
npm run lint && npm run typecheck && npm test      # expect: all pass (135 tests; 4 are skipped without TEST_DATABASE_URL)
npm run dev                                         # open http://localhost:3000
```

Then on the page (it opens in English or French depending on your browser): scroll through every section, switch
language with **EN | FR** in the header, open a film, submit the contact form (valid message → success; 3-letter
message → an error message). Nothing should crash or show a blank page.

### 0.2 ⚠️ Not yet tested — focus here (all phases)

Everything the developer could **not** check. Tick them off as you verify; tell the developer what fails.

| Pri | Item | Why it wasn't tested | Where to test |
| --- | ---- | -------------------- | ------------- |
| 🔴 | **Real Neon database** (TLS with `verify-full`, pooled URL, cold-start latency) — and following `SERVICES-SETUP.md` section 1 | No Neon account in the dev environment; tested against a real local Postgres 16 instead | U4 · step 2, U8 · step 1 |
| 🔴 | **The account setup guide itself** (every dashboard step for Neon, Sanity, Bunny, Vercel; labels may differ) | Written from provider docs; no accounts exist here | U8 |
| 🔴 | **Real Sanity project**: sign in at `/studio`; the Studio's look (theme, logo, sidebar, tabs, per-language boxes, validation, Photo Series editor); content appears on the site in each language; CORS | No Sanity project exists. The CMS code path was tested against a **fake** Sanity API; the schema validates; the Studio only boots far enough to load its config | U5, U6 · step 8, U7 · steps 2–6 |
| 🔴 | **Draft preview with a real token** (Viewer token, unpublished edits visible only to the editor, `noindex`) on a deployed site | Needs your Sanity project and a deployment; tested against the fake API only | U7 · step 7 |
| 🟠 | **Publish → visible delay** (should be ≤ 60 s) and deleting content → 404 | Needs real Sanity + a deployment | U7 · step 8 |
| 🟠 | **Look** of the new states: 5+ "how I work" steps, an awards band with 1–2 items, an empty band | Checked by class names/structure, not by eye | U7 |
| 🔴 | **Real Bunny Stream**: URL shapes, MP4 fallback file names, playback, hotlink-protection setting | No Bunny account; tested with a fake local CDN that mimics the documented URLs | U2 · step 5 |
| 🔴 | **Deploy on Vercel** (build, env vars, ISR, `pg` on serverless, preview URL) | Nothing is deployed; needs your account | U3 · step 4 |
| 🟠 | **French translation quality** (draft) + a visual read of every French section for cramped text | Machine-assisted draft; only the French hero was reviewed by eye | U6 · step 3 |
| 🟠 | Safari / iPhone / Firefox: native HLS, autoplay, low-power mode, **language switcher & cookie, `overflow-x: clip`** | Only headless Chromium available | U2 · step 7, U6 |
| 🟠 | Real phone: scroll smoothness with many videos, battery, Data Saver mode | No device | U2 · step 6–7 |
| 🟠 | Email notification (Resend) | No API key | U4 · step 7 |
| 🟠 | Admin endpoint `GET /api/contact` on the deployed site | Only tested locally | U4 · step 1 |
| 🟡 | **Real Arabic** (font, text, a few unmirrored animations) | Not started — only the mirrored layout was checked with English text | U6 · step 9 |
| 🟡 | Docker image build (`Dockerfile`) | No Docker daemon in the dev environment (the same steps were run without Docker) | U3 · step 3 |
| 🟡 | Netlify deploy (host switch) | No Netlify account | U3 · step 5 |
| 🟡 | Visual regression after the Phase 1 restructure (looks identical?) | No screenshot comparison done; pages render and respond correctly | U1 |
| 🟡 | Keyboard & screen-reader use of the video play button | Not run | U2 |
| 🟡 | Windows/macOS local dev (in-process Postgres) | Tested on Linux only | U4 · step 1 |

### 0.3 Accounts you'll need for the 🔴 items

Neon (database) · Sanity (CMS) · Bunny (video) · Vercel (hosting). All have free tiers/trials; the step-by-step guide to create them and
plug them in is [`SERVICES-SETUP.md`](./SERVICES-SETUP.md) (more detail in [`DEPLOYMENT.md`](./DEPLOYMENT.md) and [`PERFORMANCE.md`](./PERFORMANCE.md)).

---

## U8 · 2026-10-12 — Account setup guide (Neon, Sanity, Bunny, Vercel) + two database fixes found while writing it

**What changed**
- **New guide `docs/SERVICES-SETUP.md`**: how to create the Neon, Sanity, Bunny Stream and Vercel accounts and plug them in — which value goes in which variable, a 10-minute "is everything connected?" check, and a problems table per service. Linked from the README, `DEPLOYMENT.md` and this file.
- **Neon URL pasted as-is now works cleanly.** Neon hands out URLs ending `?sslmode=require&channel_binding=require`. The database driver already treated that as the strict mode but printed a loud "SECURITY WARNING" on every start and will change its meaning in its next major version. The app now spells out the strict mode itself (`verify-full`), so you paste the string unchanged, the logs stay clean and the security level can never silently drop.
- **The server now says which database it uses** at startup: `[db] using PostgreSQL at <host>` (host only — never the password) or, in development without `DATABASE_URL`, a clear line saying messages go to a throw-away built-in database. Before, a misspelled variable made the form "work" while nothing reached Neon, with no clue why.

**✅ Verified by the developer**
| Check | Result |
| ----- | ------ |
| Lint, typecheck; tests **139 pass** with a real Postgres (135 without; 4 need a database) — new: URL normalisation (Neon-style URL, other positions, `prefer`/`verify-ca`, URLs left alone, a password containing the word `sslmode=require`), host extraction (no credentials), the log lines | pass |
| Driver warning: the raw Neon-style URL produces the "SECURITY WARNING"; the normalised URL produces none and TLS stays on | confirmed in a fresh process |
| Real dev server **without** `DATABASE_URL`: form works, log says it uses the built-in development database | pass |
| Real dev server **with** `DATABASE_URL` to a real Postgres (password containing `&`): log says `using PostgreSQL at 127.0.0.1`, the password appears nowhere in the log, the message is in that database, no built-in database was created | pass |
| Neon-shaped URLs (`-pooler` host, `channel_binding=require`) are parsed correctly by the driver | pass |

**🧪 You test — by following the guide itself**
1. Open `docs/SERVICES-SETUP.md` and do **section 1 (Neon)** end to end. Expected: the terminal prints `[db] using PostgreSQL at ep-…neon.tech`, no red "SECURITY WARNING" text, and your test message appears in Neon's SQL Editor.
2. On purpose misspell the variable (e.g. `DATABSE_URL`), restart, send a message: the terminal must print the "built-in development database" line, and nothing appears in Neon (that is the trap the line exposes). Fix the spelling.
3. Do **sections 2, 3 and 5** (Sanity, Bunny, the combined check). Note any step where a button or label differs from the guide and tell the developer — the guide should be corrected.
4. Section 4 (Vercel) with the deploy: see `DEPLOYMENT.md` and TESTING U3.

**⚠️ Not tested by the developer**
- **Every dashboard step in the guide** — it was written from each provider's current documentation; no accounts exist here, so none of the clicking was walked through. Button names may differ.
- **A real Neon database over TLS** (certificate check with `verify-full`, the pooled host, cold start after sleep) — only the URL handling was tested, against a local Postgres without TLS.
- **Real Sanity / Bunny / Vercel behaviour** described in the guide (CORS, public dataset, MP4 fallback only for later uploads, hotlink protection, `403`/`404` meanings). These come from provider documentation and the code's behaviour, not from running them.
- Free-plan limits and prices (not verified; the guide says to check the pricing pages).

---

## U7 · 2026-10-11 — Phase 4: content model & CMS (data layer split, new content types, draft preview, branded Studio)

**What changed**
- **Data layer split per feature.** Films, services, testimonials, photography and site settings each own their types, placeholder content (EN + FR), CMS query and normaliser. All CMS access goes through one function (`cmsFetch`). The site looks and behaves the same.
- **New: Photo Series** (Studio type + data layer). The public gallery page is a later phase, so nothing about it shows on the site yet.
- **Now editable in the Studio** (they were fixed in code): the **awards band** (empty list hides it), the **"How I work" steps** (any number; the grid adapts, an empty list hides the section), **SEO keywords** and the **social sharing image** (defaults to the hero image).
- **Draft preview:** a secret link shows unpublished edits and unpublished films on the real site, with a "Preview mode" bar and an exit link. Needs two optional environment variables (`SANITY_API_READ_TOKEN`, `SANITY_PREVIEW_SECRET`).
- **Branded, organised Studio:** brand colour theme, monogram logo, a clearer sidebar (Settings · Films, Photo Series · Services, Testimonials) with icons, Site Settings tabs (*Hero, About, Awards & Press, How I Work, Contact, Footer, Search & Sharing*).
- **A film now exists only if it is in the list.** Previously a deleted/unpublished film could still be reached through its placeholder version.
- **New test tool:** `npm run cms:mock` — a fake Sanity API with test documents, so the CMS code path can be tried (and was tested) without a Sanity account.

**✅ Verified by the developer**
| Check | Result |
| ----- | ------ |
| Lint, typecheck, Sanity schema validation (0 errors, 0 warnings) | pass |
| **GitHub CI** (run #5, commit `0099702`): install, lint, typecheck, all tests incl. the CMS-path tests with a real Postgres service, and the production build | all green |
| Tests: **130 pass** with a real Postgres (126 without; 4 need a database). New: per-feature tests (films, services, testimonials, photography), site-settings normaliser (awards, steps, SEO, sharing image), **12 CMS-path tests that run the real Sanity client + the real GROQ queries against the fake API** (languages + English fallback, references followed, draft vs published, token only in preview, wrong/missing token, server errors, empty CMS), preview-link safety (open-redirect cases), real component renders (steps adapt/hide, awards band hides) | pass |
| Production build: `/en`, `/fr` and film pages are still **statically generated** (reading preview mode did not make them dynamic); the two preview routes are on-demand | pass |
| **Browser, built against the fake Sanity API** (EN and FR): page title, hero text, films / services / testimonial all from the CMS (no placeholders), exactly the 3 CMS "how I work" steps in a 3-column grid, CMS awards band, **brand colour from the CMS**, SEO keywords + description, social image = the CMS sharing image, indexable, no JS errors | pass |
| CMS film pages exist in both languages (title, description, credit role, category, images from referenced assets); the **placeholder films and a never-published film return 404**; the sitemap lists exactly the CMS films in both languages | pass |
| Public traffic (and the build) **never sent the read token and never asked for drafts** | pass |
| Preview link: no/wrong secret → 401; right secret → redirect + cookie; `//evil.com` is neutralised to `/`; disabled (404) when no secret is set; clear error (500) when the token is missing | pass |
| Preview mode (EN and FR): shows the unpublished edit **and** the unpublished film (it gets its own page), "Preview mode" bar, page is `noindex`, response is `private, no-store`; the CMS was asked for drafts **only with the token** (14/14 authorised); **Exit preview** restores published content and clears the cookie | pass |
| A normal visitor never sees drafts or the bar; normal pages stay cacheable (`s-maxage=60`) | pass |
| **No-CMS placeholder mode** still works: awards band and 4 steps from the placeholders (EN/FR), preview routes disabled, no banner/noindex | pass |
| **The whole Phase 3 browser suite re-run** (languages, redirect, switcher, forms against the real database, 404s, sitemap, mobile): | all pass |
| Studio in a real browser with the new theme/logo/structure config: the app boots and gets as far as calling the Sanity API (no configuration, theme or schema errors) — it then shows its own "unable to recover" screen because there is no real project/network here | pass (boots) |
| `npm run cms:mock` starts and prints the command to run the site against it | pass |

**🧪 You test**
1. **Try the CMS without any account (10 min).** Terminal 1: `npm run cms:mock`. Terminal 2 (the exact command is printed by the first one):
   `NEXT_PUBLIC_SANITY_PROJECT_ID=mock SANITY_API_HOST=http://127.0.0.1:3333 SANITY_API_READ_TOKEN=mock-read-token SANITY_PREVIEW_SECRET=letmein npm run dev`.
   Open `/en` and `/fr`: everything from the CMS is labelled "(CMS)" or "Mock …" (3 steps, 3 awards, teal brand colour, "Mock Film One/Two"; Film Two has no French so it stays English). `/en/work/the-last-craftsman` is a 404 (placeholders are not used when a CMS has content).
   Then open `http://localhost:3000/api/draft?secret=letmein&path=/en` → you see **DRAFT TITLE of Film One** and **UNPUBLISHED Mock Film** and the "Preview mode" bar; click **Exit preview** → they disappear.
2. **Real Sanity (needs your project — see U5):** open `/studio`. Check the sidebar order and icons, the gold theme, the **AR / ALEX RIVERA** logo, the tab title "Alex Rivera — Studio", and that **Site Settings** has the tabs *Hero · About · Awards & Press · How I Work · Contact · Footer · Search & Sharing*.
3. **Awards & Press:** add two lines (English + French), publish, reload `/en` within a minute → the band shows them. Remove all lines, publish → the band disappears.
4. **How I Work:** with 3 steps the section shows 3 columns; with 4, four; delete all steps → the placeholder steps return (so the section is never broken).
5. **Search & Sharing:** set keywords and a sharing image, publish; *View source* on `/en`: `meta name="keywords"` and `og:image` show them. Clear the sharing image → `og:image` becomes the hero image.
6. **Photo Series:** create one with two photos; leave one **description** empty → the Studio shows a warning. Publish. (No page on the site yet — expected.) In the Studio's **Vision** tool run `*[_type=="photoSeries"]{title, "photos": photos[].image.asset->url}` → your photos come back.
7. **Draft preview with real Sanity:** in sanity.io → API → Tokens create a token with **Viewer** rights; set `SANITY_API_READ_TOKEN` and a long random `SANITY_PREVIEW_SECRET` on your host and redeploy. Edit a film title *without publishing*; open `https://your-site/api/draft?secret=…&path=/en`: you see the edit, others do not. *View source* in preview shows `noindex`; the normal page does not.
8. **Deleting content:** unpublish/delete a film in the Studio; within ~60 s its page returns 404 and it leaves `/sitemap.xml`.
9. **Automated:** `npm test` → 126 passed, 4 skipped; with `TEST_DATABASE_URL=…` → 130 passed.

**⚠️ Not tested by the developer**
- **Everything on real Sanity**: how the Studio looks and behaves (sidebar, brand theme readability, logo, per-language boxes, validation warnings, the Photo Series editor), real query results and the CDN, token permissions, how long a publish takes to appear (expected ≤ 60 s), and the real draft semantics (the fake API imitates only "drafts laid over published" and the token check).
- **Preview on a deployed host** (cookie `Secure`/`SameSite=None`, behind a CDN), and Sanity's Presentation / visual-editing tool (not integrated).
- **Visual look** of the new states: only checked structurally (3-column class, items present). 5+ steps wrap into rows whose divider lines may look off; a band with only 1–2 awards may look sparse. Please look at both.
- **The Studio's own screens** — it could only be started far enough to prove its configuration loads.
- **Photo gallery page**: does not exist yet (model + Studio type only).
- Instant refresh via a Sanity webhook: not built (pages refresh within 60 s).

---

## U6 · 2026-10-11 — Phase 3: languages (English / French, Arabic-ready)

**What changed**
- The site exists in **English (`/en`) and French (`/fr`)**, with a language switcher (EN | FR) in the header and in the mobile menu. `/` redirects to your language: saved choice → browser language → English. No middleware, so it behaves the same on every host.
- All interface text moved to `src/messages/en.json` and `fr.json`; the placeholder films, services, testimonials, site copy and SEO text are translated (French overrides in `src/lib/content/fr.ts`). **The French is a draft — it needs a native review.**
- **Sanity:** every translatable field now has one box per language (English default, Français); empty French → English shown. Film category is a fixed list (translated automatically). Search-engine title/description are now editable per language.
- **SEO:** each page has a canonical URL and `hreflang` links (en, fr, x-default); the sitemap lists every page in both languages.
- **Contact:** error messages appear in the visitor's language; each message is saved with the language it was written in (`locale` column, added automatically to an existing table) and the notification email says "reply in this language".
- **Arabic prepared** (not enabled): right-to-left direction, mirrored layout, logical CSS everywhere, CMS boxes/hreflang/sitemap follow automatically once `ar` is added.
- **Bug fixes found while testing:** the header overflowed the screen at tablet widths (it already did before, worse with the switcher) → full nav now from 1024 px, "Collaborate" button from 1280 px, hamburger below; a stray 10 px horizontal scrollbar (the contact column waiting off-screen to slide in) → fixed with `overflow-x: clip`.

**✅ Verified by the developer** (production build, real Postgres 16, headless Chromium)
| Check | Result |
| ----- | ------ |
| Lint, typecheck, Sanity schema validation (0 errors) | pass |
| **GitHub CI** (run #3, commit `ba99f76`): install, lint, typecheck, tests with a real Postgres service, and the production build | all green |
| Tests: **95 pass** with a real Postgres (91 without; 4 need a database) — new: language negotiation, hreflang/sitemap, merge/localize helpers, **English/French message files have identical keys and placeholders**, **every film/service/testimonial has a French translation with unchanged names**, CMS normalisers (language + English fallback + old plain-string content), contact error codes, `locale` column incl. **upgrading an old table under 10 simultaneous requests** | pass |
| Production build: `/en`, `/fr` and 12 film pages (6 films × 2 languages) pre-rendered | pass |
| `/` redirect: no header → /en; `fr-FR` → /fr; German only → /en; cookie beats browser; invalid cookie ignored | 6/6 |
| Status codes: /en /fr film pages 200; unknown film, `/xx`, `/fr/inconnu`, un-prefixed `/work/…` → 404; `/studio`, sitemap, robots 200 | pass |
| Browser, each language: `<html lang dir>`, page title, hero text, section headings, nav labels, skip link, canonical, hreflang ×3, `og:locale`, meta description, no JS errors | pass (EN and FR) |
| Film page: translated title, "3 Awards / 3 récompenses" (plural), Synopsis/Générique, category, credits; hreflang points at *this* film in both languages; "All films" link stays in the language | pass |
| Switcher: film page EN→FR keeps the same film, content turns French, cookie saved, next visit to `/` honours it, FR→EN, current language marked, `#contact` anchor kept | pass |
| Film filter works in both languages (tabs translated, "Environmental/Environnement" shows 2 films) | pass |
| Contact form in FR and EN: server error shown in the right language, success message in the right language; messages stored with `locale` fr / en | pass |
| API error codes (`name_required`, `email_invalid`, `message_too_short`, …), 429 with `Retry-After`, admin list shows the language | pass |
| 404 pages: `/fr/inconnu` and `/fr/work/nope` → French; `/en/…` → English; `/xx` → bilingual page | pass |
| Mobile (390 px): FR menu items translated, switcher inside the menu, switching works | pass |
| **No horizontal overflow** at 1440, 1024, 768, 390 px in both languages (before the fix: 10 px at 1024/1280, header 26 px too wide at 768) | pass |
| Sitemap: 14 URLs (7 pages × 2 languages), all language-prefixed, hreflang alternates present | pass |
| `/` redirect response is `Cache-Control: no-store` (a CDN cannot serve one visitor's language to another) | pass |
| Dev mode (no database configured): no hydration errors, redirect works, form saves to the built-in database with `locale` | pass |
| Film preview panel still sticks while scrolling — identical with and without the `overflow-x: clip` rule | pass |
| Screenshots reviewed: French hero at 1440 px and 390 px | looks right |
| **Arabic readiness** (temporary fake `ar` language, English text, since removed): `<html lang="ar" dir="rtl">`, header mirrored (logo right, switcher left), no overflow, back-arrow flipped, `ar` appears in hreflang and sitemap by itself, mobile menu opens | pass |
| Console warnings in dev (framer-motion "container must be positioned") | exist identically on the previous commit — not caused by this work |

**🧪 You test**
1. **Language redirect.** In Chrome → Settings → Languages, put *Français* first, then open the site root (`/`): you land on `/fr`. Put *English* first → `/en`. Put an unsupported language (e.g. German) first → `/en`.
2. **Remembered choice.** Click **EN** in the header while on `/fr`, close the tab, open `/` again → `/en` (your choice beats the browser language).
3. **Read the French site end to end** (`/fr`): nav, hero, about, awards ticker, films (filters + hover preview), services + the 4 steps, testimonials, contact form + info, footer, a film page, the 404 page (`/fr/nimporte-quoi`). Look for (a) any English left over, (b) wording that sounds wrong — **the French is a draft translation**, (c) text that looks cramped, cut off or overlapping (French is ~15 % longer).
4. **Switcher.** Open a film page, switch language → the *same* film in the other language. Go to `/en#contact`, switch → `/fr#contact` (still scrolls to the contact section).
5. **Contact form in French.** Submit with a 5-letter message → French error "Le message doit contenir au moins 10 caractères". Submit properly → "Message envoyé". In your database run `select name, subject, locale from contact_messages order by created_at desc limit 5;` → `locale = fr`. (If Resend is set up, the email contains "Language: fr (reply in this language)".)
6. **SEO tags.** On `/fr` use *View page source* and search for `hreflang`: three `link rel="alternate"` lines (en, fr, x-default) and `rel="canonical"` pointing at your domain's `/fr`. Open `/sitemap.xml`: every page appears under `/en` and `/fr` with alternates. (Set `NEXT_PUBLIC_SITE_URL` to your real domain *before* building, otherwise these show the placeholder domain.)
7. **Screen sizes.** Resize the browser to ≈1280, 1024, 768 and 390 px wide on both `/en` and `/fr`: no horizontal scrollbar at any point (also at the very top of the page), the header never overflows, the hamburger menu appears below 1024 px.
8. **Sanity (needs your project — see U5).** Open a film in `/studio`: each text field shows *English (default)* and *Français*. Fill only English → the French page shows the English text. Add French → it appears on `/fr`. The slug comes from the English title. Category is a dropdown.
9. **Arabic layout preview (optional, 5 minutes).** In `src/i18n/config.ts` add `'ar'` to `locales`, `ar: 'العربية'` to `localeNames` and `ar: 'ar_AR'` to `ogLocales`; create `src/messages/ar.json` containing `{}`; run `npm run dev` and open `/ar`. The layout is mirrored and English text is used where Arabic doesn't exist. **Undo these edits afterwards** (Arabic text, a font and a review come later).
10. **Automated.** `npm test` → all pass (see §0.1 for the current numbers; Phase 3 had 91 passed + 4 skipped, 95 with a database).

**⚠️ Not tested by the developer**
- **The quality of the French** (draft translation of placeholder text; also the gender-neutral wording "cinéaste documentariste" should be agreed with the filmmaker).
- **Real Sanity** with the new per-language fields (no project available) — U5.
- **Real Arabic**: only the mirrored layout with English text was checked — no Arabic font/shaping, and a few small directional animations (film-row hover nudge, hero letterbox bars) are not mirrored yet.
- **Safari / iPhone / Firefox**: switcher and cookie, `overflow-x: clip` (needs Safari 16+), mobile menu.
- **Every French section visually**: overflow was measured page-wide at four widths, but only the French hero was reviewed by eye — please check the rest for cramped text (step 3).
- **Deployed behaviour**: `/` redirect and cookie on a real CDN, ISR for `/fr`, search engines picking up hreflang.
- Email "Language:" line (needs Resend) · screen-reader announcement of the switcher · old URLs without a language (they return 404 — fine before launch).

---

## U5 · Sanity CMS checks (applies to every update that touched content fields)

Fields added/changed so far: film **Trailer / Video** (`bunny:<id>` or URL), film **Preview loop**, **Hero background video**, every text field per language (Phase 3), and (Phase 4) **Photo Series**, **Awards & Press**, **How I Work**, **SEO keywords**, **sharing image**. Step-by-step checks for the newest ones are in U7. You can also try the whole CMS path without a Sanity account: see U7 · step 1.

- ✅ `npx sanity schema validate` → 0 errors, 0 warnings.
- ✅ The validation pattern accepts `bunny:<guid>` and `https://…`, rejects `bunny:x`, `ftp://…`, plain text (checked directly).
- ✅ With no CMS configured the site renders from placeholder content (tests + every smoke run).

**🧪 You test (needs a Sanity project):**
1. Create a project at sanity.io; in *manage → API → CORS origins* add `http://localhost:3000` with **credentials**.
2. In `.env.local` set `NEXT_PUBLIC_SANITY_PROJECT_ID` (and dataset `production`), restart `npm run dev`, open `/studio`, sign in.
3. Create a *Documentary Project*; in **Trailer / Video** type `hello` → expect the red error "Use bunny:<video-id> or a full https:// URL"; type `bunny:<real-id>` → accepted.
4. Publish; reload `/en` and `/en/work/<slug>` → your film appears. Leave a *Site Settings* field empty → the placeholder value is used.
5. ⚠️ Not verified by the developer: all of the above (no Sanity project available).

---

## U4 · 2026-10-11 — Database is now PostgreSQL (Neon), one `DATABASE_URL`; CI runs on every push; testing guide

**What changed**
- Contact messages are stored in standard **PostgreSQL**; the provider is chosen only by `DATABASE_URL` in `.env`/host settings (Neon first; Supabase/Railway/own server work by changing that value).
- No `DATABASE_URL` in **development** → built-in in-process Postgres (no install). No `DATABASE_URL` in **production** → the form returns an error and logs why (never silently loses data).
- Table `contact_messages` is created automatically on the first message (safe if many requests arrive at once).
- CI now runs on every branch push and includes a real Postgres service. New: this file, `CLAUDE.md` testing rule.

**✅ Verified by the developer**
| Check | Result |
| ----- | ------ |
| Lint, typecheck | pass |
| Tests: 49 total = 4 store tests on in-process Postgres (ran 3× for flakiness) + 3 against a **real Postgres 16.15** + 2 `getDb` tests + the rest | all pass |
| Real Postgres: insert + list through the `pg` pool | pass |
| Real Postgres: 12 simultaneous "first requests" creating the table at once | all 12 stored, no errors |
| Real Postgres: unreachable DB → error, then recovers when reachable again | pass |
| `next dev`, no `DATABASE_URL`: form saves, admin list shows it, `.pglite/` created and git-ignored | pass |
| Production build + `next start` with `DATABASE_URL` → real Postgres: home 200, film 200, form saves, row visible with `psql`, admin 401 without token | pass |
| **Switch provider = change only `DATABASE_URL`** (pointed at a second database): new message landed only in the second DB | pass |
| Production with **no** `DATABASE_URL`: home 200, form → HTTP 500 + clear log message | pass |
| Standalone build (`BUILD_STANDALONE=1`): `pg` is packaged, server runs, form saves | pass |

**🧪 You test**
1. **Local, no database.** `cp .env.example .env.local` (leave `DATABASE_URL` empty), also set `CONTACT_ADMIN_TOKEN=test`. `npm run dev` → submit the contact form → success. Then
   `curl -H "Authorization: Bearer test" http://localhost:3000/api/contact` → JSON containing your message. Without the header → `401`.
2. **Neon.** neon.tech → create a project → *Connection details* → copy the **pooled** string (host has `-pooler`) → put it in `.env.local` as `DATABASE_URL="…"` → restart → submit the form → in Neon's **SQL Editor** run
   `select * from contact_messages order by created_at desc;` → your row is there. Note how long the first submit takes (cold start) — should be a few seconds at most.
3. **Switch test.** In Neon create a second database (or branch), put its URL in `.env.local`, restart, submit again → the new row appears only in the second one. (This proves no code change is needed to switch provider.)
4. **Production guard.** Remove `DATABASE_URL`, run `npm run build && npm start`, submit the form → error message in the page; the terminal says `DATABASE_URL is not set`; the rest of the site works.
5. **Automated, real DB.** With a *throwaway* database URL: `TEST_DATABASE_URL="postgres://…" npm test` (⚠️ it drops/recreates `contact_messages`) → 49 passed, 0 skipped.
6. **CI.** GitHub → Actions → the latest run on this branch is green (it was for run #1).
7. **Email (optional).** Set `RESEND_API_KEY` + `CONTACT_NOTIFICATION_EMAIL`, submit → email arrives (Resend's default sender only delivers to your own Resend account email).

**⚠️ Not tested by the developer:** a real Neon database (SSL, pooler, latency, connection limits) · Vercel's serverless runtime with `pg` · email sending · load/many concurrent users · Windows/macOS for the local in-process database.
**✅ CI on GitHub (verified 2026-10-11, run #1, commit `32c76f5`):** all steps green — install, lint, typecheck, tests, production build — with a real Postgres 16 service container. The database server's own log in that run shows the expected "duplicate key" errors from the simultaneous table-creation test, which the app handled (that test passed), proving the real-Postgres tests ran there and weren't skipped. Only a harmless GitHub notice appears (Node 20 actions are forced to Node 24).

---

## U3 · 2026-10-11 — Host-neutral build (Vercel ↔ Netlify ↔ Docker), docs overhaul

**What changed**
- `npm run build` = plain `next build`; `npm start` = `next start`. The standalone/Docker output is opt-in (`BUILD_STANDALONE=1`).
- `Dockerfile` + `.dockerignore`; `docs/DEPLOYMENT.md` (setup + switch-host checklist); `src/portability.test.ts` fails if Vercel/Netlify-specific code is added.
- README rewritten; new `docs/ROADMAP.md`, `CHANGELOG.md`, `CLAUDE.md`, PR template; `CONTENT.md`/`.env.example` refreshed.

**✅ Verified by the developer:** default `next build` produces no standalone folder and `next start` serves home/film/`/studio` (all 200) · `BUILD_STANDALONE=1` build + `node server.js` serves the same · portability test passes · no hosting-vendor references anywhere in code/config (searched) · stale-term sweep of all docs.

**🧪 You test**
1. `npm run build && npm start` → open http://localhost:3000 (all sections, a film page, `/studio` loads).
2. Standalone: `BUILD_STANDALONE=1 npm run build && cp -r .next/static .next/standalone/.next/ && cp -r public .next/standalone/ && DATABASE_URL="…" node .next/standalone/server.js`.
3. Docker (needs Docker): `docker build -t portfolio .` then `docker run -p 3000:3000 --env-file .env.local portfolio` → site on :3000.
4. **Vercel:** import the repo → add env vars (README table) → deploy → open the preview URL → smoke list: home, a film page, `/studio` sign-in, contact form, a video.
5. **Netlify (switch test):** follow the checklist in `docs/DEPLOYMENT.md` → same smoke list. Expect no code changes.
6. Read the README: does it describe the project accurately and make sense to a newcomer?

**⚠️ Not tested:** the Docker image build · any real Vercel or Netlify deploy · ISR (`revalidate`) behaviour on a host · Sanity CORS with a deployed URL.

---

## U2 · 2026-10-10 — Phase 2: media engine (lazy video, Bunny Stream)

**What changed:** `src/shared/media/` — silent looping clips load only when on screen, pause off-screen/hidden tab, max 3 playing at once, skipped for reduced-motion / Data Saver / 2G; click-to-play film player (adaptive HLS from Bunny, hls.js loaded only on click; YouTube/Vimeo/MP4 still work); a video is written as `bunny:<id>`; new optional **Preview loop** per film; hero background uses the same engine; `docs/PERFORMANCE.md` (budgets).

**✅ Verified by the developer** (headless Chromium + generated clips + a **local fake Bunny CDN** serving a real HLS stream over HTTPS)
| Check | Result |
| ----- | ------ |
| 14 unit tests (reference parsing, Bunny URLs, preferences, playback limiter) | pass |
| Hero clip plays on load, pauses when scrolled away, resumes at top (desktop + mobile viewport) | pass |
| Never more than 3 clips playing at once (mobile viewport reached exactly 3) | pass |
| Reduced motion → **zero** video requests | pass |
| Cards load their clip only when near the screen; hover on a film row starts its preview in ~60 ms (8/8 runs) | pass |
| Film page with a Bunny video: **nothing** requested from Bunny before clicking play | pass |
| Click play → hls.js downloaded only now → playlist + segments fetched → video **plays** (`currentTime` advances, blob/MediaSource) | pass |
| YouTube film: click creates the YouTube embed · MP4-file film: plays after click · film without video: poster only, no button | pass |
| Bunny preview loop uses the `play_720p.mp4` fallback URL on hover | pass (3 full runs + 8 isolated; **one early run failed once and could not be reproduced in 11 further runs** — likely first-request timing; tell the developer if you see a preview not starting) |
| Lighthouse mobile baseline: score 90, LCP 3.5 s (hero text hidden by its entrance animation — to be fixed in the Phase 5 hero), 371 KiB | recorded |

**🧪 You test**
1. **Local clip.** Put a short `.mp4` (H.264, ≤3 MB) at `public/videos/clip.mp4`. In `src/lib/site.config.ts` set `hero.video: '/videos/clip.mp4'`; in `src/features/films/content/en.ts` add `preview: '/videos/clip.mp4'` and `video: '/videos/clip.mp4'` to one project. `npm run dev`.
2. Chrome DevTools → **Network** → filter **Media**. Load `/`: only the hero clip is requested. Scroll: other clips start only as they approach the screen. Scroll far away: the hero stops (check it has stopped via the tab's CPU or by pausing indicators).
3. Hover a film row in the list → its preview plays in the side panel. On a narrow window (<1024 px) cards show their loop when scrolled into view.
4. Open that film's page → poster + play button → click → the video plays; before clicking there is no video request.
5. **Bunny.** Follow `docs/PERFORMANCE.md → Bunny Stream setup`; upload a video; set `NEXT_PUBLIC_BUNNY_CDN_HOST`; use `video: 'bunny:<id>'` → film page: click play → in Network see `playlist.m3u8` + segments; with DevTools throttling "Slow 4G" the quality should drop instead of stalling. ⚠️ If it 403s, check Bunny's *hotlink protection / allowed referrers* and add your domain.
6. **Reduced motion.** DevTools → ⋮ → More tools → Rendering → *Emulate CSS prefers-reduced-motion: reduce* → reload → no Media requests, posters shown.
7. **Phone.** Open the (deployed) site on an iPhone and an Android: clips autoplay silently, scrolling stays smooth with several clips, page isn't hot/laggy. iPhone *Low Power Mode* blocks autoplay — then you should see the poster, not a broken box.
8. Keyboard: Tab to the play button, press Enter → plays.

**⚠️ Not tested:** real Bunny (URL shapes written from its docs) · Safari/iOS native HLS and autoplay rules · real phones · Data Saver mode · slow-network quality switching · Vimeo · YouTube actually loading video · keyboard/screen-reader use.

---

## U1 · 2026-10-10 — Phase 1: foundation (structure, contact refactor, tests, CI)

**What changed:** code moved into `src/features/*` and `src/shared/*`; contact API split into schema / rate-limit / service / pluggable handlers (database, email); Vitest + GitHub Actions CI added; unused packages and config removed. **The site should look and behave exactly as before.**

**✅ Verified by the developer:** lint, typecheck, production build · built server: home/film pages 200, form validation error, save, admin list, 401 without token · unit tests for validation, rate limiting (per-IP and global), handler pipeline (critical vs best-effort), admin token check, data-layer fallbacks.

**🧪 You test**
1. Section by section on `/`: Hero, About, Awards ticker, Films, Services, Testimonials, Contact, Footer — compare with how you remember the site; open 2 film pages; use the nav links and the mobile menu.
2. Contact form: valid → success toast; invalid (short message) → error; 6 submissions within a minute → "Too many requests".
3. Hover effects, custom cursor, scroll progress bar still work.

**⚠️ Not tested:** pixel-level visual comparison before/after · animations in Safari/Firefox · the mobile menu on a real phone.

---

## How this file is maintained
Every update adds a new entry at the top (what changed → verified → your steps → not tested) and updates the table in §0.2.
Rule recorded in `CLAUDE.md`. If you find a failure, report the entry number (e.g. "U2 step 3") and what you saw.
