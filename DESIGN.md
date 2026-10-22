# DESIGN.md — The Saint Paul's Baptist Church ("People on the GROW")
Design contract for every page of the SPBC build. Derived from the church's own cues (logo burst, orange/green/purple in their live CSS, the cream-and-lilac Creighton sanctuary, the sea of phone lights in their worship photo) and from three reference directions in the getdesign.md / Refero 9-section format: (1) Stripe-style confident display type over luminous gradients, used here for sunrise and light, not tech; (2) Airbnb-style warm, rounded, human cards and photography-first layouts; (3) editorial longform (Godly/Awwwards scroll stories) for the signature film only.

## 0. As built (October 21, 2026)
- **Motif**: the leaf canopy from the logo (the `Leaf` ornament in eyebrows, the mark as a large watermark in page heroes), not a sunburst. The film's tree of eight branches is the same idea.
- **Home hero**: the church's own `worship-lights` photo (Creighton sanctuary full of phone lights) with a dark gradient, not their aurora video. The aurora video is used on Watch only.
- **Header**: transparent white-on-photo over dark heroes (home, community, possibility, watch, app, life-stage pages), morning cream with ink text everywhere else and after scrolling.
- **Life-stage colors** (white text, all ≥ 4.5:1): imagiNATION #C2410C, SMB #A8344F, Dreamchasers #673391, ASPIRE #1F5F94, Fusion #006C3A, Encore #8A5A12, Prime Time #00492A, Refiners #5B3A7A.
- **Film**: canvas particles over four Kie stills + the real worship photo; see MEDIA-PLAN.md. Portrait frames and Veo clips were not needed.

## 1. Visual theme
Morning light over a growing church. Light pages (morning cream), warm sunrise accents, real people in real photographs, one cinematic dark moment (the light film) where their current black aesthetic earns its place. Confident, progressive, joyful, never cold or corporate. Every page answers within 5 seconds: which campus, what time, how do I come, how do I give.

## 2. Color roles
| Token | Hex | Role |
| --- | --- | --- |
| `morning` | #FFFBF5 | Page background |
| `parchment` | #F6EEE3 | Alternate sections, cards on morning |
| `ink` | #17131C | Body text (17.8:1 on morning) |
| `stone` | #5B5560 | Secondary text (7.0:1) |
| `line` | #E8DFD2 | Hairlines, dividers |
| `grow-orange` | #F3801F | Primary action fill (ink text on it, 6.9:1); sunrise; the one highlight per section. Never text on light |
| `ember` | #B5520A | Orange used as text/links on light (4.9:1) |
| `grow-green` | #006C3A | Links, secondary buttons (6.6:1 on white) |
| `canopy` | #00492A | Footer, deep green bands (white text 10.6:1) |
| `possibility` | #673391 | Scripture bands, life-stage accents (white text 8.5:1) |
| `lilac-mist` | #F4ECFA | Tints, life-stage chip backgrounds |
| `night` | #121212 | Light film + video sections only |
| `glow` | #FFD7A3 | Light points, glows on night (decorative) |
Rules: one orange primary per section (Von Restorff). Status colors: success = grow-green, alert = #B42318 with icon + text. Never color alone.

## 3. Typography (self-hosted @fontsource)
- Display: **Bricolage Grotesque** variable (600–800), tight tracking (-0.02em) on H1/H2; H1 clamp(2.75rem, 6vw, 5.5rem).
- Body/UI: **Atkinson Hyperlegible Next** (fallback Atkinson Hyperlegible) 20px / 1.6; small text minimum 16px.
- Scripture and pull lines: **Instrument Serif** italic, 1.25× body.
- Eyebrows: Bricolage 600, 15px+, letter-spacing 0.08em, sentence case or small caps — never the current tiny spaced all-caps.
- Their named things keep their styling: imagiNATION, SMB, Dreamchasers, ASPIRE, Fusion, Encore, Prime Time, Refiners, THE BRIDGE, GPS, 7:14 Prayer.

## 4. Components
- Buttons: pill radius (999px), min height 52px, 20px text with label always; primary = orange fill + ink text; secondary = green outline; on night = white outline.
- Campus card: campus name, time (huge), address, Directions + Call; Online card shows Live status.
- Event card (date-first): date block (month/day), title, time, campus chip, add-to-calendar, Register (→ Rock) or Details.
- Life Stage chip/card: stage name, ages, pastor, this week's study; lilac-mist background, possibility accent bar.
- Rhythm strip: day columns (Sun/Wed/Thu/Fri) with time and channel icons (in person/phone/online).
- Burst divider: SVG rays from the logo, used as section ornaments and as the sunrise in the film.
- Forms: 20px inputs, visible labels, inline validation, success state that says who will reply and when.
- Staff hub: shadcn-style primitives restyled to these tokens; "what needs me" cards top-left; one alert color.

## 5. Layout
12-column grid, max width 1280, generous 96–128px section rhythm on desktop, 64px mobile. Photography full-bleed with 16:9 / 4:5 crops. Card radius 20px, image radius 24px. Campus bar overlaps the hero bottom edge. Footer: three campus columns + links + "Powered by ChurchConnect · DataIsData".

## 6. Depth and elevation
Mostly flat on morning; cards on parchment use a 1px line + soft shadow (0 10px 30px -12px rgba(23,19,28,.18)). Glow only on night sections (orange/gold radial). No glassmorphism over text.

## 7. Do's and don'ts
Do: real photos of real people; service times above the fold; tap-to-call everywhere; the church's own words; one primary action per section; reduced-motion versions of every animation.
Don't: membership counts; "approved" for City of Possibility until confirmed; generated people; tiny gray text; letter-spaced all-caps body; green on black; orange text on light; stock photography; reproducing flyers as the only source of event text.

## 8. Responsive behavior
Audit widths 320, 390, 768, 1008, 1024, 1280, 1512, 1920. Mobile: sticky bottom bar (Plan a visit · Give), campus bar becomes swipeable cards, life stages become a horizontal snap list, film switches to portrait frames, and below 640px height or with reduced motion the film is replaced by 5 static panels. Nav collapses to a full-screen menu with scroll lock and 56px rows.

## 9. Agent prompt guide
"Build for The Saint Paul's Baptist Church using DESIGN.md tokens only. Light morning pages, Bricolage display + Atkinson body at 20px, orange reserved for the single primary action per section with ink text, green links, purple for scripture and life stages. Use photos from public/images/church only; never generate people. Every page ends with a Grow · Pray · Serve next step and the two campus times. Animate only transform/opacity, 150–300ms UI, 400–800ms reveals, honor prefers-reduced-motion."
