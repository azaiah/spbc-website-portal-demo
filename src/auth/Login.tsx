import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Mail, ShieldCheck, Loader2, ChevronRight, LogIn, Users, LayoutDashboard, Lock, Hand } from 'lucide-react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Mark, PoweredBy } from '@/components/Logo'
import { useDemo } from '@/data/store'
import { demoAccounts, accountById, type DemoAccount } from '@/config/accounts'

type Provider = 'Google' | 'Microsoft' | 'Apple' | 'Email'

function GoogleMark() {
  return <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z" /><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z" /><path fill="#FBBC05" d="M10.6 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l8-6.1z" /><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.2 0-11.5-4.1-13.4-9.8l-8 6.1C6.6 42.6 14.6 48 24 48z" /></svg>
}
function MicrosoftMark() {
  return <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path fill="#F25022" d="M0 0h9.5v9.5H0z" /><path fill="#7FBA00" d="M10.5 0H20v9.5h-9.5z" /><path fill="#00A4EF" d="M0 10.5h9.5V20H0z" /><path fill="#FFB900" d="M10.5 10.5H20V20h-9.5z" /></svg>
}
function AppleMark() {
  return <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4.1zM13.9 4.9c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.1 1.1.1 2.3-.6 3-1.5z" /></svg>
}

const providers: { p: Provider; label: string; icon: JSX.Element; cls: string }[] = [
  { p: 'Google', label: 'Continue with Google', icon: <GoogleMark />, cls: 'bg-paper text-midnight border border-line hover:border-midnight/30' },
  { p: 'Microsoft', label: 'Continue with Microsoft', icon: <MicrosoftMark />, cls: 'bg-paper text-midnight border border-line hover:border-midnight/30' },
  { p: 'Apple', label: 'Continue with Apple', icon: <AppleMark />, cls: 'bg-midnight text-white hover:bg-black' },
  { p: 'Email', label: 'Continue with email link', icon: <Mail size={18} />, cls: 'bg-royal-50 text-plum border border-plum/15 hover:border-plum/40' },
]

type Side = 'member' | 'staff'
const sideGroups: Record<Side, DemoAccount['group'][]> = {
  member: ['Members'],
  staff: ['Pastoral leadership', 'Church administration', 'Life Stage Pastors', 'Ministry leaders', 'Volunteers', 'Support'],
}
const sideCopy: Record<Side, { title: string; dest: string; text: string }> = {
  member: { title: 'Member portal', dest: 'the member portal', text: 'For members and families: your life stage and pastor, events, giving, groups and prayer requests.' },
  staff: { title: 'Church staff', dest: 'the staff hub', text: 'For pastors, Life Stage Pastors, the church office and ministry leaders: both campuses in one place.' },
}
const providerHost: Record<Provider, string> = { Google: 'accounts.google.com', Microsoft: 'login.microsoftonline.com', Apple: 'appleid.apple.com', Email: 'Saint Paul’s Everywhere' }
const initials = (n: string) => n.replace(/^(Rev\.|Dr\.|Deacon|Min\.)\s*/g, '').replace(/^(Rev\.|Dr\.)\s*/g, '').split(/\s+/).filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]).slice(0, 2).join('')
/** Big, plain reassurance for the preview: people must not think they're locked out. */
function EasyIn({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 flex items-start gap-3 rounded-2xl border-2 border-gold-bright bg-gold-50 p-4 sm:p-5" role="note">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-bright text-midnight"><Hand size={20} /></span>
      <p className="text-[17px] sm:text-lg leading-snug text-midnight">{children}</p>
    </div>
  )
}
const fade = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } }

/**
 * Demo sign-in: 1) choose Member portal or Church staff, 2) choose a sign-in provider,
 * 3) a simulated provider account chooser to pick whose view to explore. No passwords, nothing leaves the page.
 */
export default function Login() {
  useDocumentMeta('Sign in | Saint Paul’s Everywhere', 'Sign in to Saint Paul’s Everywhere, the member portal and staff hub of The Saint Paul’s Baptist Church.')
  const { state, signIn } = useDemo()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next')
  const hinted: Side | null = next?.startsWith('/admin') ? 'staff' : next?.startsWith('/portal') ? 'member' : null
  const [side, setSide] = useState<Side | null>(hinted)
  const [provider, setProvider] = useState<Provider | null>(null)
  const [signing, setSigning] = useState<DemoAccount | null>(null)
  const current = state.entered ? accountById(state.accountId) : undefined
  const grouped = useMemo(() => (side ? sideGroups[side].map((g) => ({ g, list: demoAccounts.filter((a) => a.group === g) })).filter((x) => x.list.length) : []), [side])

  function choose(a: DemoAccount) {
    setSigning(a)
    window.setTimeout(() => {
      signIn(a.id)
      const fits = next && next.startsWith('/') && !next.startsWith('//') && (a.role === 'member' ? next.startsWith('/portal') : next.startsWith('/admin'))
      nav(fits ? next! : a.home, { replace: true })
    }, 1100)
  }

  const step = signing ? 3 : provider ? 2 : side ? 1 : 0
  return (
    <div className="min-h-[100svh] grid lg:grid-cols-[1fr_1.05fr] bg-linen">
      <aside className="relative isolate hidden lg:flex flex-col justify-between overflow-hidden bg-midnight text-white p-12 grain">
        <img src="/images/church/worship-lights.jpg" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-midnight via-midnight/60 to-midnight/20" />
        <Link to="/" className="inline-flex items-center gap-3 w-fit"><img src="/images/church/spbc-logo-white.svg" alt="The Saint Paul’s Baptist Church" width={240} height={62} className="h-auto w-[240px]" /></Link>
        <div>
          <p className="font-caps font-semibold text-glow">Saint Paul’s Everywhere</p>
          <p className="display text-6xl xl:text-7xl mt-4 max-w-lg">One church. One mission. Wherever you are.</p>
          <p className="mt-8 max-w-md text-white/85 text-lg leading-relaxed">Members, Life Stage Pastors, ministry leaders, volunteers and the church office, all in one place across Creighton, Belt and online.</p>
        </div>
        <PoweredBy light />
      </aside>

      <main className="flex flex-col px-4 sm:px-10 py-6 sm:py-10">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-plum min-h-[44px]"><ArrowLeft size={16} /> Back to website</Link>
          <span className="lg:hidden"><Mark size={36} /></span>
        </div>
        <ol className="mt-4 w-full max-w-xl mx-auto flex items-center gap-2 text-sm" aria-label="Sign-in steps">
          {['Who you are', 'Sign-in method', 'Your account'].map((t, i) => (
            <li key={t} className={`flex-1 rounded-full h-1.5 ${i <= Math.min(step, 2) ? 'bg-gold' : 'bg-line'}`} aria-current={i === step ? 'step' : undefined}><span className="sr-only">{`Step ${i + 1}: ${t}`}</span></li>
          ))}
        </ol>
        <div className="w-full max-w-xl mx-auto my-auto py-8">
          <AnimatePresence mode="wait">
            {signing ? (
              <motion.div key="signing" {...fade} className="text-center py-16" role="status" aria-live="polite">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-midnight text-gold-light font-display text-3xl">{initials(signing.name)}</div>
                <p className="mt-6 font-display text-3xl">Welcome, {signing.name.split(' ').filter((w) => !/\./.test(w) && w !== 'Deacon' && w !== 'Executive' && w !== 'Office').slice(0, 1).join(' ') || signing.name}</p>
                <p className="mt-2 text-slate inline-flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Opening {side ? sideCopy[side].dest : 'Saint Paul’s Everywhere'}…</p>
              </motion.div>
            ) : !side ? (
              <motion.div key="side" {...fade}>
                <p className="font-caps font-semibold text-ember">Saint Paul’s Everywhere</p>
                <h1 className="display text-5xl sm:text-6xl mt-3">Sign in</h1>
                <p className="mt-3 text-slate text-lg">Which would you like to open?</p>
                {current && (
                  <button type="button" onClick={() => nav(current.home)} className="mt-6 w-full flex items-center gap-4 rounded-3xl border-2 border-plum/30 bg-paper p-4 text-left hover:border-plum">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-plum text-white font-semibold">{initials(current.name)}</span>
                    <span className="min-w-0 flex-1"><span className="block font-semibold">Continue as {current.name}</span><span className="block text-sm text-slate truncate">{current.title}</span></span>
                    <ChevronRight className="text-plum" />
                  </button>
                )}
                <div className="mt-6 grid gap-4">
                  {(['member', 'staff'] as Side[]).map((x) => (
                    <button key={x} type="button" onClick={() => setSide(x)} className="group w-full flex items-start gap-4 rounded-3xl border-2 border-line bg-paper p-5 sm:p-6 text-left hover:border-plum/50 hover:shadow-card transition">
                      <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${x === 'member' ? 'bg-gold-50 text-gold' : 'bg-royal-50 text-plum'}`}>{x === 'member' ? <Users size={28} /> : <LayoutDashboard size={28} />}</span>
                      <span className="min-w-0 flex-1"><span className="block font-display font-semibold text-2xl">{sideCopy[x].title}</span><span className="block text-slate mt-1 leading-snug">{sideCopy[x].text}</span></span>
                      <ChevronRight className="text-plum mt-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
                <EasyIn><b>This is a preview.</b> Tap either choice above to look around. You will not need a password, and nothing you do here changes real church records.</EasyIn>
              </motion.div>
            ) : !provider ? (
              <motion.div key="providers" {...fade}>
                <button type="button" onClick={() => setSide(null)} className="inline-flex items-center gap-2 text-sm font-semibold text-plum min-h-[44px]"><ArrowLeft size={16} /> Change</button>
                <p className="mt-2 font-caps font-semibold text-ember">{sideCopy[side].title}</p>
                <h1 className="display text-4xl sm:text-5xl mt-2">How do you sign in?</h1>
                <p className="mt-3 text-slate text-lg">{side === 'staff' ? 'Staff usually use their church Microsoft 365 account.' : 'Use the account you already have. There’s no new password to remember.'}</p>
                <EasyIn><b>Tap any of these buttons to get in.</b> They all work. It’s a pretend sign-in, so you won’t be asked for a password or an email.</EasyIn>
                <div className="mt-6 grid gap-3">
                  {(side === 'staff' ? [providers[1], providers[0], providers[2], providers[3]] : providers).map((x) => (
                    <button key={x.p} type="button" onClick={() => setProvider(x.p)} className={`flex items-center justify-center gap-3 rounded-full min-h-[56px] px-6 font-semibold transition ${x.cls}`}>{x.icon}{x.label}</button>
                  ))}
                </div>
                <p className="mt-6 text-[15px] text-slate flex gap-2"><Lock size={16} className="shrink-0 mt-0.5" /> When the church goes live, each person signs in with their own account here.</p>
              </motion.div>
            ) : (
              <motion.div key="chooser" {...fade}>
                <button type="button" onClick={() => setProvider(null)} className="inline-flex items-center gap-2 text-sm font-semibold text-plum min-h-[44px]"><ArrowLeft size={16} /> Other sign-in options</button>
                {/* A pretend provider window: the familiar "choose an account" screen. */}
                <div className="mt-3 rounded-[28px] border border-line bg-paper shadow-card overflow-hidden">
                  <div className="flex items-center gap-2 border-b border-line bg-linen px-4 py-2.5 text-[13px] text-slate"><Lock size={13} /> <span className="truncate">{providerHost[provider]}</span><span className="ml-auto rounded-full bg-gold-50 text-gold px-2 py-0.5 font-bold uppercase tracking-wider">Demo</span></div>
                  <div className="p-5 sm:p-7">
                    <div className="flex items-center gap-3">{providers.find((x) => x.p === provider)?.icon}<span className="font-semibold">{provider === 'Email' ? 'Email link' : provider}</span></div>
                    <h1 className="font-display text-3xl font-semibold mt-4">Choose an account</h1>
                    <p className="mt-1 text-slate">to continue to <b className="text-midnight">Saint Paul’s Everywhere</b> · {sideCopy[side].dest}</p>
                    <EasyIn><b>Tap any name to go in.</b> Each one shows the portal the way that person would see it. No password needed.</EasyIn>
                    <div className="mt-5 grid gap-5">
                      {grouped.map(({ g, list }) => (
                        <section key={g} aria-label={g}>
                          {side === 'staff' && <h2 className="font-caps text-[14px] font-semibold text-ember mb-1.5">{g}</h2>}
                          <ul className="divide-y divide-line border-y border-line">
                            {list.map((a) => (
                              <li key={a.id}>
                                <button type="button" onClick={() => choose(a)} className="group w-full flex items-center gap-4 py-3.5 text-left hover:bg-linen rounded-lg px-2 -mx-2 min-h-[64px]">
                                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full font-semibold text-sm ${a.sample ? 'bg-parchment text-slate' : 'bg-midnight text-gold-light'}`}>{initials(a.name) || 'SP'}</span>
                                  <span className="min-w-0 flex-1">
                                    <span className="flex flex-wrap items-center gap-2"><span className="font-semibold">{a.name}</span>{a.sample && <span className="rounded-full bg-parchment px-2 py-0.5 text-[13px] font-bold uppercase tracking-wider text-slate">Sample</span>}</span>
                                    <span className="block text-sm text-slate truncate">{a.email}</span>
                                    <span className="block text-sm text-plum">{a.title}</span>
                                  </span>
                                  <LogIn size={18} className="text-plum opacity-40 group-hover:opacity-100 shrink-0" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </section>
                      ))}
                    </div>
                    <p className="mt-5 text-xs text-slate flex gap-2"><ShieldCheck size={14} className="shrink-0 mt-0.5" /> Pick anyone to see Saint Paul’s Everywhere through their eyes. Real leaders appear by public name and title only; sample people are marked.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="lg:hidden flex justify-center"><PoweredBy /></div>
      </main>
    </div>
  )
}
