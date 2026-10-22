import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Routes, Route, NavLink, Link, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Heart, CalendarDays, Users, Bell, UserCircle, LogOut, HandHeart, BookOpen, Globe, LayoutGrid, X, Compass, Sprout, MoreHorizontal } from 'lucide-react'
import { Tour, useFirstVisitTour, type TourStep } from '@/components/Tour'
import { useDemo } from '@/data/store'
import { PoweredBy, Mark } from '@/components/Logo'
import { accountById } from '@/config/accounts'
import { church } from '@/config/site'
import { PortalHome } from './PortalHome'
import { PortalGiving } from './PortalGiving'
import { PortalEvents } from './PortalEvents'
import { PortalGroups } from './PortalGroups'
import { PortalProfile } from './PortalProfile'
import { PortalCare } from './PortalCare'

const portalTips: Record<string, { title: string; text: string }> = {
  '/portal': { title: 'Your overview', text: 'One screen with your giving this year, events you registered for, your ministries and any prayer requests you have shared. Everything here is yours alone.' },
  '/portal/giving': { title: 'Giving history', text: 'Every gift by month and by fund. Download your annual statement for tax time with one click. Only you and the finance team can see these numbers.' },
  '/portal/events': { title: 'My events', text: 'Everything you registered for on the church website. Cancel a seat here if plans change; the church office sees the update immediately.' },
  '/portal/groups': { title: 'My ministries', text: 'The ministries you serve with, when they meet and open serving spots. Join or leave here and the leader is notified.' },
  '/portal/care': { title: 'Prayer and care', text: 'Requests you have shared and where they stand. Private requests are seen only by the pastors.' },
  '/portal/profile': { title: 'Profile and permissions', text: 'Keep your contact details current and choose whether the church may email or text you. Changes apply right away.' },
}
const TIP_KEY = 'spbc-portal-guide'

const items = [
  { to: '/portal', label: 'Overview', short: 'Home', icon: LayoutDashboard, end: true, tour: 'home' },
  { to: '/portal/giving', label: 'Giving', short: 'Giving', icon: Heart, tour: 'giving' },
  { to: '/portal/events', label: 'My events', short: 'Events', icon: CalendarDays, tour: 'events' },
  { to: '/portal/groups', label: 'My ministries', short: 'Ministries', icon: Users, tour: 'groups' },
  { to: '/portal/care', label: 'Prayer & care', short: 'Prayer', icon: HandHeart, tour: 'care' },
  { to: '/portal/profile', label: 'Profile', short: 'Profile', icon: UserCircle, tour: 'profile' },
]
/** Phone tab bar: the four most-used places plus More (the full menu). */
const bottom = items.filter((x) => ['home', 'events', 'giving', 'care'].includes(x.tour))

/** The member tour: where everything is, in plain words. */
const memberTour = (first: string): TourStep[] => [
  { icon: <Compass size={22} />, title: `Welcome, ${first}!`, body: <>This is <b>Saint Paul’s Everywhere</b>, your own page at church. This short tour shows you where everything is. It takes about a minute, and you can’t break anything.</> },
  { target: 'stage', icon: <Sprout size={22} />, title: 'Your life stage', body: 'This card shows your life stage, your Life Stage Pastor and when your Bible study meets. It updates on its own as the seasons of life change.' },
  { target: ['portal-nav', 'portal-bottom'], icon: <LayoutDashboard size={22} />, title: 'Getting around', body: 'These buttons take you to each part of your portal. Tap one to go there. The one you are on is highlighted.' },
  { target: ['nav-events', 'bottom-events'], icon: <CalendarDays size={22} />, title: 'Your events', body: 'Everything you have signed up for is here. When you tap Register on the church website, it lands here. You can cancel a seat if plans change.' },
  { target: ['nav-giving', 'bottom-giving'], icon: <Heart size={22} />, title: 'Your giving', body: 'See every gift you have made, by month and by fund, and download your year-end statement for taxes with one tap.' },
  { target: ['nav-care', 'bottom-care'], icon: <HandHeart size={22} />, title: 'Prayer and care', body: 'Share a prayer request and see when a pastor has followed up. Private requests are seen only by the pastors.' },
  { target: ['nav-profile', 'portal-more'], icon: <UserCircle size={22} />, title: 'Your profile', body: 'Update your phone, email and address, and choose whether the church may email or text you. On a phone, it’s under More.' },
  { target: 'guide', icon: <BookOpen size={22} />, title: 'Help on every page', body: 'Turn the Guide on to see a short yellow note at the top of each page explaining what it’s for.' },
  { target: 'tour-btn', icon: <Compass size={22} />, title: 'Need this again?', body: 'Tap Tour any time to watch this walkthrough again. When you are finished, use Sign out at the top.' },
]

function PortalShell() {
  const { state, signOut } = useDemo()
  const nav = useNavigate()
  const loc = useLocation()
  const me = state.members.find((m) => m.id === state.currentMemberId)
  const acct = accountById(state.accountId)
  const staff = state.role !== 'member'
  const [guide, setGuide] = useState(() => { try { return localStorage.getItem(TIP_KEY) !== '0' } catch { return true } })
  const toggleGuide = () => { const v = !guide; setGuide(v); try { localStorage.setItem(TIP_KEY, v ? '1' : '0') } catch { /* noop */ } }
  const [menu, setMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useEffect(() => { setMenu(false) }, [loc.pathname])
  useEffect(() => {
    if (!menu) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false) }
    document.addEventListener('keydown', onKey)
    menuRef.current?.focus()
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey) }
  }, [menu])
  const tip = portalTips[loc.pathname] ?? portalTips['/portal']
  const tour = useFirstVisitTour('spbc-tour-member')
  const startTour = () => { if (loc.pathname !== '/portal') nav('/portal'); setMenu(false); window.setTimeout(tour.start, 250) }
  const first = (me?.first ?? acct?.name.split(' ')[0] ?? 'friend').replace(/\.+$/, '')
  return (
    <div className="min-h-screen bg-linen flex flex-col">
      <header className="relative isolate overflow-hidden bg-midnight text-white grain">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight via-midnight/85 to-plum/60" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-2.5 min-h-[44px]"><Mark size={32} light /><span className="leading-none"><span className="block font-display font-bold text-lg">Saint Paul’s Everywhere</span><span className="block font-caps text-[13px] font-semibold text-glow mt-0.5">Member portal</span></span></Link>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button type="button" data-tour="tour-btn" onClick={startTour} className="tap inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3 text-sm font-medium text-white hover:bg-white/10" title="Show me around"><Compass size={16} /> <span className="hidden sm:inline">Tour</span><span className="sr-only sm:hidden">Tour</span></button>
            <button type="button" data-tour="guide" onClick={toggleGuide} aria-pressed={guide} className={`tap inline-flex items-center gap-1.5 rounded-full border px-3 text-sm font-medium ${guide ? 'bg-gold-bright text-midnight border-gold-bright' : 'border-white/25 text-white/80'}`} title="Simple explanations on every page"><BookOpen size={16} /> <span className="hidden sm:inline">Guide {guide ? 'on' : 'off'}</span></button>
            {staff && <Link to={acct?.home.startsWith('/admin') ? acct.home : '/admin'} className="tap hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3 text-sm hover:bg-white/10"><LayoutGrid size={16} /> Staff hub</Link>}
            <Link to="/" className="tap hidden md:inline-flex items-center gap-1.5 rounded-full px-3 text-sm text-white/80 hover:bg-white/10"><Globe size={16} /> Website</Link>
            <button type="button" onClick={() => { signOut(); nav('/login') }} className="tap hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 text-sm text-white/80 hover:bg-white/10"><LogOut size={16} /> Sign out</button>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 pb-10 sm:pt-8 sm:pb-14 flex items-end justify-between gap-6">
          <div>
            <p className="font-caps text-[13px] tracking-[0.28em] text-gold-light">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <h1 className="display text-4xl sm:text-5xl mt-2">Welcome home, {first}.</h1>
            <p className="mt-2 text-white/70 max-w-xl text-sm sm:text-base">“{church.scripture}” {church.scriptureRef}</p>
          </div>
          <span className="hidden sm:grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-b from-[#E8CC85] to-gold-bright text-midnight font-display text-2xl font-semibold glow-gold">{me ? `${me.first[0]}${me.last[0]}` : 'NL'}</span>
        </div>
      </header>
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 -mt-6 pb-10 flex-1 grid gap-6 lg:gap-8 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Portal" data-tour="portal-nav" className="hidden lg:block lg:sticky lg:top-6 self-start rounded-3xl bg-paper border border-line shadow-card p-2">
          <ul className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">
            {items.map((it) => (
              <li key={it.to} className="shrink-0"><NavLink to={it.to} end={it.end} data-tour={`nav-${it.tour}`} className={({ isActive }) => `flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm font-medium min-h-[44px] whitespace-nowrap transition ${isActive ? 'bg-plum text-white shadow-lift' : 'text-slate hover:bg-linen hover:text-midnight'}`}><it.icon size={17} /> {it.label}</NavLink></li>
            ))}
          </ul>
          <div className="hidden lg:block mt-2 rounded-2xl bg-linen p-3 text-xs text-slate">
            <p className="flex items-center gap-1.5 font-medium text-midnight"><Bell size={13} className="text-gold" /> {state.announcements.filter((a) => a.status === 'sent' || a.status === 'approved').length} announcements</p>
            <p className="mt-1">Sample data stored in this browser.</p>
          </div>
        </nav>
        <main id="main" className="min-w-0 lg:pt-6 pb-24 lg:pb-0">
          {staff && <p className="mb-4 rounded-2xl bg-royal-50 border border-plum/15 px-4 py-3 text-sm text-plum">You are viewing the member portal as {acct?.name}. Leaders’ giving and care records are never invented in this demo, so some lists may be empty. Sign in as the sample member, Angela Brooks, to see a full portal.</p>}
          {guide && <div className="mb-5 rounded-2xl border border-gold-bright/50 bg-gold-50 p-4 flex gap-3"><BookOpen size={18} className="text-gold shrink-0 mt-0.5" /><div><p className="font-semibold text-sm">{tip.title}</p><p className="text-sm text-slate mt-0.5 leading-relaxed">{tip.text}</p></div></div>}
          <Outlet />
        </main>
      </div>
      {createPortal(
        <AnimatePresence>
          {menu && (
            <motion.div key="portal-menu" className="fixed inset-0 z-[200]" role="dialog" aria-modal="true" aria-label="Portal menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="absolute inset-0 bg-midnight/70 backdrop-blur-sm" onClick={() => setMenu(false)} aria-hidden="true" />
              <motion.div ref={menuRef} tabIndex={-1} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 380, damping: 38 }} className="absolute right-0 top-0 h-full w-[min(22rem,92vw)] bg-gradient-to-b from-midnight via-midnight to-plum text-white shadow-2xl flex flex-col outline-none overflow-y-auto">
                <div className="flex items-center justify-between px-5 h-16 shrink-0 border-b border-white/10">
                  <span className="font-caps font-semibold text-glow">Saint Paul’s Everywhere</span>
                  <button type="button" onClick={() => setMenu(false)} aria-label="Close menu" className="tap inline-flex items-center justify-center rounded-full hover:bg-white/10"><X size={22} /></button>
                </div>
                <nav aria-label="Portal menu" className="flex-1 p-4">
                  <ul className="space-y-1">
                    {items.map((it) => (
                      <li key={it.to}><NavLink to={it.to} end={it.end} onClick={() => setMenu(false)} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 min-h-[52px] text-base font-medium transition ${isActive ? 'bg-orange text-ink shadow-glow' : 'text-white/85 hover:bg-white/10'}`}><it.icon size={19} /> {it.label}</NavLink></li>
                    ))}
                  </ul>
                  <div className="mt-5 pt-4 border-t border-white/10 space-y-1">
                    {staff && <Link to={acct?.home.startsWith('/admin') ? acct.home : '/admin'} onClick={() => setMenu(false)} className="flex items-center gap-3 rounded-2xl px-4 min-h-[48px] text-white/80 hover:bg-white/10"><LayoutGrid size={18} /> Staff hub</Link>}
                    <button type="button" onClick={startTour} className="w-full flex items-center gap-3 rounded-2xl px-4 min-h-[48px] text-left text-white/80 hover:bg-white/10"><Compass size={18} /> Take the tour</button>
                    <Link to="/" onClick={() => setMenu(false)} className="flex items-center gap-3 rounded-2xl px-4 min-h-[48px] text-white/80 hover:bg-white/10"><Globe size={18} /> Church website</Link>
                    <button type="button" onClick={() => { setMenu(false); signOut(); nav('/login') }} className="w-full flex items-center gap-3 rounded-2xl px-4 min-h-[48px] text-left text-white/80 hover:bg-white/10"><LogOut size={18} /> Sign out</button>
                  </div>
                </nav>
                <p className="px-5 pb-5 text-xs text-white/45">Sample data stored in this browser.</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
      <nav aria-label="Portal sections" data-tour="portal-bottom" className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-paper/95 backdrop-blur border-t border-line pb-[env(safe-area-inset-bottom)]">
        <ul className="grid grid-cols-5">
          {bottom.map((it) => (
            <li key={it.to}><NavLink to={it.to} end={it.end} data-tour={`bottom-${it.tour}`} className={({ isActive }) => `flex flex-col items-center justify-center gap-0.5 min-h-[60px] text-[13px] font-semibold ${isActive ? 'text-plum' : 'text-slate'}`}>{({ isActive }) => <><span className={`grid place-items-center h-8 w-12 rounded-full ${isActive ? 'bg-royal-50' : ''}`}><it.icon size={20} /></span>{it.short}</>}</NavLink></li>
          ))}
          <li><button type="button" data-tour="portal-more" onClick={() => setMenu(true)} className="w-full flex flex-col items-center justify-center gap-0.5 min-h-[60px] text-[13px] font-semibold text-slate"><span className="grid place-items-center h-8 w-12 rounded-full"><MoreHorizontal size={20} /></span>More</button></li>
        </ul>
      </nav>
      <Tour steps={memberTour(first)} open={tour.open} onClose={tour.close} label="Member tour" />
      <footer className="border-t border-line bg-paper pb-20 lg:pb-0">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate">
          <span>{church.name} · Creighton: 4247 Creighton Rd, Henrico · Belt: 700 E. Belt Blvd, Richmond</span>
          <PoweredBy />
        </div>
      </footer>
    </div>
  )
}

function RequireSignIn() {
  const { state } = useDemo()
  const loc = useLocation()
  if (!state.entered) return <Navigate to={`/login?next=${encodeURIComponent(loc.pathname + loc.search)}`} replace />
  return <PortalShell />
}

export default function PortalApp() {
  return (
    <Routes>
      <Route element={<RequireSignIn />}>
        <Route index element={<PortalHome />} />
        <Route path="giving" element={<PortalGiving />} />
        <Route path="events" element={<PortalEvents />} />
        <Route path="groups" element={<PortalGroups />} />
        <Route path="care" element={<PortalCare />} />
        <Route path="profile" element={<PortalProfile />} />
        <Route path="*" element={<PortalHome />} />
      </Route>
    </Routes>
  )
}
