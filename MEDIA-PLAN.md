# MEDIA-PLAN.md — SPBC generated media (Kie.ai) + real-media processing

## Status (October 21, 2026)
- Done: S1 lamp, S2 street, S4 branches, S5 dawn (Nano Banana Pro, 2K, about 4 runs). Converted to `public/images/art/<name>.webp` (2000 px) and `-sm.webp` (800 px). All checked: no people, faces, text or logos.
- Wired: S1/S2/S4/S5 under the canvas film (`LightFilm.tsx`), S1/S2/S4/S5 in the static film fallback, S5 as the City of Possibility header.
- Skipped on purpose: S3 (the real worship photo does that beat), Veo clips + frames (the particle film over stills reads well and costs nothing to load), plates (built in CSS/SVG), OG base (cards are rendered from real photos by `npm run og`).
- Node note: Node's fetch ignores HTTPS_PROXY. Behind a proxy run kie.mjs with `NODE_USE_ENV_PROXY=1` (Node 22.21+).
- Still open: faithful upscales of the 800 px church photos. Ask the church for originals first.
Run from the repo root `...\Clients\saint-pauls-baptist-church\spbc` in PowerShell on Azaiah's PC (Kie is blocked from Claude's cloud sandbox). Requires ffmpeg on PATH for frames.mjs. The key stays in `ChurchConnect\claude-project\.env.local`.

```powershell
$K = "C:\Users\azaia\Videos\Captures\Gedji\Logos\Gedji PNG.s\DataIsData\ChurchConnect\claude-project\tools"
$C = "..\assets\church"     # the church's real media (fetched 2026-10-21)
node "$K\kie.mjs" credit     # check balance first; log credits per run in assets/generations.jsonl
```

## Rules for this church
- Generated = atmosphere, light, land, motifs only. "No people, no faces, no text, no logos" in every prompt.
- People beats use the church's real photos (`photos/events-hero-worship.jpg`, `photos/sanctuary-choir.jpg`, `photos/prayer-pew.jpg`, `photos/bible-study-notes.jpg`) and their real `video/hero-video.mp4`.
- Only `kieRefOk: true` files in photos.json are sent to Kie (logo, wordmark, sanctuary-choir, events-hero-worship, hero poster), and only as style/palette/building references, never to animate or re-render the people in them.
- The City of Possibility is not built: render it as light and open land at dawn (possibility), never as a specific town that looks approved or finished.
- Palette words for prompts: "warm sunrise orange #F3801F, deep green #00492A, royal purple #673391, cream #FFFBF5, gold light #FFD7A3, night #121212".

## A. Signature film "One Light to a City" (5 beats, ~16 s source → 96 desktop + 96 portrait frames)
Stills first (Nano Banana Pro, 2K), then two Veo first/last-frame clips, then the real-photo beat is composited in code (crossfade), so no people are generated.

| # | Still | Command |
|---|---|---|
| S1 | One lamp, 1909 | `node "$K\kie.mjs" image --prompt "A single oil lamp glowing on a wooden windowsill at night, Thanksgiving 1909 Richmond Virginia, frost on old glass, deep night #121212, warm gold light #FFD7A3, painterly cinematic realism, shallow depth of field, no people, no faces, no text, no logos" --aspect 16:9 --res 2K --out spbc-s1-lamp` |
| S2 | Light carried (Church Hill) | `node "$K\kie.mjs" image --prompt "A narrow 1950s brick rowhouse street on a hill at blue hour, every window lit one by one with warm gold light, a soft trail of light flowing down the street like a river, Richmond Church Hill atmosphere, cinematic, no people, no faces, no text, no logos" --aspect 16:9 --res 2K --out spbc-s2-street` |
| S3 | Sea of lights (abstract bridge to the real photo) | `node "$K\kie.mjs" image --ref "$C\photos\events-hero-worship.jpg" --prompt "Abstract field of thousands of small warm and cool points of light in darkness, arranged like the balcony and floor of a large round sanctuary seen from above, bokeh, match the light distribution and blue-violet ceiling glow of the reference but show only lights, no people, no faces, no text" --aspect 16:9 --res 2K --out spbc-s3-lights` |
| S4 | Eight branches | `node "$K\kie.mjs" image --prompt "Streams of warm light branching from one trunk into eight glowing branches across a dark sky, organic like a tree and like roads, colors shifting orange #F3801F to purple #673391 to green #006C3A, elegant, minimal, no people, no text" --aspect 16:9 --res 2K --out spbc-s4-branches` |
| S5 | Dawn over the 321 acres | `node "$K\kie.mjs" image --ref "$C\brand\spbc-logo-white.svg.png" --prompt "Sunrise over wide open green Virginia farmland and tree lines at the edge of a suburb, gentle paths of tiny lights tracing where future streets could be, a radiant burst of sun rays rising like the reference mark, warm orange and gold sky fading to cream, hopeful, cinematic, no buildings, no people, no text, no logos" --aspect 16:9 --res 2K --out spbc-s5-dawn` |
Note S5: Kie refs must be raster. First run `ffmpeg -i "$C\brand\spbc-logo-white.svg" -vf scale=1024:-1 "$C\brand\spbc-logo-white.svg.png"` (or export the SVG to PNG in any tool); drop the --ref if it pushes a logo into the image.

Clips (Veo 3.1, first + last frame; pick the best of 2 takes each):
```powershell
node "$K\kie.mjs" video --model veo-3-1 --first assets/raw/spbc-s1-lamp.png --last assets/raw/spbc-s2-street.png --aspect 16:9 --prompt "Slow continuous dolly back from the single lamp through the window glass and out over the street as window after window lights up, the light flowing downhill like a river, gentle, no people, no text" --out spbc-clip-a
node "$K\kie.mjs" video --model veo-3-1 --first assets/raw/spbc-s4-branches.png --last assets/raw/spbc-s5-dawn.png --aspect 16:9 --prompt "The eight branches of light settle into the land and become paths of tiny lights while the sky brightens to dawn and the sun rises in a burst of rays, slow, hopeful, no people, no text" --out spbc-clip-b
```
(Portrait: rerun both with `--aspect 9:16 --out spbc-clip-a-m` / `spbc-clip-b-m`, or center-crop with `--portrait` below.)

Frames:
```powershell
node "$K\frames.mjs" assets/raw/spbc-clip-a.mp4 --name light-a --frames 48 --out public/video
node "$K\frames.mjs" assets/raw/spbc-clip-a.mp4 --name light-a --frames 48 --portrait --out public/video
node "$K\frames.mjs" assets/raw/spbc-clip-b.mp4 --name light-b --frames 48 --out public/video
node "$K\frames.mjs" assets/raw/spbc-clip-b.mp4 --name light-b --frames 48 --portrait --out public/video
```
Film assembly in code (`src/web/home/LightFilm.tsx`): beat 1–2 = light-a frames · beat 3 = S3 still crossfading to the real `events-hero-worship.jpg` with caption "Today: thousands of lights, two campuses, one church" (no count) · beat 4–5 = light-b frames · end card: Matthew 19:26 + "Follow the progress" + "Plan a visit". Budget: ≤ 4.5 MB desktop frames, ≤ 2.5 MB portrait; static fallback = S1, S2, real photo, S4, S5.

## B. Hero (real, not generated)
```powershell
node "$K\frames.mjs" "$C\video\hero-video.mp4" --name hero --loop --out public/video
```
Use their own hero video as the ambient loop (pause control, poster = `video/hero-video-poster.jpg`). If it's too low-res, ask the church for the source file; do not regenerate it with Kie (it contains people).

## C. Plates and textures (Nano Banana Pro)
| Asset | Command | Use |
|---|---|---|
| Burst ornament plate | `node "$K\kie.mjs" image --prompt "Minimal radiating sunburst of fine rays on cream #FFFBF5, rays in warm orange #F3801F fading to transparent, flat vector feel, centered, lots of empty space, no text" --aspect 16:9 --res 2K --out spbc-plate-burst` | Section backgrounds (or build as SVG — prefer SVG if equal) |
| Possibility texture | `node "$K\kie.mjs" image --prompt "Soft aerial abstract of green fields and tree lines at golden hour with faint contour lines, muted, low contrast for text overlay, no buildings, no people, no text" --aspect 21:9 --res 2K --out spbc-plate-land` | /city-of-possibility header |
| OG card base | `node "$K\kie.mjs" image --prompt "Warm sunrise gradient from orange #F3801F to cream with subtle radiating rays on the right, empty left two thirds for a headline, no text, no logos" --aspect 16:9 --res 2K --out spbc-og-base` | 1200×630 OG images (text added in code) |

## D. Real-photo enhancement (no content changes)
Upscale only, faithful, for the 800px photos (sanctuary-choir, prayer-pew, bible-study-notes). Prefer the church's originals. If they can't send them: Topaz upscale via `node "$K\kie.mjs" task --body upscale-sanctuary.json --out spbc-up-sanctuary` with `{"model":"TODO-confirm-topaz-image-upscale-model-id","input":{"image_url":"<upload>","upscale_factor":"2"}}` — confirm the market model id and input names in Kie docs first, and visually check that faces are unchanged.

## E. Logging
Append every keeper to `assets/generations.jsonl` and the prompt library in `07-lessons-learned.md` (model, settings, credits). Commit only `public/` outputs, never `assets/raw/` or `.env.local`.
