import { Link } from 'react-router-dom'
import { ArrowRight, Heart, CalendarDays, Bell, HandHeart, Users, PlayCircle, Smartphone } from 'lucide-react'
import { stageForAge } from '@/config/site'
import { links } from '@/config/links'
import { useDemo } from '@/data/store'
import { registrationsFor, sum } from '@/data/selectors'
import { fmtLong, fmtTime, money, fmtShort, fmtDate } from '@/data/dates'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Badge } from '@/components/Badge'
import { useMe, PageTitle, Stat } from './shared'

export function PortalHome() {
  const { state } = useDemo()
  const me = useMe()
  useDocumentMeta(`My portal | ${state.church.name}`)
  const year = new Date().getFullYear().toString()
  const myGifts = state.gifts.filter((g) => g.memberId === me.id)
  const ytd = sum(myGifts.filter((g) => g.date.startsWith(year)).map((g) => g.amount))
  const myEvents = state.events.filter((e) => registrationsFor(state, e.id).some((r) => r.memberId === me.id) && e.date >= new Date().toISOString().slice(0, 10)).sort((a, b) => a.date.localeCompare(b.date))
  const myCare = state.care.filter((c) => c.memberId === me.id && c.status !== 'closed')
  const announcements = state.announcements.filter((a) => a.status === 'sent' || a.status === 'approved' || a.status === 'scheduled').slice(0, 3)
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const age = me.birthday ? new Date().getFullYear() - Number(me.birthday.slice(0, 4)) : undefined
  const stage = age !== undefined ? stageForAge(age) : undefined
  const campus = me.tags.find((t) => /Campus|Online/.test(t))
  return (
    <>
      <PageTitle title={`${greet}, ${me.first.replace(/\.+$/, "")}.`} text={`Member since ${fmtDate(me.joinedAt)}. Here is what is yours at ${state.church.shortName}.`} />
      {stage && (
        <section data-tour="stage" className="mb-5 relative overflow-hidden rounded-3xl p-6 sm:p-7 text-white" style={{ background: `linear-gradient(135deg, ${stage.color}, #17131C 150%)` }} aria-label="Your life stage">
          <p className="text-[15px] font-semibold text-white/85">Your life stage{campus ? ` · ${campus}` : ''}</p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display font-extrabold text-4xl tracking-tight">{stage.name}</h2>
              <p className="mt-1 text-white/90 inline-flex items-center gap-2"><Users size={16} /> Life Stage Pastor: <b>{stage.pastor}</b></p>
              {stage.study && <p className="mt-1 text-white/90">Bible study: {stage.study}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to={`/life-stages/${stage.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-white text-ink font-bold px-4 min-h-[44px]">My stage <ArrowRight size={16} /></Link>
              <a href={links.watchLive.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-white/40 px-4 min-h-[44px] font-semibold hover:bg-white/10"><PlayCircle size={16} /> Watch</a>
              <Link to="/app" className="inline-flex items-center gap-1.5 rounded-full border border-white/40 px-4 min-h-[44px] font-semibold hover:bg-white/10"><Smartphone size={16} /> SPBC app</Link>
            </div>
          </div>
        </section>
      )}
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label={`Giving, ${year} year to date`} value={money(ytd)} sub={`${myGifts.filter((g) => g.date.startsWith(year)).length} gifts`} hi />
        <Stat label="Upcoming registrations" value={myEvents.length} sub={myEvents[0] ? `Next: ${fmtShort(myEvents[0].date)}` : 'None yet'} />
        <Stat label="Life stage & ministries" value={me.ministryIds.length} sub={state.ministries.filter((m) => me.ministryIds.includes(m.id)).map((m) => m.name).join(', ')} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <div className="flex items-center justify-between"><h2 className="font-semibold inline-flex items-center gap-2"><CalendarDays size={18} className="text-gold" /> My events</h2><Link to="/portal/events" className="text-sm text-royal font-medium hit gap-1">All <ArrowRight size={14} /></Link></div>
          <ul className="mt-3 divide-y divide-line">
            {myEvents.slice(0, 3).map((e) => <li key={e.id} className="py-3"><p className="font-medium">{e.title}</p><p className="text-sm text-slate">{fmtLong(e.date)} &middot; {fmtTime(e.start)}</p></li>)}
            {myEvents.length === 0 && <li className="py-3 text-sm text-slate">No registrations yet. <Link to="/events" className="text-royal underline">Browse events</Link>.</li>}
          </ul>
        </section>
        <section className="card p-5">
          <div className="flex items-center justify-between"><h2 className="font-semibold inline-flex items-center gap-2"><Bell size={18} className="text-gold" /> Announcements</h2></div>
          <ul className="mt-3 divide-y divide-line">
            {announcements.map((a) => <li key={a.id} className="py-3"><p className="font-medium">{a.title}</p><p className="text-sm text-slate line-clamp-2">{a.body}</p></li>)}
          </ul>
        </section>
        <section className="card p-5">
          <div className="flex items-center justify-between"><h2 className="font-semibold inline-flex items-center gap-2"><Heart size={18} className="text-gold" /> Recent giving</h2><Link to="/portal/giving" className="text-sm text-royal font-medium hit gap-1">History <ArrowRight size={14} /></Link></div>
          <p className="mt-1 text-xs text-slate">Gifts are processed by Pushpay. In this demo the history is sample data.</p>
          <ul className="mt-3 divide-y divide-line">
            {myGifts.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4).map((g) => <li key={g.id} className="py-2.5 flex items-center justify-between text-sm"><span>{state.funds.find((f) => f.id === g.fundId)?.name}<span className="text-slate"> &middot; {fmtShort(g.date)}</span></span><span className="font-mono font-semibold">{money(g.amount)}</span></li>)}
          </ul>
        </section>
        <section className="card p-5">
          <div className="flex items-center justify-between"><h2 className="font-semibold inline-flex items-center gap-2"><HandHeart size={18} className="text-gold" /> Prayer and care</h2><Link to="/portal/care" className="text-sm text-royal font-medium hit gap-1">Details <ArrowRight size={14} /></Link></div>
          <ul className="mt-3 divide-y divide-line">
            {myCare.map((c) => <li key={c.id} className="py-3 flex items-start justify-between gap-3"><p className="text-sm line-clamp-2">{c.text}</p><Badge tone={c.status === 'new' ? 'gold' : 'royal'} className="capitalize">{c.status}</Badge></li>)}
            {myCare.length === 0 && <li className="py-3 text-sm text-slate">No open requests. <Link to="/prayer" className="text-royal underline">Share one</Link>.</li>}
          </ul>
        </section>
      </div>
    </>
  )
}
