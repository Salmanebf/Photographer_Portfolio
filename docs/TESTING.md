# Testing guide — what changed, how to test it, what is NOT verified

This file is **for you (the client)**. Updates were built and tested by the developer, but you test them yourself
later — so every update below says (1) what changed, (2) what was already verified and how, (3) exact steps for you,
and (4) what could **not** be tested. It is updated with every phase / update (newest first).

Last updated: 2026-10-13 (hero round 1) · Branch: `claude/great-faraday-0gulud`

**Legend:** ✅ verified by the developer (evidence given) · 🧪 you test (steps given) · ⚠️ **not tested — focus here**

---

## 0. Start here

### 0.1 Five-minute check of the whole project (your computer)

Needs Node 22 and Git. No accounts needed.

```bash
git clone https://github.com/Salmanebf/Photographer_Portfolio && cd Photographer_Portfolio
git checkout claude/great-faraday-0gulud
npm ci
npm run lint && npm run typecheck && npm test      # expect: all pass (189 tests; 5 are skipped without TEST_DATABASE_URL)
npm run dev                                         # open http://localhost:3000
```

> Since U10, `/admin/studio` asks for the owner password first (`ADMIN_PASSWORD`); in local development with the variable unset it stays open. Older steps below that say "open `/admin/studio`" mean: sign in first.

Then on the page (it opens in English or French depending on your browser): scroll through every section, switch
language with **EN | FR** in the header, open a film, submit the contact form (valid message → success; 3-letter
message → an error message). Nothing should crash or show a blank page.

### 0.2 ⚠️ Not yet tested — focus here (all phases)

Everything the developer could **not** check. Tick them off as you verify; tell the developer what fails.

| Pri | Item | Why it wasn't tested | Where to test |
| --- | ---- | -------------------- | ------------- |
| 🔴 | **Real Neon database** (TLS with `verify-full`, pooled URL, cold-start latency) — and following `SERVICES-SETUP.md` section 1 | No Neon account in the dev environment; tested against a real local Postgres 16 instead | U4 · step 2, U8 · step 1 |
| 🔴 | **The account setup guide itself** (every dashboard step for Neon, Sanity, Bunny, Vercel; labels may differ) | Written from provider docs; no accounts exist here | U8 |
| 🔴 | **Real Sanity project**: sign in at `/admin/studio`; the Studio's look (theme, logo, sidebar, tabs, per-language boxes, validation, Photo Series editor); content appears on the site in each language; CORS | No Sanity project exists. The CMS code path was tested against a **fake** Sanity API; the schema validates; the Studio only boots far enough to load its config | U5, U6 · step 8, U7 · steps 2–6 |
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
| 🔴 | **The real Studio inside the new `/admin/studio` box** (menu above it, popups/dialogs, phone), and returning to the same document after sign-in | No Sanity project; only the box geometry was checked | U11 |
| 🔴 | **Owner area on the real HTTPS site**: sign-in with `ADMIN_PASSWORD`, `Secure` cookie, Preview URLs, locked when the variable is missing; the real Studio after sign-in | Nothing deployed; tested on a local built server | U10 |
| 🟠 | **Hero round 1 (U12)**: whether the new ring motion/flip/size is what you want; six clips at once on a real phone; Safari/iPhone/Firefox 3D flips + blur; real Bunny clips; the three Hero fields in real Sanity | Judged from screenshots/numbers in headless Chromium with local test clips | U12 |
| 🟠 | **Lighthouse LCP ≤ 2.5 s** (lab: 3.8 s; real browser 0.2 s; the lab gives ~3.5 s even on a plain page) | Cause is site-wide in the simulation; not yet investigated | U9 |
| 🟡 | Database rate limit on real serverless instances + Neon cold start; email from your own domain (`CONTACT_FROM_EMAIL`) | No Neon / Vercel / Resend accounts | U9 · steps 10–11 |

### 0.3 Accounts you'll need for the 🔴 items

Neon (database) · Sanity (CMS) · Bunny (video) · Vercel (hosting). All have free tiers/trials; the step-by-step guide to create them and
plug them in is [`SERVICES-SETUP.md`](./SERVICES-SETUP.md) (more detail in [`DEPLOYMENT.md`](./DEPLOYMENT.md) and [`PERFORMANCE.md`](./PERFORMANCE.md)).

---

## U12 · 2026-10-13 — Hero, round 1: dark background, centred ring of 6 video cards, new motion, bigger button

> **Supersedes parts of U9:** the hero no longer has a video background, the small "role · name" line, or the eight-card ring.

**What changed**
- **Background:** the default is the **dark charcoal from your `index_2.html`** (with its faint map lines). The only other option is a **picture set in Sanity** (*Site Settings → Hero → Hero Background Image*; shown dimmed). The hero video background and the eyebrow / name fields were **removed**.
- **Editable in Sanity (Hero tab, now only three fields):** **Hero Headline** (the big words), **Hero Tagline** (the small text under them), **Hero Background Image** (optional). Both texts are per language.
- **Six cards** (was eight): your first six projects. They now circle **around the middle of the big words** (before they sat higher up).
- **Video on both sides of every card:** if a project has a *Preview loop*, the card plays it muted on its front **and** its back. Only the side facing you plays. If a clip cannot load (wrong ID, no network, blocked), the project's cover picture stays — there is always a picture under the video.
- **New motion** (the old one kept the cards on separate lanes crossing each other): all six now ride one tilted ring at the same speed (so they never collide), with near cards **large and sharp in front of the words** and far cards **smaller, dimmer and slightly soft behind them**. Every few seconds each card **turns over like a coin** (staggered, never all at once), with a glint sliding across it. They spread out from a pile at the start. **Moving the mouse right speeds the ring up, left slows it** (never stops); **scrolling down** slows it, spreads it and fades the cards out.
- **Button "Add your idea":** much bigger (about 280×76 px), reacts to the mouse from ~450 px away (leans toward it, swells up to 20 %, the light follows), squeezes when pressed.
- **Menu:** the "Collaborate" button is gone (the mobile menu still has its "Start a Project" button — tell me if that should go too).

**✅ Verified by the developer**
| Check | Result |
| ----- | ------ |
| Lint, typecheck, build; tests: **189 pass** (194 with a database): new tests for the ring maths — six cards; the ring stays centred on the headline all the way round; cards stay between menu and button for any angle/pointer/time; near cards in front and far behind; far = smaller/dimmer/softer; every card shows both faces over time; never more than half the cards flipping together; pile → spread intro; fade on scroll; same input = same picture; fits a phone | pass |
| Real browser (Chromium, dev server, temporary local test clips — 3 projects with working clips, 1 with a missing file): exactly 6 cards; ring centre within ~15 px of the headline centre (horizontal and vertical); video elements on **both** faces of cards with a preview; at most one face per card plays and its time advances; over 20 s both the front and the back face played; the missing clip did **not** play and the cover picture stayed visible; no JS errors | pass |
| Button: 279×76 px; moved ~3 px toward the pointer from 380 px away, swells when the pointer is on it | pass (swell re-tuned after the check; see not-tested) |
| Production build in the browser: reduced-motion (EN + FR) → six still cards all behind the headline, no video plays; default has no background-picture element and the stage gradient matches the design colours; the Collaborate button is gone; scrolling away fades the cards and back at the top they return; the ring keeps moving with the pointer at the screen edge | pass |
| A background picture (temporary default) shows dimmed behind the words; phone 390 px, tablet 820, 1920 and a short 1366×640 screen: no sideways scroll | pass |

**🧪 You test**
1. **Look & motion (desktop):** open `/en`. Dark background, no picture. Six cards circle the headline, centred on it; watch for ~30 s: depth (front large/sharp, back small/soft), coin flips, glints. Tell me what you like/dislike (speed, size, how much they cover the words, flip frequency) — this is the round to tune.
2. **Mouse:** move the mouse to the right edge (ring speeds up), to the left edge (slows). Scroll down a little: cards spread and fade; back up: they return.
3. **Button:** move the mouse toward "ADD YOUR IDEA" from far away: it should lean toward you and swell; click → jumps to Contact.
4. **Sanity texts:** Site Settings → **Hero** tab → change **Hero Headline** (EN + FR) and **Hero Tagline**; publish → the home page shows them within a minute (4–6 short words for the headline).
5. **Sanity background picture:** upload a picture in **Hero Background Image**, publish → it appears dimmed behind everything; remove it → back to the dark default.
6. **Videos on cards (needs Bunny):** give four or more projects a *Preview loop* (`bunny:` + ID, no `< >`; silent, 5–10 s, small). The cards play the clip on the side facing you, also after a flip. Give one project a **wrong ID**: its card shows the cover picture and nothing else breaks.
7. **Phone:** open on your phone (and `/fr`): no sideways scroll, button easy to tap, cards readable, nothing overlapping the button.
8. **Reduced motion:** turn on "Reduce motion" in the system settings → cards are still and behind the headline, no video.

**⚠️ Not tested by the developer**
- **Whether this is the motion you want** — judged from screenshots and numbers, never by watching it live; I cannot see smoothness (frame rate, flicker) here. Expect to tune.
- **Real Bunny clips** (only local test clips), the 480p cap and playback of six clips at once on a **real phone** (battery, heat, Data Saver).
- **Safari / iPhone / Firefox**: 3D flips, the soft-focus blur on far cards, `backface-visibility` with video inside a flipped card, the headline font width axis.
- **The button's final feel**: the swell amount was raised from 16 % to 20 % after the browser check and not re-measured.
- Real Sanity: the three Hero fields appearing and publishing (only tested against the fake CMS); removing the old hero fields from existing Sanity data is harmless (they are simply ignored).
- Lighthouse after this change (not re-run).

---

## U11 · 2026-10-12 — Owner area: Studio moved to `/admin/studio`, `/admin` entry, "back to where you were", owner menu inside the Studio

**What changed**
- **The Studio now lives at `/admin/studio`** (was `/studio`). The old `/studio` address no longer exists (404). Sanity's internal base path was changed to match.
- **`/admin` redirects to `/admin/login`.** If you are already signed in, the sign-in page forwards you instead: to the **last owner page you were on** (including a spot inside the Studio), or to `/admin/messages` if there is none. Signing in again after signing out works the same way.
- **The owner menu** (Messages · Edit content · Sign out) is now also shown **above the Studio**; the Studio fills the screen below it.
- The last page is remembered in a small cookie containing only a path; the server re-checks it, so a forged value cannot send you anywhere else.

**✅ Verified by the developer**
| Check | Result |
| ----- | ------ |
| Lint, typecheck, build; tests: 177 pass (+5 need a database) — new: which paths count as owner pages, "go back to last page" rules, forged values ignored | pass |
| Built server: `/admin` → 307 `/admin/login`; `/admin/messages` and `/admin/studio` → sign-in when signed out; `/studio` and `/studio/x` → 404 | pass |
| Real browser: first sign-in → `/admin/messages`; menu link opens the Studio; the **menu appears above the Studio**, the Studio box starts right under it and ends at the bottom of the screen with no extra scrollbar; the last page is remembered; sign out → sign in again → back in the Studio; `/admin` and `/admin/login` while signed in forward to the last page; after visiting Messages they forward there; a forged "last page" cookie is ignored | pass |

**🧪 You test**
1. Open `/admin` (signed out) → you land on `/admin/login`. Sign in → you arrive on the inbox (first time).
2. Click **Edit content** → the Studio opens under the same menu. Use the Studio a bit (open a document), then click **Sign out** (menu), sign in again from `/admin` → you come back to the Studio (ideally the same document).
3. While signed in, type `/admin` or `/admin/login` → you are sent to the last page you used.
4. Open **Messages**, then type `/admin` → you land on Messages.
5. Type `/studio` → "not found". Update any bookmark to `/admin/studio`.
6. Sanity: if you already set CORS origins/redirects pointing at `/studio`, nothing needs to change (CORS is per site address, not path). Check the Studio loads and saves.

**⚠️ Not tested by the developer**
- **The real Studio** inside the new box: only the box position/size and the spinner were seen (no Sanity project here). Check popups, dialogs and the document panel layout in your browser, on a phone and on a small laptop.
- Returning to the **exact document** inside the Studio after a new sign-in (the cookie stores the path; whether the Studio's own routing restores the document needs the real Studio).
- Real HTTPS site behaviour (see U10).

---

## U10 · 2026-10-12 — Owner area: message inbox (`/admin/messages`) + password-protected Studio

**What changed**
- **New private page `/admin/messages`**: your contact-form messages, newest first — name, email (click to reply), subject, the message, the **language to reply in**, extra answers (future booking form), date. Buttons: **mark as read / unread**, **delete** (open, then confirm — no accidental deletes), **reply by email**. Unread messages are highlighted and counted. It follows the language you last chose on the site (English or French).
- **One password protects the owner area**: `/admin/studio` and `/admin/messages` now require sign-in with `ADMIN_PASSWORD` (a variable you set on the host; at least 12 characters). The Studio still asks for its Sanity login afterwards. Sign-in lasts 8 hours; "Sign out" is in the owner header. Wrong passwords are limited (10 tries / 10 minutes).
- **Not linked anywhere public**: no menu/footer/sitemap/robots entry. The pages are `noindex`. A test fails if a public file ever links to them.
- **Locked by default in production**: if `ADMIN_PASSWORD` is missing or shorter than 12 characters, `/admin/studio`, `/admin/login` and `/admin/messages` return "not found". In local development with no password they stay open.
- No middleware / no host feature is used (still portable to Netlify/Docker). `GET /api/contact` with `CONTACT_ADMIN_TOKEN` still exists for scripts.

**✅ Verified by the developer**
| Check | Result |
| ----- | ------ |
| Lint, typecheck, build; tests: **180 pass with a real Postgres** (175 + 5 skipped without). New: password rules, token signing/expiry/tampering/password change, safe "next" address, inbox DB actions (read/unread/delete/bad id), login attempt limit (also when the DB is down), "no public file links to the owner pages" | pass |
| Built server, **no `ADMIN_PASSWORD`** (production mode): `/admin/messages`, `/admin/login`, `/admin/studio` → 404 | pass |
| Built server **with** password, not signed in: `/admin/messages` and `/admin/studio` (and `/admin/studio/structure/…`) → redirect to sign-in; a forged cookie is rejected; login page is `noindex` and not cached | pass |
| Public pages (`/en`, `/fr`, timeline, a film page, sitemap) contain no `/admin/studio` or `/admin` text | pass |
| Real browser (Chromium), real Postgres: wrong password → error; right password → inbox; cookie is HttpOnly + SameSite=Strict; 3 messages listed, unread count, French message shows "Reply in French", extra answers shown; a message containing `<script>` is displayed as text and does not run; mark read/unread updates the count; delete needs the confirm step and removes only that message; `/admin/studio` opens (200) when signed in; after sign-out both pages are locked again; an outside `next=https://evil…` address is ignored; 11 wrong passwords → even the right one is blocked for a while; no JS errors | pass |

**🧪 You test**
1. On Vercel add `ADMIN_PASSWORD` (long, random, 12+ characters) to Production **and** Preview, redeploy.
2. Open `https://yoursite/admin/messages` → sign-in page. Wrong password → "Wrong password". Right one → your messages. Send a test message from the public contact form → reload the inbox → it appears as **New** with the right language.
3. Click **Mark as read** → the counter drops; **Mark as unread** → it comes back. **Delete** → open → confirm → the message disappears (also gone from the database).
4. Click **Edit content** (header) → the Studio opens (then Sanity's own login). **Sign out** → `/admin/messages` and `/admin/studio` ask for the password again.
5. Open the public site in English and French, view the menu/footer/page source: no link to `/admin/studio` or `/admin` anywhere. Open `https://yoursite/robots.txt` and `/sitemap.xml`: no mention either.
6. Remove `ADMIN_PASSWORD` on a **test** deployment (never your real one) → `/admin/studio` and `/admin/messages` show "not found" (that is the safe default).
7. On your phone: sign in, read a message, mark it read.

**⚠️ Not tested by the developer**
- **On a real HTTPS deployment** (the cookie is `Secure`): sign-in persistence, Vercel Preview URLs, and the 8-hour expiry (checked only with unit tests and a clock-free token check).
- **The Studio itself after sign-in** — only that the page opens (HTTP 200) and the redirect/lock behaviour; the real Studio screens still need a Sanity project (see U5/U7).
- Safari/iPhone, and the inbox with hundreds of messages (shows the latest 200 and says so).
- **Brute-force limit with many real instances** (counters are in the database; tested with one server).
- French wording of the owner pages (draft).

---

## U9 · 2026-10-12 — Phase 5 foundation (orbit hero, Timeline, renamed sections) + Phase 6 (contact rework)

> These are **foundations**: the structure, wiring and behaviour are in place with placeholder content. The look of each section
> (About, Projects, Services, Testimonials, the Timeline page…) is refined **section by section in the next round**, from your instructions.

**What changed — Phase 5 foundation**
- **New home-page first screen ("orbit hero")**, ported from your `index_2.html`: a huge stacked headline in the middle, cards of your **projects** circling it in 3D (they turn, pass in front of and behind the words, and a soft light follows the mouse on the gold button). Cards use each project's cover image; a project with a **Preview loop** plays it on its card (at most 3 clips play at once). The old hero (name, stats, scroll hint) is gone; the small gold line above the headline shows "role · name".
- **The headline paints immediately** (plain text, no entrance animation) — the fix for the slow first paint measured earlier. The cards load a moment later.
- **New CMS field "Hero Headline"** (per language). The **Hero Stats** were removed (they were fake numbers like "34+ awards"; you have none yet). Hero picture/video are now a dim background behind the headline.
- **New "Timeline" section** between Services and Reviews, with a **full page `/en/timeline` · `/fr/timeline`** (same steps, no truncation; a "Tell me your story" link). It uses the former "How I work" steps — the Studio field is now called **Timeline — Steps**.
- **Services is now only "What I offer"** (the process steps moved to the Timeline).
- **Renames:** *Films* → **Projects** (menu, footer, section), *Testimonials* → **Reviews** in the menu / **"What Clients Say"** as the section title; French equivalents (Projets, Avis, Déroulé, "Ce que disent les clients"). Menu and footer gained **Timeline**. The sitemap lists the new page.
- Reduced-motion visitors get the same hero but still (no movement), with all cards behind the headline.

**What changed — Phase 6 (contact rework)**
- **Rate limit now lives in the database** (table `contact_rate_limits`): 5 messages/min per visitor, 60/min overall, shared by every server instance and kept across restarts. Visitor addresses are stored only as a one-way hash. If the database is down the form falls back to the old per-instance limit (and logs a warning) instead of blocking visitors.
- **Spam protection without CAPTCHA** (`spam.ts`): the hidden honeypot field (silent), a form sent faster than 1.5 s after it appeared → friendly error "That was very quick — please check your message and send it again" (a real person just presses send again), and more than 3 links in a message → "no more than 3 links". Both errors are translated (EN/FR).
- **Email sender is configurable**: `CONTACT_FROM_EMAIL` (e.g. `Alex Rivera <hello@yourdomain>`); empty or malformed = Resend's shared test sender. No code change needed once your domain is verified in Resend.
- **Booking-ready**: messages now have a `kind` (`inquiry`) and a flexible `details` field (extra answers such as a date or budget) — a future booking form needs no database change. The email lists the extra answers. Today's form is unchanged.
- Old databases upgrade themselves (new columns/table are created on first use; existing messages keep working).

**✅ Verified by the developer**
| Check | Result |
| ----- | ------ |
| Lint, typecheck, production build | pass |
| Tests: **162 pass with a real Postgres 16** (157 pass + 5 skipped without one). New: spam rules, email sender/text, schema extras, DB counters (window, reset, 20 simultaneous hits counted exactly once — also on real Postgres with 15 parallel "instances" on a fresh database), shared limiter + in-memory fallback + hashed keys, kind/details storage and old-table upgrade, Timeline/Services render tests, sitemap, messages EN/FR parity | pass |
| Built server on a real Postgres: normal message saved with `locale`, `kind`, `details`; instant send → `400 too_fast`; 4 links → `400 too_many_links`; honeypot → looks successful but nothing saved; 7 messages from one visitor → first 5 saved, then `429` with the French/English text; **after restarting the server the same visitor is still blocked** (counter was in the database); only hashed visitor keys in the table | pass |
| Browser (headless Chromium), `/fr`: the real form saves a message with `locale = fr`; no JS errors | pass |
| Hero in a browser: desktop 1440×900, tablet 820, phone 390 — no horizontal scroll, headline readable, cards move, button works, "See my projects" scrolls to Projects; French headline (long words) fits on a phone; reduced-motion = static cards behind the text | pass |
| Hero video cards (temporary test clips on a local server): 6 cards had a clip, exactly 3 played at once (time advanced), the rest stayed paused on the poster | pass |
| `/en/timeline` and `/fr/timeline` build and render; home Timeline section shows every step | pass |
| First paint / LCP in a real browser (phone size): ≈ 0.2 s (headline text). Lighthouse (simulated slow 4G): score 0.87–0.88, LCP 3.8–3.9 s — the same lab gives 3.5 s on the plain Timeline page, so it is a site-wide floor, not the hero | recorded (target 2.5 s **not** met in the lab) |

**🧪 You test**
1. **Hero (desktop):** open `/en`. Headline visible at once; cards drift around it; move the mouse — cards tilt slightly and the gold button's light follows you; click it → jumps to Contact. "See my projects" → Projects.
2. **Hero (phone):** open on your phone (or Chrome DevTools → phone size). Headline fits, no sideways scrolling, cards don't cover the buttons. Try `/fr`: "DES FILMS QUI PARLENT PLUS FORT QUE LES MOTS" must fit.
3. **Hero headline from the CMS** (needs your Sanity): Site Settings → Hero → *Hero Headline*, write 4–5 words in English and French, publish → the home page shows them one word per line. Put 12 words to see how it copes (it shrinks; tell me if it looks bad).
4. **Hero video cards** (needs Bunny): give a project a *Preview loop* (`bunny:` + ID, no `< >`); its card should play, at most three at once.
5. **Reduced motion:** turn on "Reduce motion" in your system settings, reload → cards are still, all behind the headline.
6. **Timeline:** scroll to *Timeline* (menu item too); click "See the full process" → `/en/timeline` shows all steps; the French one `/fr/timeline`. In the Studio edit *Timeline — Steps* (add a 5th, delete one) → both update within a minute; delete all → placeholder steps return.
7. **Renamed sections:** menu reads Home · About · Projects · Services · Timeline · Reviews · Contact; section titles "Projects", "What I Offer", "What Clients Say". Check the footer links.
8. **Contact — too fast:** reload `/en`, open DevTools → Network → throttle nothing; paste a ready message and press send within one second of the page loading (hard to do by hand; alternatively run in the console: `fetch('/api/contact',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'A',email:'a@b.co',subject:'s',message:'ten chars or more',elapsedMs:100})}).then(r=>r.json()).then(console.log)` → `code: "too_fast"`).
9. **Contact — links:** send a message containing four `https://…` links → error "no more than 3 links"; with three links → accepted.
10. **Rate limit:** send 6 valid messages within a minute from the same browser → the 6th shows "Too many requests". Wait a minute → works again. In your database: `select key, hits from contact_rate_limits` shows hashed keys (no readable addresses).
11. **Email sender** (needs Resend + a verified domain): set `CONTACT_FROM_EMAIL="Alex Rivera <hello@yourdomain>"`, send a message → the email comes from that address and lists the *Language:* line.

**⚠️ Not tested by the developer**
- **How the hero looks to you**: spacing, the amount of image behind the headline, card sizes, motion speed — judged only from screenshots; this is the round to tell me exactly what you want.
- **Real Bunny video on the hero cards** (tested with local test clips) and a real project cover set from the CMS.
- **Safari / iPhone / Firefox** for the 3D card flip, `font-stretch` (the headline font's width axis) and the gold button.
- **The hero headline font on a slow connection** (a wide font that swaps in) and very long headlines.
- **Lighthouse LCP below 2.5 s** — not reached in the lab (see the table); to be investigated before launch.
- **Real Neon / Vercel**: the database rate limit with many real serverless instances (tested with parallel connections to one Postgres only), and the extra load of one small query per message on a sleeping Neon database.
- **Email from a custom domain** (no Resend account here); only the address parsing and message text were tested.
- Arabic / right-to-left of the new hero and Timeline (logical CSS used; not viewed in RTL).

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
- **Now editable in the Studio** (they were fixed in code): the **awards band** (empty list hides it), the **timeline steps** (called "How I work" at the time; any number, an empty list hides the section), **SEO keywords** and the **social sharing image** (defaults to the hero image).
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
| **Browser, built against the fake Sanity API** (EN and FR): page title, hero text, films / services / testimonial all from the CMS (no placeholders), exactly the 3 CMS steps in a 3-column grid (then in the Services section; since U9 in the Timeline), CMS awards band, **brand colour from the CMS**, SEO keywords + description, social image = the CMS sharing image, indexable, no JS errors | pass |
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
2. **Real Sanity (needs your project — see U5):** open `/admin/studio`. Check the sidebar order and icons, the gold theme, the **AR / ALEX RIVERA** logo, the tab title "Alex Rivera — Studio", and that **Site Settings** has the tabs *Hero · About · Awards & Press · How I Work · Contact · Footer · Search & Sharing*.
3. **Awards & Press:** add two lines (English + French), publish, reload `/en` within a minute → the band shows them. Remove all lines, publish → the band disappears.
4. **Timeline steps** (called *How I Work* when this was written; since U9 they appear in the Timeline section): add/remove steps → the section follows; delete all steps → the placeholder steps return (so the section is never broken).
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
| Status codes: /en /fr film pages 200; unknown film, `/xx`, `/fr/inconnu`, un-prefixed `/work/…` → 404; `/admin/studio`, sitemap, robots 200 | pass |
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
8. **Sanity (needs your project — see U5).** Open a film in `/admin/studio`: each text field shows *English (default)* and *Français*. Fill only English → the French page shows the English text. Add French → it appears on `/fr`. The slug comes from the English title. Category is a dropdown.
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

Fields added/changed so far: film **Trailer / Video** (`bunny:<id>` or URL), film **Preview loop**, (removed in U12: Hero background video), every text field per language (Phase 3), and (Phase 4) **Photo Series**, **Awards & Press**, **How I Work**, **SEO keywords**, **sharing image**. Step-by-step checks for the newest ones are in U7. You can also try the whole CMS path without a Sanity account: see U7 · step 1.

- ✅ `npx sanity schema validate` → 0 errors, 0 warnings.
- ✅ The validation pattern accepts `bunny:<guid>` and `https://…`, rejects `bunny:x`, `ftp://…`, plain text (checked directly).
- ✅ With no CMS configured the site renders from placeholder content (tests + every smoke run).

**🧪 You test (needs a Sanity project):**
1. Create a project at sanity.io; in *manage → API → CORS origins* add `http://localhost:3000` with **credentials**.
2. In `.env.local` set `NEXT_PUBLIC_SANITY_PROJECT_ID` (and dataset `production`), restart `npm run dev`, open `/admin/studio`, sign in.
3. Create a *Documentary Project*; in **Trailer / Video** type `hello` → expect the red error "Use bunny:VIDEO-ID (no < > brackets, no spaces) or a full https:// URL"; type `bunny:` + a real ID (no `< >`) → accepted. The **Hero Background Video** field now has the same check (try `bunny:<abc12345>` → red error). Not run in a real Studio.
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

**✅ Verified by the developer:** default `next build` produces no standalone folder and `next start` serves home/film/`/admin/studio` (all 200) · `BUILD_STANDALONE=1` build + `node server.js` serves the same · portability test passes · no hosting-vendor references anywhere in code/config (searched) · stale-term sweep of all docs.

**🧪 You test**
1. `npm run build && npm start` → open http://localhost:3000 (all sections, a film page, `/admin/studio` loads).
2. Standalone: `BUILD_STANDALONE=1 npm run build && cp -r .next/static .next/standalone/.next/ && cp -r public .next/standalone/ && DATABASE_URL="…" node .next/standalone/server.js`.
3. Docker (needs Docker): `docker build -t portfolio .` then `docker run -p 3000:3000 --env-file .env.local portfolio` → site on :3000.
4. **Vercel:** import the repo → add env vars (README table) → deploy → open the preview URL → smoke list: home, a film page, `/admin/studio` sign-in, contact form, a video.
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
| Lighthouse mobile baseline: score 90, LCP 3.5 s (hero text hidden by its entrance animation — fixed in the Phase 5 hero, see U9), 371 KiB | recorded |

**🧪 You test**
1. **Local clip.** Put a short `.mp4` (H.264, ≤3 MB) at `public/videos/clip.mp4`. In `src/features/films/content/en.ts` add `preview: '/videos/clip.mp4'` and `video: '/videos/clip.mp4'` to one project (the home hero has no video background any more; the clip plays on the hero cards). `npm run dev`.
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
