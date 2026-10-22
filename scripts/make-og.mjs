/**
 * Renders link-preview cards (public/og/*.png, 1200×630) and app icons from the church's own
 * photos, flyers and logo. Output is committed, so nobody needs to run this unless content changes.
 *
 *   npm i -D playwright-core   (once; uses any installed Chrome/Chromium)
 *   CHROME="C:/Program Files/Google/Chrome/Application/chrome.exe" node scripts/make-og.mjs
 */
import { build } from 'esbuild'
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { tmpdir } from 'node:os'

const root = resolve(import.meta.dirname, '..')
const pub = join(root, 'public')
const outDir = join(pub, 'og')
mkdirSync(outDir, { recursive: true })
const tmp = join(tmpdir(), 'spbc-og'); mkdirSync(tmp, { recursive: true })

// Load content straight from the TypeScript sources so cards never drift from the site.
await build({ stdin: { contents: "export { events } from './src/data/events'; export { lifeStages, campuses } from './src/config/site'", resolveDir: root, loader: 'ts' }, bundle: true, format: 'esm', platform: 'node', outfile: join(tmp, 'content.mjs'), alias: { '@': join(root, 'src') }, loader: { '.json': 'json' }, logLevel: 'error' })
const { events, lifeStages } = await import(pathToFileURL(join(tmp, 'content.mjs')).href + '?t=' + Date.now())

let chromium
try { ({ chromium } = await import('playwright-core')) } catch { console.error('Install playwright-core first: npm i -D playwright-core'); process.exit(1) }
const exe = process.env.CHROME || ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find((p) => existsSync(p))

const f = (p) => pathToFileURL(join(root, p)).href
const img = (p) => pathToFileURL(join(pub, p)).href
const fonts = `
@font-face{font-family:B;src:url(${f('node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-opsz-normal.woff2')}) format('woff2');font-weight:200 800}
@font-face{font-family:A;src:url(${f('node_modules/@fontsource/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-400-normal.woff2')}) format('woff2');font-weight:400}
@font-face{font-family:A;src:url(${f('node_modules/@fontsource/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-700-normal.woff2')}) format('woff2');font-weight:700}
@font-face{font-family:I;src:url(${f('node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2')}) format('woff2');font-style:italic}`
const css = `${fonts}
*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;overflow:hidden;font-family:A,sans-serif}
.card{position:relative;width:1200px;height:630px;display:flex;overflow:hidden}
.l{position:relative;z-index:2;flex:0 0 640px;padding:54px 56px;display:flex;flex-direction:column}
.logo{height:52px;width:auto;align-self:flex-start}
.eb{margin-top:auto;font:700 24px/1.2 A;letter-spacing:.04em;display:flex;gap:12px;align-items:center}
.eb i{width:14px;height:14px;border-radius:50% 0 50% 50%;transform:rotate(-45deg);background:#F3801F;display:inline-block}
h1{margin-top:14px;font:800 76px/0.98 B;letter-spacing:-0.035em;text-wrap:balance}
h1.s{font-size:62px}h1.xs{font-size:52px}
.sub{margin-top:18px;font:400 27px/1.35 A;opacity:.9;text-wrap:balance}
.foot{margin-top:24px;font:700 21px/1 A;display:flex;gap:22px;opacity:.95}
.r{position:absolute;inset:0 0 0 560px;z-index:1}
.r img.ph{width:100%;height:100%;object-fit:cover}
.fade{position:absolute;inset:0;z-index:1}
.dark{background:#00492A;color:#fff}.dark .eb{color:#FFD7A3}
.light{background:#FFFBF5;color:#17131C}.light .eb{color:#B5520A}.light .sub{color:#5B5560;opacity:1}
.night{background:#121212;color:#fff}.night .eb{color:#FFD7A3}
.flyerwrap{position:absolute;inset:0 0 0 600px;z-index:1;overflow:hidden}
.flyerwrap .bg{position:absolute;inset:-40px;width:calc(100% + 80px);height:calc(100% + 80px);object-fit:cover;filter:blur(28px) saturate(1.2) brightness(.55)}
.flyerwrap .fl{position:absolute;top:50%;left:50%;max-height:540px;max-width:520px;transform:translate(-50%,-50%) rotate(2deg);border-radius:18px;box-shadow:0 30px 60px rgba(0,0,0,.45)}
.stages{position:absolute;inset:40px 40px 40px 640px;display:grid;grid-template-columns:1fr 1fr;gap:12px;z-index:1}
.stages div{border-radius:20px;color:#fff;padding:16px 18px;display:flex;flex-direction:column;justify-content:flex-end}
.stages b{font:800 30px/1 B;letter-spacing:-.02em}.stages span{font:400 17px/1.2 A;opacity:.85;margin-bottom:6px}
.mark{position:absolute;right:-60px;bottom:-80px;width:620px;opacity:.16;z-index:1}
.collage{position:absolute;inset:0 0 0 610px;z-index:1}
.collage img{position:absolute;width:260px;border-radius:16px;box-shadow:0 24px 50px rgba(0,0,0,.4)}
.icon{width:512px;height:512px;display:flex;align-items:center;justify-content:center}
.hero{position:relative;width:1200px;height:630px;overflow:hidden;background:#00492A;color:#fff}
.hero .ph{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 38%}
.hero .shade{position:absolute;inset:0;background:linear-gradient(100deg,rgba(0,52,30,.97) 0%,rgba(0,58,33,.93) 42%,rgba(0,58,33,.55) 68%,rgba(18,18,18,.25) 100%),linear-gradient(to top,rgba(10,20,14,.55),transparent 45%)}
.hero .glow{position:absolute;left:-120px;bottom:-200px;width:700px;height:520px;background:radial-gradient(closest-side,rgba(243,128,31,.38),transparent);filter:blur(10px)}
.hero .wm{position:absolute;right:-70px;top:-40px;width:560px;opacity:.10}
.hero .in{position:absolute;inset:0;padding:62px 70px;display:flex;flex-direction:column}
.hero .lg{width:560px;height:auto;filter:drop-shadow(0 6px 24px rgba(0,0,0,.35))}
.hero .bar{margin:34px 0 26px;width:84px;height:6px;border-radius:6px;background:linear-gradient(90deg,#F3801F,#FFD7A3)}
.hero h1{font:800 64px/1 B;letter-spacing:-0.035em;max-width:760px}
.hero h1 b{background:linear-gradient(90deg,#F3801F,#FFC58A);-webkit-background-clip:text;background-clip:text;color:transparent}
.hero .chips{margin-top:auto;display:flex;gap:12px;flex-wrap:wrap}
.hero .chip{display:flex;align-items:baseline;gap:10px;border-radius:999px;padding:12px 22px;background:rgba(255,255,255,.12);border:1.5px solid rgba(255,255,255,.28);font:700 22px/1 A}
.hero .chip span{font:400 20px/1 A;opacity:.85}
.hero .chip.o{background:#F3801F;border-color:#F3801F;color:#17131C}
.hero .chip.o span{opacity:.8}
.hero .sub{margin-top:14px;font:400 24px/1.3 A;opacity:.88}`

const logo = (light) => `<img class="logo" src="${img(`images/church/spbc-logo-${light ? 'white' : 'ink'}.svg`)}">`
const leftDark = 'linear-gradient(90deg,#121212 0%,rgba(18,18,18,.92) 38%,rgba(18,18,18,.35) 62%,rgba(18,18,18,0) 80%)'
const leftGreen = 'linear-gradient(90deg,#00492A 0%,rgba(0,73,42,.95) 40%,rgba(0,73,42,.3) 64%,rgba(0,73,42,0) 80%)'
const size = (t) => (t.length > 34 ? 'xs' : t.length > 20 ? 's' : '')

function photoCard({ eyebrow, title, sub, photo, tone = 'night', pos = 'center', foot }) {
  const fade = tone === 'dark' ? leftGreen : leftDark
  return `<div class="card ${tone}"><div class="r"><img class="ph" style="object-position:${pos}" src="${img('images/church/' + photo)}"></div><div class="fade" style="background:${fade}"></div>
  <div class="l">${logo(true)}<p class="eb"><i></i>${eyebrow}</p><h1 class="${size(title)}">${title}</h1>${sub ? `<p class="sub">${sub}</p>` : ''}${foot ? `<p class="foot">${foot}</p>` : ''}</div></div>`
}
const times = '<span>Creighton 9 AM</span><span>Belt 11:30 AM</span><span>Online 9 AM</span>'

const cards = {
  home: `<div class="hero"><img class="ph" src="${img('images/church/worship-lights.jpg')}"><div class="shade"></div><div class="glow"></div>
    <img class="wm" src="${img('images/church/spbc-mark-white.svg')}">
    <div class="in"><img class="lg" src="${img('images/church/spbc-logo-white.svg')}">
    <div class="bar"></div><h1>A church for people on the <b>GROW.</b></h1>
    <p class="sub">Richmond &amp; Henrico, Virginia · since 1909</p>
    <div class="chips"><div class="chip o">Creighton <span>9 AM</span></div><div class="chip">Belt <span>11:30 AM</span></div><div class="chip">Online <span>9 AM</span></div></div></div></div>`,
  visit: photoCard({ eyebrow: 'Plan your visit', title: 'We saved you a seat.', sub: 'Two campuses, one church. Pick the time that fits your Sunday.', photo: 'sanctuary-choir.jpg', foot: times }),
  story: photoCard({ eyebrow: 'Our story', title: 'From one Thanksgiving night in 1909.', sub: 'Two campuses, eight life stages and the City of Possibility.', photo: 'hero-poster.jpg', tone: 'dark' }),
  community: photoCard({ eyebrow: 'Community outreach', title: 'Finding needs and meeting them.', sub: 'Fresh food Fridays · mobile showers Wednesdays · rides · emergency help', photo: 'prayer-pew.jpg', tone: 'dark' }),
  watch: photoCard({ eyebrow: 'Watch online', title: 'Worship live Sundays at 9 AM.', sub: 'MySPBC.tv · YouTube · Facebook @myspbc · the SPBC app', photo: 'worship-lights.jpg', pos: '50% 30%' }),
  give: photoCard({ eyebrow: 'Generosity', title: 'Every gift keeps the light moving.', sub: 'Give securely online or in the SPBC app. Set up recurring giving in a minute.', photo: 'sanctuary-choir.jpg', tone: 'dark' }),
  'life-stages': `<div class="card light"><div class="l">${logo(false)}<p class="eb"><i></i>Pastoral care for every season</p><h1 class="s">A pastor and a place for every life stage.</h1><p class="sub">Birth to 70 and beyond, each with its own Life Stage Pastor and Bible study.</p></div>
    <div class="stages">${lifeStages.map((s) => `<div style="background:${s.color}"><span>Ages ${s.ages}</span><b>${s.name}</b></div>`).join('')}</div></div>`,
  possibility: `<div class="card dark"><img class="mark" src="${img('images/church/spbc-mark-white.svg')}"><div class="l" style="flex-basis:900px">${logo(true)}<p class="eb"><i></i>The City of Possibility · Eastern Henrico</p><h1>321 acres. With God all things are possible.</h1><p class="sub">Homes, gardens and gathering places, open to everyone.</p></div></div>`,
  events: `<div class="card night"><div class="collage">
    <img src="${img('images/church/flyers/fire-fridays.png')}" style="left:20px;top:70px;transform:rotate(-6deg)">
    <img src="${img('images/church/flyers/harvest-festival.jpg')}" style="left:300px;top:40px;transform:rotate(5deg)">
    <img src="${img('images/church/flyers/church-anniversary.png')}" style="left:170px;top:300px;transform:rotate(-1deg)"></div>
    <div class="fade" style="background:${leftDark}"></div>
    <div class="l">${logo(true)}<p class="eb"><i></i>What’s happening</p><h1>Ignite your fall.</h1><p class="sub">Trunk or Treat, Fire on Fridays, the Veterans Brunch, our 117th Anniversary and The Spirit of Christmas.</p></div></div>`,
  connect: `<div class="hero"><img class="ph" src="${img('images/church/worship-lights.jpg')}" style="opacity:.55"><div class="shade"></div><div class="glow"></div>
    <img class="wm" src="${img('images/church/spbc-mark-white.svg')}">
    <div class="in"><img class="lg" src="${img('images/church/spbc-logo-white.svg')}">
    <div class="bar"></div><h1>Saint Paul’s <b>Everywhere</b></h1>
    <p class="sub">The member portal and staff hub. One church, wherever you are.</p>
    <div class="chips"><div class="chip o">Member portal</div><div class="chip">Staff hub</div><div class="chip">Tap to preview</div></div></div></div>`,
}
for (const e of events) {
  const sub = `${e.when}<br>${e.where}`
  cards[`event-${e.slug}`] = e.flyer
    ? `<div class="card night"><div class="flyerwrap"><img class="bg" src="${img('images/church/' + e.flyer)}"><img class="fl" src="${img('images/church/' + e.flyer)}"></div>
       <div class="l" style="flex-basis:600px">${logo(true)}<p class="eb"><i></i>${e.kicker ?? 'Saint Paul’s event'}</p><h1 class="${size(e.title)}">${e.title}</h1><p class="sub">${sub}</p></div></div>`
    : `<div class="card dark"><img class="mark" src="${img('images/church/spbc-mark-white.svg')}"><div class="l" style="flex-basis:900px">${logo(true)}<p class="eb"><i></i>${e.kicker ?? 'Saint Paul’s event'}</p><h1 class="${size(e.title)}">${e.title}</h1><p class="sub">${sub}</p></div></div>`
}

const b = await chromium.launch({ executablePath: exe })
const page = await b.newPage({ viewport: { width: 1200, height: 630 } })
async function shot(html, file, clip) {
  const p = join(tmp, 'card.html'); writeFileSync(p, `<!doctype html><meta charset="utf-8"><style>${css}</style>${html}`)
  await page.goto(pathToFileURL(p).href); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(150)
  await page.screenshot({ path: file, clip, omitBackground: true })
}
for (const [name, html] of Object.entries(cards)) { await shot(html, join(outDir, `${name}.png`), { x: 0, y: 0, width: 1200, height: 630 }); console.log('og', name) }

// Icons: the leaf-tree mark on a GROW-green tile.
const mark = readFileSync(join(pub, 'images/church/spbc-mark-white.svg'), 'utf8')
for (const [file, px, pad, radius] of [['favicon.png', 64, 8, 14], ['apple-touch-icon.png', 180, 26, 0], ['icon-512.png', 512, 70, 0]]) {
  await page.setViewportSize({ width: px, height: px })
  await shot(`<div style="width:${px}px;height:${px}px;background:#006C3A;border-radius:${radius}px;display:flex;align-items:center;justify-content:center;padding:${pad}px">${mark.replace('<svg', '<svg style="width:100%;height:100%"')}</div>`, join(pub, file), { x: 0, y: 0, width: px, height: px })
  console.log('icon', file)
}
await b.close()
