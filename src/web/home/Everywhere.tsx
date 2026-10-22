import { ArrowRight, CalendarCheck, HandHeart, LayoutDashboard, Receipt, Users, Sprout, LogIn, BellRing } from 'lucide-react'
import { lifeStages } from '@/config/site'
import { upcomingEvents } from '@/data/events'
import { Container, Eyebrow, PrimaryButton, OutlineButton, Leaf } from '../ui'
import { Rise } from '../motion'

const features = [
  { icon: <Sprout size={22} />, t: 'Your life stage and pastor', d: 'Your stage, your Life Stage Pastor and this week’s Bible study, the moment you sign in.' },
  { icon: <CalendarCheck size={22} />, t: 'One-tap event registration', d: 'Register yourself and your family. Your name and email are already filled in.' },
  { icon: <Receipt size={22} />, t: 'Giving history and statements', d: 'Every gift by fund and month, and your year-end statement for taxes in one click.' },
  { icon: <HandHeart size={22} />, t: 'Prayer and care that follows up', d: 'Share a request and see when a pastor has reached out.' },
  { icon: <Users size={22} />, t: 'Groups and serving', d: 'Join a group, see your serving schedule and stay in touch with your team.' },
  { icon: <BellRing size={22} />, t: 'Reminders you choose', d: 'Email or text, only for what you care about. Your profile, your settings.' },
]

/**
 * Saint Paul’s Everywhere: the member portal and staff hub, shown on the home page.
 * Demo build: sign-in is simulated and every number inside is sample data.
 */
export function EverywhereSection() {
  const stage = lifeStages.find((s) => s.id === 'fusion') ?? lifeStages[0]
  const next = upcomingEvents().slice(0, 2)
  return (
    <section className="relative overflow-hidden bg-canopy text-white py-20 sm:py-28" aria-labelledby="everywhere-h">
      <Leaf size={520} className="absolute -left-40 -bottom-48 text-white/[0.04]" />
      <Container className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <Rise>
          <Eyebrow light>Saint Paul’s Everywhere · member portal</Eyebrow>
          <h2 id="everywhere-h" className="display text-[2.5rem] sm:text-6xl mt-4 text-balance">Your church, in your pocket.</h2>
          <p className="mt-5 text-xl text-white/85 leading-relaxed max-w-2xl">One sign-in for everything at Saint Paul’s. Members see their own life stage, events, giving and prayer requests. Pastors and staff see both campuses in one hub.</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {features.map((f) => (
              <li key={f.t} className="flex gap-3">
                <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-glow">{f.icon}</span>
                <span><b className="block text-lg leading-snug">{f.t}</b><span className="block text-white/75 text-[17px] leading-snug mt-0.5">{f.d}</span></span>
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap gap-3">
            <PrimaryButton href="/login?next=/portal" icon={<LogIn size={18} />}>Open the member portal</PrimaryButton>
            <OutlineButton href="/login?next=/admin" className="!border-white/40 !text-white hover:!bg-white hover:!text-canopy" icon={<LayoutDashboard size={18} />}>See the staff hub</OutlineButton>
          </div>
          <p className="mt-4 text-[16px] text-white/65">Preview: pick any account to look around. No password needed, and everything inside is sample data.</p>
        </Rise>

        {/* A phone showing the portal home (illustration built from the real components' content). */}
        <Rise delay={0.15} className="mx-auto w-full max-w-[360px]">
          <div className="relative rounded-[44px] border-[10px] border-night bg-morning text-ink shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden" aria-hidden="true">
            <div className="mx-auto mt-2 h-5 w-24 rounded-full bg-night" />
            <div className="bg-canopy text-white px-5 pt-4 pb-6">
              <p className="font-mono text-[13px] uppercase tracking-[0.18em] text-glow">Sunday</p>
              <p className="font-display font-bold text-[1.7rem] leading-tight mt-1">Welcome home, Angela.</p>
              <p className="text-white/75 text-[14px] mt-1 font-serif italic">“With God all things are possible.”</p>
            </div>
            <div className="px-4 -mt-3 pb-5 grid gap-3">
              <div className="rounded-2xl p-4 text-white" style={{ background: `linear-gradient(135deg, ${stage.color}, #17131C 150%)` }}>
                <p className="text-[13px] text-white/80">Your life stage</p>
                <p className="font-display font-bold text-2xl">{stage.name}</p>
                <p className="text-[14px] text-white/85 mt-1">{stage.pastor}{stage.study ? ` · ${stage.study}` : ''}</p>
              </div>
              <div className="rounded-2xl bg-paper border border-line p-4">
                <p className="text-[13px] text-stone">Coming up</p>
                {next.map((e) => (
                  <p key={e.slug} className="mt-2 flex items-center justify-between gap-2 text-[15px]"><b className="truncate">{e.title}</b><span className="shrink-0 rounded-full bg-grow-50 text-grow px-2 py-0.5 text-[13px] font-bold">Register</span></p>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-paper border border-line p-4"><p className="text-[13px] text-stone">Giving</p><p className="font-display font-bold text-lg mt-1">Statement ready</p></div>
                <div className="rounded-2xl bg-paper border border-line p-4"><p className="text-[13px] text-stone">Prayer</p><p className="font-display font-bold text-lg mt-1">Pastor replied</p></div>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-orange px-4 py-3 font-bold text-ink text-[15px]">Give <ArrowRight size={16} /></div>
            </div>
          </div>
        </Rise>
      </Container>
    </section>
  )
}
