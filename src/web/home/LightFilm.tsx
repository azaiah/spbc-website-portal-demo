import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { church, lifeStages } from '@/config/site'
import { Art, Eyebrow, Photo, PrimaryButton, art } from '../ui'
import { useFits } from '../useFits'

/**
 * Signature feature: "One Light to a City".
 * A scroll-driven canvas of points of light moves through five scenes:
 *   1. one lamp, Thanksgiving night 1909
 *   2. the light carried down a Church Hill street, window after window
 *   3. thousands of lights: dissolves into the church's REAL photo of the Creighton sanctuary full of phone lights
 *   4. a tree with eight branches, one for each life stage (echoes the leaf canopy in the logo)
 *   5. dawn over the 321 acres: paths of light where a City of Possibility could grow
 * No people are generated. Optional Kie.ai stills (public/images/art/spbc-s1..s5) sit underneath when present.
 * Reduced motion or short windows get <StaticLightFilm/>.
 */

type Pt = { x: number; y: number }
const N_DESKTOP = 1100
const N_PHONE = 520

function rng(seed: number) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 } }

/** Precompute every particle's position in each scene, in normalized [0..1] coordinates (aspect-aware). */
function buildScenes(n: number, aspect: number) {
  const r = rng(1909)
  const portrait = aspect < 0.95
  const scenes: Pt[][] = [[], [], [], [], []]
  const sizes: number[] = []
  const hue: number[] = []
  // Scene 4: eight branch tips (fanned like the logo canopy)
  // Desktop: the tree stands to the right of the headline; phones: centered below it.
  const cx = portrait ? 0.5 : 0.66
  const trunkBase: Pt = { x: cx, y: 0.95 }
  const trunkTop: Pt = { x: cx, y: portrait ? 0.74 : 0.7 }
  const tips: Pt[] = Array.from({ length: 8 }, (_, i) => {
    const a = Math.PI * (1.1 + (i / 7) * 0.8) // from left-up to right-up
    const rad = portrait ? 0.3 : 0.36
    const sx = portrait ? 1.25 : 1.35 / Math.max(aspect, 1)
    return { x: cx + Math.cos(a) * rad * sx, y: trunkTop.y + Math.sin(a) * rad * (portrait ? 0.8 : 1.05) }
  })
  for (let i = 0; i < n; i++) {
    sizes.push(0.6 + r() * r() * 2.6)
    hue.push(r())
    // 1. one lamp: tight glow, slight flicker spread
    const a0 = r() * Math.PI * 2, d0 = Math.pow(r(), 2.4) * 0.035
    scenes[0].push({ x: (portrait ? 0.5 : 0.62) + Math.cos(a0) * d0 / aspect, y: 0.46 + Math.sin(a0) * d0 })
    // 2. a street on a hill: rows of windows descending left to right
    const t = r()
    const house = Math.floor(t * 9)
    const wx = (house + 0.5) / 9 + (r() - 0.5) * 0.05
    const floor = Math.floor(r() * 3)
    const hillY = 0.28 + wx * 0.34
    scenes[1].push({ x: 0.06 + wx * 0.88, y: hillY + floor * 0.06 + (r() - 0.5) * 0.018 })
    // 3. a round sanctuary seen from the balcony: floor ellipse + balcony arc
    if (r() < 0.62) {
      const rr = Math.sqrt(r()), aa = Math.PI * (0.05 + r() * 0.9)
      scenes[2].push({ x: 0.5 + Math.cos(aa) * rr * 0.46, y: 0.92 - Math.sin(aa) * rr * 0.42 })
    } else {
      const aa = Math.PI * (0.02 + r() * 0.96), rr = 0.47 + r() * 0.06
      scenes[2].push({ x: 0.5 + Math.cos(aa) * rr, y: 0.62 - Math.sin(aa) * rr * 0.5 })
    }
    // 4. tree: trunk, eight branches, a canopy of leaves at each tip
    const pick = r()
    if (pick < 0.12) {
      const k = r()
      scenes[3].push({ x: trunkBase.x + (r() - 0.5) * 0.012, y: trunkBase.y + (trunkTop.y - trunkBase.y) * k })
    } else if (pick < 0.45) {
      const b = tips[Math.floor(r() * 8)], k = r()
      const cx = trunkTop.x + (b.x - trunkTop.x) * 0.35, cy = trunkTop.y + (b.y - trunkTop.y) * 0.75
      const x = (1 - k) * (1 - k) * trunkTop.x + 2 * (1 - k) * k * cx + k * k * b.x
      const y = (1 - k) * (1 - k) * trunkTop.y + 2 * (1 - k) * k * cy + k * k * b.y
      scenes[3].push({ x: x + (r() - 0.5) * 0.006, y: y + (r() - 0.5) * 0.006 })
    } else {
      const b = tips[Math.floor(r() * 8)], aa = r() * Math.PI * 2, dd = Math.pow(r(), 0.7) * 0.06
      scenes[3].push({ x: b.x + Math.cos(aa) * dd / Math.max(aspect, 0.6), y: b.y + Math.sin(aa) * dd })
    }
    // 5. dawn: perspective paths of light across open land below the horizon
    const horizon = portrait ? 0.56 : 0.58
    const lane = Math.floor(r() * 7)
    const depth = Math.pow(r(), 1.7) // 0 = horizon, 1 = near
    const spread = 0.04 + depth * 0.9
    const laneX = (lane - 3) / 3
    const curve = Math.sin(depth * 2.2 + lane) * 0.03
    scenes[4].push({ x: 0.5 + laneX * spread * 0.55 + curve, y: horizon + depth * (1 - horizon) * 0.95 })
  }
  return { scenes, sizes, hue, tips }
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
/** Scene timeline: [start of morph, end of morph] for each transition 0→1, 1→2, 2→3, 3→4 */
const MORPHS: [number, number][] = [[0.14, 0.24], [0.36, 0.46], [0.56, 0.66], [0.74, 0.84]]

function sceneAt(p: number) {
  for (let i = MORPHS.length - 1; i >= 0; i--) {
    const [a, b] = MORPHS[i]
    if (p >= b) return { from: i + 1, to: i + 1, k: 0 }
    if (p >= a) return { from: i, to: i + 1, k: ease((p - a) / (b - a)) }
  }
  return { from: 0, to: 0, k: 0 }
}

function LightCanvas({ p }: { p: MotionValue<number> }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current
    if (!c) return
    let raf = 0
    let data = buildScenes(window.innerWidth < 700 ? N_PHONE : N_DESKTOP, window.innerWidth / window.innerHeight)
    const resize = () => { data = buildScenes(window.innerWidth < 700 ? N_PHONE : N_DESKTOP, window.innerWidth / window.innerHeight) }
    window.addEventListener('resize', resize)
    // Pre-rendered glow sprites (one per color) instead of a gradient per particle per frame.
    const sprites = ['255,205,140', '255,236,205', '243,128,31', '190,225,205'].map((col) => {
      const sp = document.createElement('canvas'); sp.width = sp.height = 64
      const sc = sp.getContext('2d')!
      const g = sc.createRadialGradient(32, 32, 0, 32, 32, 32)
      g.addColorStop(0, `rgba(${col},1)`); g.addColorStop(0.25, `rgba(${col},0.55)`); g.addColorStop(1, `rgba(${col},0)`)
      sc.fillStyle = g; sc.fillRect(0, 0, 64, 64)
      return sp
    })
    const start = performance.now()
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      const w = Math.round(c.clientWidth * dpr), h = Math.round(c.clientHeight * dpr)
      if (!w || !h) return
      if (c.width !== w || c.height !== h) { c.width = w; c.height = h }
      const ctx = c.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)
      const prog = p.get()
      const { from, to, k } = sceneAt(prog)
      const A = data.scenes[from], B = data.scenes[to]
      const time = (now - start) / 1000
      // In scene 0 only a handful of points are visible (one lamp); the light multiplies as we scroll.
      const visible = from === 0 && to === 0 ? 0.14 : from === 0 ? 0.14 + k * 0.86 : 1
      const count = Math.floor(A.length * visible)
      // Scene 3 (real photo) dims the particles so the photo carries the moment.
      const photoDim = from === 2 && to === 2 ? 0.35 : from === 1 && to === 2 ? 1 - k * 0.65 : from === 2 ? 0.35 + k * 0.65 : 1
      ctx.globalCompositeOperation = 'lighter'
      for (let i = 0; i < count; i++) {
        const a = A[i], b = B[i]
        // Stagger each particle a little so the morph flows instead of moving in lockstep.
        const kk = Math.min(1, Math.max(0, k * 1.25 - (data.hue[i] * 0.25)))
        const x = (a.x + (b.x - a.x) * kk) * w
        const y = (a.y + (b.y - a.y) * kk) * h
        const tw = 0.65 + 0.35 * Math.sin(time * (1.2 + data.hue[i] * 2.2) + i)
        const s = data.sizes[i] * dpr * (from === 0 && to === 0 ? 1.6 : 1)
        const warm = data.hue[i]
        const sprite = sprites[warm < 0.55 ? 0 : warm < 0.8 ? 1 : warm < 0.92 ? 2 : 3]
        ctx.globalAlpha = Math.min(1, tw * photoDim * (0.55 + data.sizes[i] * 0.2))
        const d = s * 8
        ctx.drawImage(sprite, x - d / 2, y - d / 2, d, d)
      }
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [p])
  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />
}

const beats = [
  { at: [0.0, 0.16], eyebrow: 'Thanksgiving night, 1909', title: 'It started with one light.', text: 'A few believers from First Union Baptist Church received a letter of release and a blessing to form a new church. They named it Saint Paul’s.' },
  { at: [0.22, 0.38], eyebrow: 'Church Hill', title: 'The light was carried.', text: 'When the church needed a bigger home on Church Hill, members mortgaged their own houses to make it happen.' },
  { at: [0.44, 0.58], eyebrow: 'Today', title: 'Now the room is full of lights.', text: 'Two campuses, one church, and a sanctuary that lights up when the Word goes forth.' },
  { at: [0.64, 0.76], eyebrow: 'One church, eight life stages', title: 'Every generation, growing together.', text: 'From imagiNATION to Refiners, there is a pastor and a place for every season of life.' },
]

function Beat({ p, b, i }: { p: MotionValue<number>; b: (typeof beats)[number]; i: number }) {
  const [a, z] = b.at
  const opacity = useTransform(p, [Math.max(0, a - 0.03), a + 0.005, z, z + 0.03], [i === 0 ? 1 : 0, 1, 1, 0])
  const y = useTransform(p, [Math.max(0, a - 0.03), a + 0.005, z, z + 0.03], [i === 0 ? 0 : 24, 0, 0, -24])
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 top-0">
      <Eyebrow light>{b.eyebrow}</Eyebrow>
      <h2 className="mt-3 font-display font-bold tracking-[-0.025em] leading-[1.02] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.8)]" style={{ fontSize: 'clamp(2.1rem, calc(4.2vh + 1.2rem), 4.6rem)' }}>{b.title}</h2>
      <p className="mt-4 max-w-xl text-white/90 text-xl leading-relaxed drop-shadow-[0_1px_10px_rgba(0,0,0,0.9)]">{b.text}</p>
    </motion.div>
  )
}

function StageLabels({ p }: { p: MotionValue<number> }) {
  const opacity = useTransform(p, [0.6, 0.66, 0.76, 0.8], [0, 1, 1, 0])
  const [aspect, setAspect] = useState(1.6)
  useEffect(() => { const on = () => setAspect(window.innerWidth / window.innerHeight); on(); window.addEventListener('resize', on); return () => window.removeEventListener('resize', on) }, [])
  const { tips } = buildScenes(8, aspect)
  return (
    <motion.ul style={{ opacity }} aria-hidden="true" className="absolute inset-0 pointer-events-none">
      {tips.map((t, i) => (
        <li key={i} className="absolute -translate-x-1/2 -translate-y-[calc(100%+18px)] whitespace-nowrap rounded-full bg-night/60 backdrop-blur px-3 py-1 text-[15px] font-bold text-glow" style={{ left: `${t.x * 100}%`, top: `${t.y * 100}%` }}>{lifeStages[i].name}</li>
      ))}
    </motion.ul>
  )
}

/** Where you are in the story (5 chapters), tap to jump, and a Skip button so nobody feels stuck. */
const CHAPTERS = [0.06, 0.3, 0.51, 0.7, 0.96]
function ChapterRail({ p, sectionRef }: { p: MotionValue<number>; sectionRef: React.RefObject<HTMLElement> }) {
  const [active, setActive] = useState(0)
  useMotionValueEvent(p, 'change', (v) => { const i = v < 0.19 ? 0 : v < 0.41 ? 1 : v < 0.61 ? 2 : v < 0.8 ? 3 : 4; setActive(i) })
  const go = (frac: number) => {
    const el = sectionRef.current; if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + (el.offsetHeight - window.innerHeight) * frac, behavior: 'smooth' })
  }
  const labels = ['1909', 'Church Hill', 'Today', 'Life stages', 'Possibility']
  return (
    <>
      <nav aria-label="Story chapters" className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 flex flex-col items-end gap-1">
        {CHAPTERS.map((c, i) => (
          <button key={i} type="button" onClick={() => go(c)} aria-label={`Chapter ${i + 1} of 5: ${labels[i]}`} aria-current={i === active ? 'step' : undefined} className="group flex items-center gap-2 min-h-[36px] min-w-[36px] justify-end">
            <span className={`hidden md:inline text-[14px] font-semibold transition-opacity ${i === active ? 'text-glow opacity-100' : 'text-white/70 opacity-0 group-hover:opacity-100'}`}>{labels[i]}</span>
            <span className={`block rounded-full transition-all duration-300 ${i === active ? 'h-7 w-2.5 bg-orange' : 'h-2.5 w-2.5 bg-white/50 group-hover:bg-white'}`} />
          </button>
        ))}
      </nav>
      <div className="absolute left-4 sm:left-6 bottom-24 sm:bottom-6 flex items-center gap-3">
        <span className="hidden sm:inline font-caps text-[14px] font-semibold text-white/80">{active + 1} of 5</span>
        {active < 4 && <button type="button" onClick={() => { const el = sectionRef.current; if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + el.offsetHeight, behavior: 'smooth' }) }} className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur border border-white/30 px-4 min-h-[44px] text-[15px] font-bold text-white hover:bg-white/25">Skip <ChevronDown size={16} /></button>}
      </div>
    </>
  )
}

/** Optional Kie.ai stills under the particles, hidden if the files are not there yet. */
function ArtLayer({ name, opacity }: { name: string; opacity: MotionValue<number> }) {
  const [ok, setOk] = useState(true)
  if (!ok) return null
  return <motion.img style={{ opacity }} src={art(name)} alt="" aria-hidden="true" onError={() => setOk(false)} className="absolute inset-0 h-full w-full object-cover" />
}

export function LightFilm() {
  const reduce = useReducedMotion()
  const fits = useFits(560)
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // Ease the scroll so wheel notches glide instead of stepping.
  const p = useSpring(raw, { stiffness: 140, damping: 28, mass: 0.35, restDelta: 0.0005 })
  const photo = useTransform(p, [0.38, 0.45, 0.58, 0.64], [0, 0.85, 0.85, 0])
  const photoScale = useTransform(p, [0.38, 0.64], [1.12, 1])
  const dawn = useTransform(p, [0.74, 0.84], [0, 1])
  const finalOpacity = useTransform(p, [0.77, 0.84], [0, 1])
  const finalY = useTransform(p, [0.77, 0.86], [28, 0])
  const hint = useTransform(p, [0, 0.08], [1, 0])
  const s1 = useTransform(p, [0, 0.16, 0.23], [0.75, 0.75, 0])
  const s2 = useTransform(p, [0.15, 0.22, 0.38, 0.44], [0, 0.6, 0.6, 0])
  const s4 = useTransform(p, [0.57, 0.64, 0.76, 0.82], [0, 0.35, 0.35, 0])
  const s5 = useTransform(p, [0.75, 0.86], [0, 0.85])

  if (reduce || !fits) return <StaticLightFilm />

  return (
    <section ref={ref} className="relative h-[340vh] bg-night" aria-label="One Light to a City: the story of Saint Paul’s">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-night text-white">
        <ArtLayer name="spbc-s1-lamp" opacity={s1} />
        <ArtLayer name="spbc-s2-street" opacity={s2} />
        <motion.div style={{ opacity: photo, scale: photoScale }} className="absolute inset-0">
          <Photo name="worship-lights" className="absolute inset-0" />
        </motion.div>
        <ArtLayer name="spbc-s4-branches" opacity={s4} />
        {/* Dawn sky */}
        <motion.div style={{ opacity: dawn }} className="absolute inset-0 bg-[linear-gradient(to_bottom,#2a1840_0%,#7a3b5a_22%,#f3801f_46%,#ffd7a3_56%,#2f4a33_57%,#0f2419_100%)]" />
        <ArtLayer name="spbc-s5-dawn" opacity={s5} />
        <LightCanvas p={p} />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(18,18,18,0.75)_0%,rgba(18,18,18,0.2)_34%,rgba(18,18,18,0)_50%,rgba(18,18,18,0.35)_100%)]" />
        <StageLabels p={p} />
        <div className="absolute inset-x-0 top-[max(6rem,13vh)]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 relative min-h-[40vh]">
            {beats.map((b, i) => <Beat key={b.title} p={p} b={b} i={i} />)}
          </div>
        </div>
        <motion.div style={{ opacity: finalOpacity, y: finalY }} className="absolute inset-x-0 top-[max(6rem,13vh)]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Eyebrow light>The City of Possibility</Eyebrow>
            <h2 className="mt-3 font-display font-bold tracking-[-0.025em] leading-[1.02] text-white drop-shadow-[0_2px_22px_rgba(0,0,0,0.6)] max-w-4xl" style={{ fontSize: 'clamp(2.2rem, calc(4.6vh + 1.2rem), 5rem)' }}>With God all things are possible.</h2>
            <p className="mt-2 font-serif italic text-2xl text-glow">{church.scriptureRef}</p>
            <p className="mt-4 max-w-xl text-white text-xl leading-relaxed drop-shadow-[0_1px_10px_rgba(0,0,0,0.7)]">The church that began with one lamp is dreaming of 321 acres in Eastern Henrico: homes, gardens and gathering places, open to everyone.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryButton to="/city-of-possibility" icon={<ArrowRight size={18} />}>Follow the progress</PrimaryButton>
              <Link to="/our-story" className="inline-flex items-center gap-2 rounded-full border-2 border-white/50 px-6 min-h-[52px] font-bold text-white hover:bg-white/10">Read our story</Link>
            </div>
          </div>
        </motion.div>
        <motion.p style={{ opacity: hint }} aria-hidden="true" className="absolute left-1/2 -translate-x-1/2 bottom-24 sm:bottom-8 flex flex-col items-center gap-2 font-caps text-[15px] font-semibold tracking-[0.12em] text-white/85"><span>Keep scrolling</span><motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}><ChevronDown size={22} /></motion.span></motion.p>
        <ChapterRail p={p} sectionRef={ref} />
      </div>
    </section>
  )
}

/** Reduced motion and short windows: the same five beats as readable panels. */
export function StaticLightFilm() {
  return (
    <section className="relative bg-night text-white py-20 sm:py-28" aria-label="One Light to a City: the story of Saint Paul’s">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Eyebrow light>One light to a city</Eyebrow>
        <h2 className="mt-4 display text-5xl sm:text-7xl max-w-4xl">From one lamp in 1909 to a City of Possibility.</h2>
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {beats.map((b, i) => (
            <li key={b.title} className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.04] p-6 min-h-[260px]">
              {i === 2 ? <Photo name="worship-lights" className="absolute inset-0 opacity-40" /> : <Art name={['spbc-s1-lamp', 'spbc-s2-street', '', 'spbc-s4-branches'][i] || 'spbc-s1-lamp'} alt="" fallback="night" className="absolute inset-0 opacity-45" />}
              <div className="relative">
                <p className="font-caps font-semibold text-glow">{b.eyebrow}</p>
                <h3 className="mt-2 font-display font-bold text-3xl leading-tight">{b.title}</h3>
                <p className="mt-3 text-white/85">{b.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="relative isolate overflow-hidden mt-10 rounded-3xl bg-[linear-gradient(135deg,#7a3b5a,#f3801f_55%,#ffd7a3)] p-8 sm:p-12 text-ink">
          <Art name="spbc-s5-dawn" alt="" className="absolute inset-0 -z-10 opacity-70" fallback="dawn" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#ffd7a3]/90 via-[#ffd7a3]/60 to-transparent" />
          <p className="font-caps font-semibold">The City of Possibility</p>
          <p className="mt-2 display text-4xl sm:text-6xl">With God all things are possible.</p>
          <p className="mt-2 font-serif italic text-2xl">{church.scriptureRef}</p>
          <div className="mt-6"><Link to="/city-of-possibility" className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-6 min-h-[52px] font-bold">Follow the progress <ArrowRight size={18} /></Link></div>
        </div>
      </div>
    </section>
  )
}
