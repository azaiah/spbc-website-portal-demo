# The Saint Paul’s Baptist Church: website + Saint Paul’s Everywhere

A full rebuild of myspbc.org (with myspbc.events folded in) plus **Saint Paul’s Everywhere**, the member portal and staff hub, built on ChurchConnect by DataIsData. Two campuses (Creighton 9 AM, Belt 11:30 AM) and online, eight life stages, outreach, events, giving and the City of Possibility, in one site.

Stack: Vite 5, React 18, TypeScript (strict), Tailwind 3, framer-motion, lucide-react, react-router 6. Fonts are self-hosted (Bricolage Grotesque, Atkinson Hyperlegible Next, Instrument Serif, IBM Plex Mono). There are no third-party scripts on the public site.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks, then builds to dist/ (per-page HTML, sitemap, robots, _redirects)
npm test           # content checks: life-stage ages, event flyers, preview cards, calendar export, links
```

`predev`/`prebuild` run `scripts/fetch-church-photos.mjs`, which is a no-op when the church's photos are already in `public/images/church/` (they are committed).

## What’s where

| Area | Routes | Source |
|---|---|---|
| Home | `/` (hero, campus bar, this week, life-stage finder, “One Light to a City” scroll film, events, watch, give) | `src/web/home/` |
| Visit | `/visit`, `/visit/creighton`, `/visit/belt`, `/visit/online` | `src/web/pages/Visit.tsx` |
| Our Story | `/our-story` | `OurStory.tsx` |
| Life Stages | `/life-stages`, `/life-stages/:id` (8 stages) | `LifeStages.tsx`, `LifeStageFinder.tsx` |
| Community | `/community`, `/community/get-help`, `/city-of-possibility` | `Community.tsx` |
| Events (old myspbc.events) | `/events`, `/events/:slug` (.ics + share) | `Events.tsx`, `src/data/events.ts` |
| Grow / Serve / Next steps / App | `/grow`, `/serve`, `/next-steps`, `/app` | `Grow.tsx` |
| Watch, Give, Prayer, Contact, Legal | `/watch`, `/give`, `/prayer`, `/contact`, `/privacy`, `/terms` | `src/web/pages/` |
| Member portal | `/portal/*` | `src/portal/` |
| Staff hub | `/admin/*` (dashboard, action center, members, finance, office, life stages, AI agents, events, facilities, people, outreach, Grant Advisor, community, comms, partnerships, reports) | `src/admin/` |

Church facts live in one place: `src/config/site.ts` (campuses, times, phone numbers, weekly rhythm, life stages and pastors) and `src/config/links.ts` (every outside link found on the old sites). Edit there, not in pages. `docs/05-link-map.md` (client folder) maps every old link to its new home; legacy paths 301 via `dist/_redirects`.

## Hand-offs (not rebuilt)

- **Giving → Pushpay.** Every Give button goes to the church’s existing Pushpay page (`?src=churchconnect` so the finance team can see website gifts). Card details never touch this site.
- **Member login / registrations → Rock RMS.** “Member login” and event registrations link to the church’s Rock pages. The portal in this build shows what a unified member experience looks like; it uses demo data.
- **Watch → MySPBC.tv / YouTube / Facebook / Subsplash app.**

## The demo hub (what’s simulated)

- **Sign in** (header button, every page) opens `/login`: 1) choose **Member portal** or **Church staff**, 2) tap any sign-in button (Google, Microsoft, Apple, email: all pretend, no password), 3) a pretend “Choose an account” screen to pick whose view to see. Each screen says in large type that any button works.
- Member perspectives: Angela Brooks (Fusion, 40s), Marcus Hill (ASPIRE parent, Belt), Dorothy Green (Refiners, 70s). Staff perspectives: Senior Pastor, the 8 Life Stage Pastors, and sample office, finance, outreach and support accounts.
- **Guided tours**: the first time someone opens the member portal or the staff hub, a 9-step tour points at each part of the screen in plain language (big text, Back/Next, Skip). The **Tour** button at the top replays it. Tours are in `src/components/Tour.tsx`; steps live in `PortalApp.tsx` and `admin/layout/Shell.tsx` and target elements by `data-tour="…"`.
- Every Register button on the website lands in the portal’s My events (`/portal/events?register=<slug>`), already signed in. The portal has a labeled tab bar on phones.
- Accounts: Senior Pastor (Rev. Dr. Lance D. Watson, Sr.) and the eight Life Stage Pastors use their public names and titles only, with no invented personal records. Executive Office, Finance, Office & Communications, Outreach, a member (“Angela”) and Support are **sample accounts**, marked as such.
- Every number in the hub (gifts, attendance, pantry counts, showers, requests) is **sample data** stored in the browser (`localStorage`, key `spbc-everywhere-demo-v2`). “Reset” in the top bar restores it.
- AI agents and the Grant Advisor show their reasoning and drafts with sample data; nothing is sent anywhere. Funding opportunities in `src/data/funding.ts` were researched October 21, 2026 and must be re-checked before anyone applies.
- Forms on the public site (contact, prayer, get help, plan a visit, volunteer, guides) are **real Netlify Forms**; they work once deployed.

## Media

- **Real church media**: photos and flyers in `public/images/church/` (from myspbc.org and myspbc.events, used with the church’s permission as its own site). Logos are the church’s SVGs recolored.
- **Generated (Kie.ai, Nano Banana Pro)**: `public/images/art/spbc-s1-lamp`, `-s2-street`, `-s4-branches`, `-s5-dawn` (2000 px + 800 px WebP). Atmosphere only: no people, faces, text or logos. Prompts are in `MEDIA-PLAN.md`; the run log is `assets/generations.jsonl` (not committed).
- **Scroll film** (`src/web/home/LightFilm.tsx`): canvas particles over the Kie stills and the church’s own worship photo. Reduced-motion users and short windows get `StaticLightFilm`.
- **Link previews**: `public/og/*.png` (1200×630, one per page group and one per event) and the icons are rendered by `npm run og` (`scripts/make-og.mjs`, needs `playwright-core` and a local Chrome; set `CHROME=` if it isn’t found). Re-run after adding an event.

## Deploy (Netlify)

1. Put the real address in **`site.config.json`** (currently `https://spbc-connect.netlify.app`). Canonical tags, preview cards, sitemap, robots and structured data build from it.
2. Push to GitHub, connect the repo in Netlify. Build command `npm run build`, publish `dist` (already in `netlify.toml`).
3. In Netlify → Forms, turn on notifications for `spbc-contact`, `spbc-prayer`, `spbc-help`, `spbc-visit`, `spbc-volunteer`, `spbc-guides` (route help requests to Outreach@myspbc.org).
4. After the domain moves, test a few old links (e.g. `/about`, `/ministries`, `/get-help`) to confirm the 301s.

## Before launch (confirm with the church)

Search the code for `TODO: confirm with church`. The main ones:

- Public address / domain (`site.config.json`) and a general office inbox (`site.ts`).
- Office hours; typical service length; parking, accessible entrances and hearing assistance per campus (`Visit.tsx`).
- Life Stage Pastor ↔ stage pairings and Bible study times (`site.ts`).
- Links the old site promised but never provided (`links.ts`, `todo: true`): MyFitAssessment, DNA class schedule, Sqwire, job openings, store, flowers, group semester listing.
- Pushpay fund list, text-to-give number, mailing address for checks (`Give.tsx`, `seed.ts`).
- History details (Creighton opening year, first location), Destiny schools/Charisma current status (`OurStory.tsx`).
- A portrait of Dr. & First Lady Watson (home and Our Story currently use facts only, no photo).
- City of Possibility: current rezoning status, project site, and approved renderings to publish (`Community.tsx`).
- Fall BRIDGE study end date; Christmas production tickets (`events.ts`).
- Counsel review of `/privacy` and `/terms`.
- Turn on real sign-in (Microsoft 365 / Rock) and connect Pushpay + Rock data before the hub is used with real records.

Built by DataIsData (ChurchConnect).
