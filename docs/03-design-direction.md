# Design research → direction for NLDT

## Evidence
- 2 of 3 guests check website/social before visiting; ~half decide NOT to attend based on what they find or can't find. 47% look first for service times/location/length; nearly as many for "culture" (worship style, dress, photos of real people). 31% beliefs; 21% kids/Bible study/community. (SermonView)
- 81% of donors give digitally at least partly; 64% of churches offer website giving; recurring = 42% of digital donations and nearly half of churches don't offer it. (Givelify 2025; Ministry Brands State of Church Giving 2025)
- Best-in-class patterns (REACHRIGHT 23 best, Transformation Church Tulsa, Elevation, FBC Glenarden):
  - "I'm New / Plan a Visit" as primary CTA; service time + address directly under hero.
  - Sermon/watch path first-class (latest message on homepage, "Watch live").
  - Real photography of real people (not stock); short homepage that routes to detail pages.
  - Three-pathway tiles (Connect · Grow · Serve); date-first event cards; meet-the-pastors block.
  - Ministry finder; prominent Give in nav; local SEO (city/neighborhood repeated).
  - Accessibility: skip links, alt text, contrast, mobile-first.
  - Common misses even at big churches: giving buried, no first-timer section → we beat them.

## Audience realities for NLDT
- Multi-generational Black congregation in South Richmond; many seniors (photos) → body text ≥18px, strong contrast, big tap targets, phone number tap-to-call everywhere, simple 6-item nav.
- Community members seeking help (food pantry, counseling, re-entry, youth programs) are a second core audience — often on phones, possibly limited data → fast, light pages; "Get help" path as important as "Plan a visit".
- Partners/funders/officials (City, RPD, schools, FeedMore, RBHA) → Impact page with numbers, history, 501(c)(3) Community Center credibility = grant readiness.

## Direction: "Royal Deliverance" — regal, warm, Spirit-filled, modern
- Keep their identity (purple + gold badge, John 8:36), elevate execution.
- Palette:
  - Royal Night #1B0F2E (deepest purple-black, hero/backgrounds)
  - Royal Purple #3E2266 (primary), Amethyst #5B3A8E (hover/secondary), Lilac mist #EFE9F7 (tints)
  - Anointing Gold #C9A24B (accent), Gold Light #E3C77A, Gold Deep #9C7A2E (text-on-light gold)
  - Ivory #FAF6EE (page), Parchment #F2EBDD, Ink #1E1A24, Stone #625C6B (muted text), Line #E4DCCD
- Type: display "Cormorant Garamond"? → choose **"Playfair Display"**? Decision: Display = "Fraunces"-like elegance but distinct from ChurchConnect → use **"Cinzel" for small caps eyebrows** (classical, matches badge lettering) + **"Cormorant" for big display serif** (regal, editorial) + **"Plus Jakarta Sans" for UI/body** (very legible, friendly). Script accent sparingly: none (avoid cheesy); use italic Cormorant for warmth.
- Motifs:
  - Radiating rays from the cross (badge) → SVG ray burst behind hero/headlines, slowly rotating/expanding on scroll.
  - "Chains → freedom" story: scroll-driven chain-link line that "breaks" open as you scroll through the Deliverance story (brand-fit motion; John 8:36).
  - Stained-glass light: soft colored light leaks (purple/gold/rose) drifting over sanctuary photo.
  - Gold hairline frames, arched image masks (sanctuary window arch shape).
- Motion: framer-motion; scroll progress gold bar; parallax on hero photo; staggered reveals; counter numbers for impact; reduced-motion respected.
- Scrollbar: purple track/gold thumb.

## Information architecture (6 + Give)
- Home
- Visit (Plan your visit: Sunday 9:45, what to expect, parking, kids, accessibility, transportation ministry ride request)
- About (Story 1985→1997→2007→today, pastors & leadership, beliefs/mission, Theme 2026, street honor)
- Ministries (filterable finder: Worship & Growth, Family & Care, Outreach, Youth & Kids, Serving teams; each with leader role contact via form)
- Community (New Life Community Center 501(c)(3), food pantry schedule, after-school, counseling, Community Conversations, youth programs, partners, impact, Get Help form, Partner/Donate)
- Events (calendar + recurring weekly rhythm + Good Friday etc.)
- Watch (latest message embed via Facebook video/YouTube placeholder; Facebook Live link; past messages)
- Give (online giving demo: tithe/offering/building/community center; recurring; text-to-give; mail)
- Utility: Prayer request, Life Events (funerals, baptism, weddings, baby dedication), Contact, Member Login (portal).

## Homepage sequence
1. Hero: full-bleed sanctuary/worship photo with royal overlay + rays; eyebrow "South Richmond · Since 1997"; H1 "Who the Son sets free is free indeed."; sub: "A Spirit-filled church on Decatur Street where everyone is welcomed, healed and equipped."; CTAs: Plan your visit (primary gold) / Watch / Give; info bar: Sundays 9:45 AM · 900 Decatur St · Tue Bible Study 7 PM.
2. "This week at New Life" rhythm strip (Sun worship, Mon/Wed after-school, Tue counseling+Bible study+community conversation, Wed/Sat food pantry, Fri choir, 3rd Sat women).
3. Welcome from the pastors (portrait of two pastors; signatures).
4. Plan your first visit (what to expect 4 cards) → CTA.
5. Theme for 2026 big quote band with rays.
6. Pathways: Get connected / Get help / Grow / Serve.
7. Our story teaser with chain-breaking scroll motion + timeline 1985/1997/2007/2025.
8. Community impact numbers + photo mosaic (food, youth, teachers, first responders).
9. Upcoming events (date cards).
10. Watch latest message + FB live.
11. Give band (online giving, recurring).
12. Prayer request + contact + map.
Footer with times, address, phone, social, member login, Powered by ChurchConnect · DataIsData.
