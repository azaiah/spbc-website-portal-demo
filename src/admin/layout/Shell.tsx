import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, MoreHorizontal, RotateCcw, X, Database, Search, Globe, ShieldCheck, LogOut, Compass, LayoutDashboard, AlertCircle, UserRound } from 'lucide-react'
import { Tour, useFirstVisitTour, type TourStep } from '@/components/Tour'
import { Logo } from '@/components/Logo'
import { Modal } from '@/components/Modal'
import { Button } from '@/components/Button'
import { useFocusTrap } from '@/components/useFocusTrap'
import { useDemo } from '@/data/store'
import { navForRole, roleMeta, groupLabels } from '../nav'
import { accountById, demoAccounts } from '@/config/accounts'
import { GlobalSearch } from './GlobalSearch'
import { GuidePanel } from './GuidePanel'
import { BookOpen } from 'lucide-react'

const initialsOf = (n: string) => n.replace(/(Rev\.|Dr\.|Deacon|Min\.)\s*/g, '').split(/\s+/).filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]).slice(0, 2).join('') || 'SP'

function AccountSwitcher() {
  const { state, signIn, signOut } = useDemo()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const me = accountById(state.accountId)
  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc); document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [open])
  return (
    <div ref={ref} className="relative min-w-0">
      <button type="button" data-tour="staff-account" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open} className="tap inline-flex items-center gap-2 rounded-full border border-line bg-paper pl-1 pr-2.5 text-sm font-medium hover:border-slate max-w-[44vw] sm:max-w-[16rem]">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-midnight text-gold-light text-xs font-semibold">{initialsOf(me?.name ?? 'NL')}</span>
        <span className="min-w-0 text-left leading-tight hidden sm:block"><span className="block truncate">{me?.name ?? roleMeta[state.role].label}</span><span className="block truncate text-[13px] text-slate font-normal">{roleMeta[state.role].label}</span></span>
        <ChevronDown size={14} className="shrink-0" />
      </button>
      {open && (
        <div role="menu" className="fixed sm:absolute right-3 sm:right-0 top-14 sm:top-auto mt-1 w-[min(21rem,calc(100vw-1.5rem))] max-h-[75vh] overflow-y-auto rounded-2xl border border-line bg-paper shadow-lift z-50 py-2">
          {me && <div className="px-4 pb-3 mb-1 border-b border-line"><p className="font-semibold">{me.name}</p><p className="text-xs text-slate">{me.title}</p><p className="text-xs text-slate truncate">{me.email}</p></div>}
          <p className="px-4 pt-1 pb-1 font-caps text-[13px] tracking-[0.22em] text-gold flex items-center gap-1.5"><ShieldCheck size={12} /> Demo: switch account</p>
          {demoAccounts.filter((a) => a.id !== state.accountId).map((a) => (
            <button key={a.id} type="button" role="menuitem" onClick={() => { signIn(a.id); setOpen(false); nav(a.home) }} className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-royal-50">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-parchment text-[13px] font-semibold text-plum">{initialsOf(a.name)}</span>
              <span className="min-w-0"><span className="block text-sm truncate">{a.name}{a.sample && <span className="ml-1 text-[13px] uppercase tracking-wider text-slate">sample</span>}</span><span className="block text-xs text-slate truncate">{a.title}</span></span>
            </button>
          ))}
          <div className="border-t border-line mt-1 pt-1">
            <button type="button" role="menuitem" onClick={() => { signOut(); setOpen(false); nav('/login') }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-danger hover:bg-danger/5"><LogOut size={16} /> Sign out</button>
          </div>
        </div>
      )}
    </div>
  )
}

function GuideToggle() {
  const { state, set } = useDemo()
  const on = state.settings.guideOn
  return (
    <button type="button" data-tour="staff-guide" onClick={() => set('settings', { ...state.settings, guideOn: !on, tourDone: true })} aria-pressed={on} className={`tap inline-flex items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium ${on ? 'bg-gold text-white border-gold' : 'border-line bg-paper text-slate hover:border-slate'}`} title="Plain-language walkthroughs on every page">
      <BookOpen size={16} /> <span className="hidden md:inline">Guide {on ? 'on' : 'off'}</span>
    </button>
  )
}

function ResetButton() {
  const { reset } = useDemo()
  const [open, setOpen] = useState(false)
  const nav = useNavigate()
  return (
    <>
      <button type="button" data-tour="staff-reset" onClick={() => setOpen(true)} className="tap inline-flex items-center gap-1.5 rounded-lg px-2 text-sm text-slate hover:bg-midnight/5" title="Reset demo"><RotateCcw size={16} /> <span className="hidden lg:inline">Reset</span></button>
      <Modal open={open} onClose={() => setOpen(false)} title="Reset the demo?" size="sm" footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button variant="danger" onClick={() => { reset(); setOpen(false); nav('/admin') }}>Reset to sample data</Button></>}>
        <p className="text-sm text-slate">Everything changed in this browser (across the church website, member portal and admin) is replaced with the original sample data for The Saint Paul’s Baptist Church. You stay signed in.</p>
      </Modal>
    </>
  )
}

/** The staff tour: the layout of the hub in plain words. */
const staffTour: TourStep[] = [
  { icon: <Compass size={22} />, title: 'Welcome to the staff hub', body: <>This is where Saint Paul’s runs both campuses from one place. This short tour shows you where everything is. Nothing you click in this preview affects real records.</> },
  { target: 'dash-numbers', icon: <LayoutDashboard size={22} />, title: 'The big numbers', body: 'Members, giving this month, open requests and upcoming events. Tap any box to open the tool behind it.' },
  { target: 'dash-attention', icon: <AlertCircle size={22} />, title: 'What needs you', body: 'Anything waiting on a person shows up here: first-time guests to call, approvals, drafts to review. Work down this list and you are caught up.' },
  { target: ['staff-nav', 'staff-bottom'], icon: <LayoutDashboard size={22} />, title: 'Every tool, one menu', body: 'Members, Finance, Events, Outreach, the Grant Advisor and more. On a phone, the main ones are at the bottom and the rest are under More. You only see the tools your role uses.' },
  { target: 'staff-search', icon: <Search size={22} />, title: 'Find anything', body: 'Search for a person, an event or a request by name. On a computer you can also press Ctrl and K.' },
  { target: 'staff-guide', icon: <BookOpen size={22} />, title: 'A guide on every page', body: 'With the Guide on, each page starts with a short explanation, who usually owns it and step-by-step instructions. Leave it on while you learn.' },
  { target: 'staff-account', icon: <UserRound size={22} />, title: 'See it as someone else', body: 'In this preview you can switch to another person, like a Life Stage Pastor or the finance office, to see exactly what they would see.' },
  { target: 'staff-reset', icon: <RotateCcw size={22} />, title: 'Start fresh any time', body: 'Reset puts all the sample data back the way it was. Try anything; you can always undo it here.' },
  { target: 'staff-tour', icon: <Compass size={22} />, title: 'Need this again?', body: 'Tap Tour any time to watch this walkthrough again.' },
]

export function Shell({ children }: { children: ReactNode }) {
  const { state, storageOk } = useDemo()
  const items = navForRole(state.role)
  const location = useLocation()
  const [more, setMore] = useState(false)
  const [search, setSearch] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)
  useFocusTrap(moreRef, more, () => setMore(false))
  useEffect(() => setMore(false), [location])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearch(true) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  const nav = useNavigate()
  const tour = useFirstVisitTour('spbc-tour-staff')
  const startTour = () => { if (location.pathname !== '/admin') nav('/admin'); window.setTimeout(tour.start, 300) }
  const primary = items.slice(0, 4)
  const rest = items.slice(4)
  const isActive = (to: string) => (to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(to))

  return (
    <div className="min-h-screen bg-linen flex">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-gradient-to-b from-midnight via-midnight to-plum text-white dark-scroll sticky top-0 h-screen overflow-y-auto">
        <div className="px-5 py-5 border-b border-white/10">
          <Logo light size="sm" to="/admin" />
          <p className="mt-3 font-mono text-[13px] uppercase tracking-[0.16em] text-white/50 truncate">{state.church.name}</p>
        </div>
        <nav aria-label="Admin" data-tour="staff-nav" className="flex-1 p-3">
          {(['main', 'people', 'ops', 'growth', 'more'] as const).map((g) => {
            const group = items.filter((i) => i.group === g)
            if (!group.length) return null
            return (
              <div key={g} className="mb-3">
                {groupLabels[g] && <p className="px-3 pt-2 pb-1 font-mono text-[13px] uppercase tracking-[0.16em] text-white/40">{groupLabels[g]}</p>}
                {group.map((it) => (
                  <NavLink key={it.to} to={it.to} end={it.to === '/admin'} className={({ isActive: a }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm min-h-[40px] ${a ? 'bg-gradient-to-r from-[#E8CC85] to-gold-bright text-midnight font-semibold shadow-[0_6px_24px_-8px_rgba(201,162,75,0.7)]' : 'text-white/80 hover:bg-white/10'}`}><it.icon size={17} /> {it.label}</NavLink>
                ))}
              </div>
            )
          })}
        </nav>
        <div className="p-4 border-t border-white/10 text-xs text-white/50 space-y-1.5">
          <p className="flex items-center gap-1.5"><Database size={12} /> {storageOk ? 'Sample data, stored in this browser' : 'Storage unavailable, changes are in memory'}</p>
          <Link to="/" className="flex items-center gap-1.5 hover:text-white"><Globe size={12} /> Open the church website</Link>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-40 bg-linen/95 backdrop-blur border-b border-line">
          <div className="flex items-center gap-2 px-3 sm:px-5 h-14">
            <div className="lg:hidden shrink-0"><Logo compact size="sm" to="/admin" /></div>
            <button type="button" data-tour="staff-search" onClick={() => setSearch(true)} className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-line bg-paper px-3 min-h-[40px] text-sm text-slate hover:border-slate w-44 md:w-56 xl:w-[23rem] min-w-0 whitespace-nowrap"><Search size={15} className="shrink-0" /> <span className="truncate"><span className="xl:hidden">Search</span><span className="hidden xl:inline">Search members, events, requests</span></span> <kbd className="ml-auto hidden lg:inline font-mono text-[13px] border border-line rounded px-1 shrink-0">Ctrl K</kbd></button>
            <button type="button" data-tour="staff-search" onClick={() => setSearch(true)} className="sm:hidden tap inline-flex items-center justify-center rounded-lg hover:bg-midnight/5" aria-label="Search"><Search size={18} /></button>
            <div className="ml-auto flex min-w-0 items-center gap-1 sm:gap-2">
              <button type="button" data-tour="staff-tour" onClick={startTour} className="tap inline-flex items-center gap-1.5 rounded-lg border border-line bg-paper px-2.5 text-sm font-medium text-midnight hover:border-slate" title="Show me around"><Compass size={16} /> <span className="hidden md:inline">Tour</span><span className="sr-only md:hidden">Tour</span></button>
              <GuideToggle />
              <AccountSwitcher />
              <ResetButton />
              <Link to="/" className="tap hidden md:inline-flex items-center gap-1 rounded-lg px-2 text-sm text-slate hover:bg-midnight/5" title="Church website"><Globe size={16} /> <span className="hidden xl:inline">Website</span></Link>
            </div>
          </div>
        </header>

        <main id="main" className="flex-1 px-3 sm:px-5 py-4 sm:py-6 pb-24 lg:pb-8 max-w-[1400px] w-full mx-auto"><GuidePanel />{children}</main>

        <nav aria-label="Admin (mobile)" data-tour="staff-bottom" className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-paper border-t border-line pb-[env(safe-area-inset-bottom)]">
          <ul className="grid grid-cols-5">
            {primary.map((it) => (
              <li key={it.to}><NavLink to={it.to} end={it.to === '/admin'} className={({ isActive: a }) => `flex flex-col items-center justify-center gap-0.5 min-h-[56px] text-[13px] font-medium ${a ? 'text-gold' : 'text-slate'}`}><it.icon size={20} /><span className="truncate max-w-[64px]">{it.label.split(' ')[0]}</span></NavLink></li>
            ))}
            <li><button type="button" onClick={() => setMore(true)} className={`w-full flex flex-col items-center justify-center gap-0.5 min-h-[56px] text-[13px] font-medium ${rest.some((r) => isActive(r.to)) ? 'text-gold' : 'text-slate'}`} aria-label="More"><MoreHorizontal size={20} /> More</button></li>
          </ul>
        </nav>
        {more && (
          <div className="fixed inset-0 z-[85] lg:hidden" role="presentation">
            <div className="absolute inset-0 bg-midnight/40" onClick={() => setMore(false)} aria-hidden="true" />
            <div ref={moreRef} role="dialog" aria-modal="true" aria-label="More" tabIndex={-1} className="absolute bottom-0 inset-x-0 rounded-t-2xl bg-paper p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-2"><p className="font-semibold">All modules</p><button type="button" onClick={() => setMore(false)} className="tap inline-flex items-center justify-center rounded-lg hover:bg-midnight/5" aria-label="Close"><X size={20} /></button></div>
              <ul className="grid grid-cols-3 gap-2">
                {rest.map((it) => <li key={it.to}><NavLink to={it.to} className={({ isActive: a }) => `flex flex-col items-center gap-1 rounded-xl border p-3 text-xs text-center min-h-[72px] ${a ? 'border-gold bg-gold-50 text-midnight' : 'border-line'}`}><it.icon size={20} /> {it.label}</NavLink></li>)}
              </ul>
            </div>
          </div>
        )}
        <GlobalSearch open={search} onClose={() => setSearch(false)} />
        <Tour steps={staffTour} open={tour.open} onClose={tour.close} label="Staff hub tour" />
      </div>
    </div>
  )
}
