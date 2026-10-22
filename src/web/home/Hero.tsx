import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, MapPin, PlayCircle, Heart, Navigation } from 'lucide-react'
import { campuses, church } from '@/config/site'
import { links } from '@/config/links'
import { Photo, PrimaryButton, GlassButton } from '../ui'

/**
 * Hero: the church's own photo of the Creighton sanctuary full of lights (real people, real worship).
 * The H1 is the church's tagline. Service times sit directly under the hero (campus bar): the 5-second test.
 */
export function Hero() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1.16])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  return (
    <section ref={ref} className="relative isolate bg-night text-white">
      <div className="relative min-h-[88svh] sm:min-h-[92svh] overflow-hidden flex items-end">
        <motion.div style={reduce ? undefined : { scale, y }} className="absolute inset-0 -z-10">
          <Photo name="worship-lights" eager className="absolute inset-0" imgClassName="object-[50%_40%]" />
        </motion.div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(18,18,18,0.95)_0%,rgba(18,18,18,0.6)_38%,rgba(18,18,18,0.15)_70%,rgba(18,18,18,0.5)_100%)]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_15%_85%,rgba(243,128,31,0.28),transparent_70%)]" />
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 pb-36 sm:pb-40 pt-40">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-2 text-[16px] font-bold text-glow border border-white/20">
            <span className="h-2 w-2 rounded-full bg-orange animate-pulseDot" aria-hidden="true" /> Richmond &amp; Henrico, Virginia · since 1909
          </motion.p>
          <h1 className="mt-6 font-display font-extrabold tracking-[-0.035em] leading-[0.95] text-[3.2rem] sm:text-[5.5rem] lg:text-[7rem] max-w-5xl text-balance">
            <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="block">A church for people</motion.span>
            <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }} className="block">on the <span className="sunrise-text">GROW.</span></motion.span>
          </h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35 }} className="mt-6 max-w-2xl text-xl sm:text-2xl text-white/90 leading-relaxed">
            Two campuses, one church, and a family for every season of life. Come as you are. We saved you a seat.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-8 flex flex-wrap gap-3">
            <PrimaryButton to="/visit" size="lg" icon={<ArrowRight size={20} />}>Plan your visit</PrimaryButton>
            <GlassButton href={links.watchLive.href} size="lg" icon={<PlayCircle size={20} />}>Watch live Sundays 9 AM</GlassButton>
            <GlassButton to="/give" size="lg" icon={<Heart size={18} />} className="hidden md:inline-flex">Give</GlassButton>
          </motion.div>
        </div>
      </div>
      <CampusBar />
    </section>
  )
}

/** Service times, addresses and directions directly under the hero, overlapping its edge. */
export function CampusBar() {
  return (
    <div className="relative z-10 -mt-24 sm:-mt-28 pb-2 bg-gradient-to-b from-transparent via-transparent to-morning">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ul className="grid gap-3 md:grid-cols-3" aria-label="Sunday worship times">
          {campuses.map((c, i) => (
            <motion.li key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.08, duration: 0.6 }} className="rounded-[24px] bg-paper text-ink shadow-lift border border-line p-5 sm:p-6 flex flex-col">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-display font-bold text-xl">{c.name}</p>
                <p className="text-[15px] font-semibold text-stone">Sundays</p>
              </div>
              <p className="mt-1 font-display font-extrabold text-5xl tracking-tight text-grow">{c.time}</p>
              <p className="mt-2 text-stone text-[17px] leading-snug flex-1">{c.street ? <><MapPin size={16} className="inline -mt-1 mr-1 text-ember" />{c.street}, {c.city}</> : 'MySPBC.tv · YouTube · Facebook · SPBC app'}{c.note && <span className="block text-[15px] mt-1">{c.note}</span>}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.street ? (
                  <>
                    <a href={c.directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-grow text-white px-4 min-h-[48px] font-bold text-[16px] hover:bg-canopy"><Navigation size={16} /> Directions</a>
                    <a href={`/visit/${c.id}`} className="inline-flex items-center gap-1.5 rounded-full border-2 border-line px-4 min-h-[48px] font-bold text-[16px] hover:border-grow hover:text-grow">What to expect</a>
                  </>
                ) : (
                  <a href={links.watchLive.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-grow text-white px-4 min-h-[48px] font-bold text-[16px] hover:bg-canopy"><PlayCircle size={16} /> Watch live</a>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
        <p className="mt-4 text-center text-stone text-[17px]">Questions? Call <a href={church.phoneHref} className="font-bold text-grow underline underline-offset-4">{church.phone} {church.phoneWord}</a></p>
      </div>
    </div>
  )
}
