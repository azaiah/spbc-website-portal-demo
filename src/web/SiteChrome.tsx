import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { createPortal } from 'react-dom'
import { Menu, X, Phone, MapPin, Facebook, Instagram, Youtube, ArrowUpRight, LogIn, Heart, PlayCircle, Smartphone, CalendarHeart } from 'lucide-react'
import { SiteLogo, Mark, PoweredBy } from '@/components/Logo'
import { useFocusTrap } from '@/components/useFocusTrap'
import { church, campuses } from '@/config/site'
import { links } from '@/config/links'
import { PrimaryButton, Ext } from './ui'
import { Assistant } from './Assistant'

export const siteNav = [
  { to: '/visit', label: 'Visit' },
  { to: '/our-story', label: 'Our Story' },
  { to: '/life-stages', label: 'Life Stages' },
  { to: '/community', label: 'Community' },
  { to: '/events', label: 'Events' },
  { to: '/watch', label: 'Watch' },
]

function ScrollBar() {
  const { scrollYProgress } = useScroll()
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  return <motion.div aria-hidden="true" style={{ scaleX: x }} className="fixed top-0 inset-x-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-grow via-orange to-glow" />
}

function UtilityBar() {
  return (
    <div className="hidden md:block bg-canopy text-white/90 text-[15px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-11 flex items-center justify-between gap-4">
        <p className="truncate"><span className="font-bold text-white">Sundays</span> · Creighton &amp; Online 9:00 AM · Belt 11:30 AM</p>
        <nav aria-label="Utility" className="flex items-center gap-1 shrink-0">
          <Ext href={links.watchLive.href} className="inline-flex items-center gap-1.5 px-2.5 min-h-[40px] hover:text-glow"><PlayCircle size={16} /> Watch live</Ext>
          <Link to="/prayer" className="inline-flex items-center gap-1.5 px-2.5 min-h-[40px] hover:text-glow">7:14 Prayer</Link>
          <Link to="/app" className="inline-flex items-center gap-1.5 px-2.5 min-h-[40px] hover:text-glow"><Smartphone size={16} /> Get the app</Link>
          <a href={church.phoneHref} className="inline-flex items-center gap-1.5 px-2.5 min-h-[40px] hover:text-glow"><Phone size={15} /> {church.phone}</a>
        </nav>
      </div>
    </div>
  )
}

export function SiteHeader() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, open, () => setOpen(false))
  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    if (!open) return
    const y = window.scrollY
    const b = document.body.style
    const prev = { position: b.position, top: b.top, left: b.left, right: b.right, width: b.width }
    b.position = 'fixed'; b.top = `-${y}px`; b.left = '0'; b.right = '0'; b.width = '100%'
    return () => { b.position = prev.position; b.top = prev.top; b.left = prev.left; b.right = prev.right; b.width = prev.width; window.scrollTo(0, y) }
  }, [open])
  // Pages whose hero is dark (photo, canopy green, stage color) get white header text until the page scrolls.
  const darkHero = pathname === '/' || ['/community', '/city-of-possibility', '/watch', '/app'].includes(pathname) || /^\/life-stages\/[^/]+$/.test(pathname)
  const overPhoto = darkHero && !scrolled
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {!scrolled && <UtilityBar />}
      <div className={`transition-all duration-500 ${scrolled ? 'bg-morning/95 backdrop-blur-xl shadow-[0_1px_0_rgba(23,19,28,0.08)]' : overPhoto ? 'bg-gradient-to-b from-night/70 to-transparent' : 'bg-transparent'}`}>
        <div className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 transition-all duration-500 ${scrolled ? 'h-[72px]' : 'h-20 sm:h-[92px]'}`}>
          <SiteLogo light={overPhoto} compact={scrolled} />
          <nav aria-label="Primary" className="hidden xl:flex items-center gap-1">
            {siteNav.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `relative px-3.5 py-2 text-[17px] font-bold rounded-full min-h-[48px] inline-flex items-center transition-colors ${overPhoto ? (isActive ? 'text-white' : 'text-white/85 hover:text-white') : (isActive ? 'text-grow' : 'text-ink/80 hover:text-grow')}`}>
                {({ isActive }) => <>{l.label}{isActive && <motion.span layoutId="navdot" className="absolute left-1/2 -translate-x-1/2 bottom-1.5 h-1.5 w-1.5 rounded-full bg-orange" />}</>}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className={`inline-flex items-center gap-1.5 rounded-full px-3 sm:px-4 min-h-[48px] text-[16px] font-bold border-2 ${overPhoto ? 'border-white/40 text-white hover:bg-white/10' : 'border-grow/25 text-grow hover:bg-grow hover:text-white'}`}><LogIn size={17} /> Sign in</Link>
            <PrimaryButton to="/give" className="hidden sm:inline-flex !min-h-[48px] !px-6" icon={<Heart size={16} />}>Give</PrimaryButton>
            <button type="button" onClick={() => setOpen(true)} className={`xl:hidden tap inline-flex items-center justify-center rounded-full min-h-[48px] min-w-[48px] ${overPhoto ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-ink/5'}`} aria-label="Open menu" aria-expanded={open}><Menu size={28} /></button>
          </div>
        </div>
      </div>
      {createPortal(<AnimatePresence>
        {open && (
          <motion.div ref={ref} role="dialog" aria-modal="true" aria-label="Menu" tabIndex={-1} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="fixed inset-0 z-[90] bg-morning text-ink overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-20 opacity-[0.06]"><Mark size={420} /></div>
            <div className="relative flex items-center justify-between px-4 sm:px-6 h-20">
              <SiteLogo />
              <button type="button" onClick={() => setOpen(false)} className="tap inline-flex items-center justify-center rounded-full hover:bg-ink/5 min-h-[48px] min-w-[48px]" aria-label="Close menu"><X size={28} /></button>
            </div>
            <nav aria-label="Mobile" className="relative px-6 pt-2">
              <ul>
                {[{ to: '/', label: 'Home' }, ...siteNav, { to: '/grow', label: 'Grow' }, { to: '/give', label: 'Give' }, { to: '/prayer', label: 'Prayer' }, { to: '/contact', label: 'Contact' }].map((l, i) => (
                  <motion.li key={l.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 + i * 0.035, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
                    <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => `flex items-center min-h-[56px] font-display font-bold text-[2.1rem] leading-tight tracking-tight ${isActive ? 'text-grow' : 'text-ink hover:text-grow'}`}>{l.label}</NavLink>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="relative px-6 py-8 mt-4 border-t border-line grid gap-2 text-stone">
              {campuses.filter((c) => c.street).map((c) => (
                <a key={c.id} href={c.directionsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 min-h-[48px] hover:text-grow"><MapPin size={18} className="text-ember mt-1 shrink-0" /><span><b className="text-ink">{c.name} · {c.time}</b><br />{c.street}, {c.city}</span></a>
              ))}
              <a href={church.phoneHref} className="flex items-center gap-2 min-h-[48px] hover:text-grow"><Phone size={18} className="text-ember" /> {church.phone} {church.phoneWord}</a>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <PrimaryButton to="/give" icon={<Heart size={16} />}>Give</PrimaryButton>
                <Ext href={links.memberLogin.href} className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-grow/30 text-grow min-h-[52px] font-bold hover:bg-grow hover:text-white"><LogIn size={16} /> Sign in</Ext>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </header>
  )
}

/** Phones: a sticky bar with the two jobs that matter most (Fitts's law). */
function MobileActionBar() {
  const { pathname } = useLocation()
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > 500)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  if (pathname === '/give' || pathname === '/visit') return null
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 90 }} animate={{ y: 0 }} exit={{ y: 90 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-morning/95 backdrop-blur border-t border-line px-3 py-2.5 grid grid-cols-2 gap-2" style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}>
          <Link to="/visit" className="inline-flex items-center justify-center gap-2 rounded-full bg-grow text-white font-bold min-h-[52px]"><CalendarHeart size={18} /> Plan a visit</Link>
          <Link to="/give" className="inline-flex items-center justify-center gap-2 rounded-full bg-orange text-ink font-bold min-h-[52px]"><Heart size={18} /> Give</Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative overflow-hidden bg-canopy text-white">
      <div aria-hidden="true" className="absolute -right-32 -bottom-24 opacity-[0.07]"><Mark size={560} light /></div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-28 sm:pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <img src="/images/church/spbc-logo-white.svg" alt="The Saint Paul’s Baptist Church" width={260} height={67} className="h-auto w-[240px]" />
            <p className="mt-6 font-display font-bold text-3xl leading-tight max-w-sm">A church for people on the <span className="text-glow">GROW</span>.</p>
            <p className="mt-3 text-white/80 max-w-sm">{church.mission}</p>
            <div className="mt-7 flex gap-2">
              {[{ h: church.facebook, l: 'Saint Paul’s on Facebook', i: <Facebook size={20} /> }, { h: church.instagram, l: 'Saint Paul’s on Instagram', i: <Instagram size={20} /> }, { h: church.youtube, l: 'Saint Paul’s on YouTube', i: <Youtube size={20} /> }].map((s) => (
                <a key={s.h} href={s.h} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full border-2 border-white/25 h-12 w-12 hover:border-glow hover:text-glow" aria-label={s.l}>{s.i}</a>
              ))}
            </div>
          </div>
          {campuses.map((c) => (
            <div key={c.id}>
              <p className="font-display font-bold text-xl text-glow">{c.name}</p>
              <p className="mt-2 text-white/90"><b className="text-white text-2xl font-display">{c.time}</b> Sundays{c.note && <span className="block text-white/70 text-[16px]">{c.note}</span>}</p>
              {c.street ? (
                <a href={c.directionsUrl} target="_blank" rel="noopener noreferrer" className="mt-3 block text-white/85 hover:text-white min-h-[44px]">{c.street}<br />{c.city} {c.zip}<span className="block text-glow text-[16px] font-bold mt-1">Get directions →</span></a>
              ) : (
                <a href={links.watchLive.href} target="_blank" rel="noopener noreferrer" className="mt-3 block text-white/85 hover:text-white min-h-[44px]">MySPBC.tv, YouTube, Facebook and the SPBC app<span className="block text-glow text-[16px] font-bold mt-1">Watch live →</span></a>
              )}
            </div>
          ))}
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 border-t border-white/15 pt-10">
          {[
            ['Visit', [['/visit', 'Plan a visit'], ['/visit/creighton', 'Creighton Campus'], ['/visit/belt', 'Belt Campus'], ['/watch', 'Watch online']]],
            ['Grow', [['/life-stages', 'Life Stages'], ['/grow', 'THE BRIDGE & groups'], ['/serve', 'Serve'], ['/next-steps', 'Next steps']]],
            ['Community', [['/community', 'Outreach'], ['/community/get-help', 'Get help'], ['/city-of-possibility', 'City of Possibility'], ['/events', 'Events']]],
            ['Connect', [['/give', 'Give'], ['/prayer', 'Prayer'], ['/our-story', 'Our story'], ['/contact', 'Contact']]],
          ].map(([h, items]) => (
            <div key={h as string}>
              <p className="font-display font-bold text-lg">{h as string}</p>
              <ul className="mt-3">{(items as string[][]).map(([to, l]) => <li key={to}><Link to={to} className="hit text-white/85 hover:text-glow">{l}</Link></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-3xl border border-white/15 bg-white/[0.06] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <p className="font-display font-bold text-2xl">Saint Paul’s Everywhere</p>
            <p className="text-white/80 mt-1">Your groups, events, giving and prayer requests. One church, wherever you are.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/app" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/40 font-bold px-6 min-h-[52px] hover:bg-white/10"><Smartphone size={18} /> Get the app</Link>
            <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-canopy font-bold px-6 min-h-[52px] hover:bg-glow">Sign in <ArrowUpRight size={18} /></Link>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/15 flex flex-col md:flex-row gap-4 md:items-center justify-between text-[16px] text-white/70">
          <p>&copy; {year} {church.name}. <a href={church.phoneHref} className="hover:text-white">{church.phone} {church.phoneWord}</a></p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <Link to="/privacy" className="hit hover:text-white">Privacy</Link>
            <Link to="/terms" className="hit hover:text-white">Terms</Link>
            <a href="https://church-connect-dataisdata.netlify.app/" target="_blank" rel="noopener noreferrer" className="hit"><PoweredBy light /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-morning">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-orange focus:px-5 focus:py-3 focus:text-ink focus:font-bold">Skip to content</a>
      <ScrollBar />
      <SiteHeader />
      <main id="main" className="flex-1"><Outlet /></main>
      <SiteFooter />
      <MobileActionBar />
      <Assistant />
    </div>
  )
}
