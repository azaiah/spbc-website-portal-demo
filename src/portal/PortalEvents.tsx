import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CalendarDays, MapPin, Clock, X, Minus, Plus, CheckCircle2, Ticket } from 'lucide-react'
import { useDemo } from '@/data/store'
import { registrationsFor, roomById, upcomingEvents } from '@/data/selectors'
import { events as publicEvents } from '@/data/events'
import { fmtLong, fmtTime } from '@/data/dates'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Button, LinkButton } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { useMe, PageTitle } from './shared'

/** Public events are seeded in order as e_1, e_2… (see seed.ts), so a website slug maps to its hub event. */
const eventIdForSlug = (slug: string) => { const i = publicEvents.findIndex((e) => e.slug === slug); return i < 0 ? null : `e_${i + 1}` }

export function PortalEvents() {
  const { state, remove, upsert, log } = useDemo()
  const me = useMe()
  const [params, setParams] = useSearchParams()
  useDocumentMeta(`My events | ${state.church.name}`)
  const mine = state.registrations.filter((r) => r.memberId === me.id)
  const upcoming = upcomingEvents(state).filter((e) => mine.some((r) => r.eventId === e.id))
  const suggestions = upcomingEvents(state, true).filter((e) => e.registrationOpen && !mine.some((r) => r.eventId === e.id)).slice(0, 3)

  const slug = params.get('register')
  const option = params.get('option')
  const targetId = slug ? eventIdForSlug(slug) : null
  const target = targetId ? state.events.find((e) => e.id === targetId) : undefined
  const already = target ? mine.find((r) => r.eventId === target.id) : undefined
  const [qty, setQty] = useState(1)
  const [done, setDone] = useState<string | null>(null)

  function registerFor(eventId: string, title: string, n: number) {
    upsert('registrations', { id: `rg_${Date.now()}`, eventId, memberId: me.id, name: `${me.first} ${me.last}`, email: me.email, qty: n, date: new Date().toISOString().slice(0, 10) })
    log(`${me.first} ${me.last}`, 'Registered', `${title}${option ? ` (${option})` : ''} · ${n} ${n === 1 ? 'seat' : 'seats'}`)
  }

  return (
    <>
      <PageTitle title="My events" text="Everything you have registered for, plus a few you might like." action={<LinkButton to="/events" variant="outline" icon={<CalendarDays size={16} />}>Browse all events</LinkButton>} />

      {done && (
        <div role="status" className="mb-6 card p-5 border-2 border-grow/40 bg-grow-50 flex items-start gap-3">
          <CheckCircle2 className="text-grow shrink-0 mt-0.5" />
          <div className="flex-1"><p className="font-semibold text-lg">You’re registered for {done}.</p><p className="text-slate mt-1">It’s on your list below. The church will email a reminder the day before.</p></div>
          <button type="button" onClick={() => setDone(null)} aria-label="Dismiss" className="tap inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full hover:bg-white/60"><X size={18} /></button>
        </div>
      )}

      {target && !done && (
        <section aria-labelledby="reg-h" className="mb-8 card p-5 sm:p-6 border-2 border-gold/40">
          <p className="stamp flex items-center gap-2"><Ticket size={14} /> Register</p>
          <h2 id="reg-h" className="font-display text-2xl sm:text-3xl font-semibold mt-2">{target.title}</h2>
          <p className="text-slate mt-1 flex flex-wrap gap-x-4 gap-y-1"><span className="inline-flex items-center gap-1.5"><CalendarDays size={16} /> {fmtLong(target.date)}</span><span className="inline-flex items-center gap-1.5"><Clock size={16} /> {fmtTime(target.start)}</span><span className="inline-flex items-center gap-1.5"><MapPin size={16} /> {roomById(state, target.roomId)?.name}</span></p>
          {option && <p className="mt-2"><Badge tone="gold">{option}</Badge></p>}
          {already ? (
            <p className="mt-4 text-lg">You’re already registered ({already.qty} {already.qty === 1 ? 'seat' : 'seats'}). <button type="button" onClick={() => setParams({})} className="text-royal underline min-h-[44px]">Close</button></p>
          ) : (
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2" role="group" aria-label="Number of people">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="One fewer" className="tap h-12 w-12 rounded-full border-2 border-line inline-flex items-center justify-center hover:bg-linen"><Minus size={18} /></button>
                <span className="min-w-[5.5rem] text-center font-semibold text-lg" aria-live="polite">{qty} {qty === 1 ? 'person' : 'people'}</span>
                <button type="button" onClick={() => setQty((q) => Math.min(8, q + 1))} aria-label="One more" className="tap h-12 w-12 rounded-full border-2 border-line inline-flex items-center justify-center hover:bg-linen"><Plus size={18} /></button>
              </div>
              <Button onClick={() => { registerFor(target.id, target.title, qty); setDone(target.title); setParams({}) }} icon={<CheckCircle2 size={18} />}>Confirm registration</Button>
              <Button variant="ghost" onClick={() => setParams({})}>Not now</Button>
            </div>
          )}
          <p className="mt-4 text-sm text-slate">Signed in as {me.first} {me.last}. Your name and email come from your profile, so there’s nothing to type.</p>
        </section>
      )}
      {slug && !target && !done && <p className="mb-6 card p-5 text-slate">That event isn’t open for registration right now. <Link to="/events" className="text-royal underline">See all events</Link>.</p>}

      <section className="grid gap-3">
        {upcoming.map((e) => {
          const reg = mine.find((r) => r.eventId === e.id)!
          const seats = registrationsFor(state, e.id).reduce((s, r) => s + r.qty, 0)
          return (
            <article key={e.id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-midnight text-white flex flex-col items-center justify-center shrink-0"><span className="font-mono text-[13px] uppercase">{fmtLong(e.date).split(',')[1]?.trim().split(' ')[0]?.slice(0, 3)}</span><span className="font-display text-xl font-semibold leading-none">{e.date.slice(8, 10)}</span></div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-lg">{e.title}</h2>
                <p className="text-sm text-slate flex flex-wrap gap-x-4 gap-y-1 mt-1"><span className="inline-flex items-center gap-1"><Clock size={14} /> {fmtTime(e.start)}</span><span className="inline-flex items-center gap-1"><MapPin size={14} /> {roomById(state, e.roomId)?.name}</span><span>{seats} of {e.capacity} seats reserved</span></p>
              </div>
              <div className="flex items-center gap-2 shrink-0"><Badge tone="gold">{reg.qty} {reg.qty === 1 ? 'seat' : 'seats'}</Badge><Button variant="ghost" icon={<X size={16} />} onClick={() => { remove('registrations', reg.id); log(`${me.first} ${me.last}`, 'Cancelled registration', e.title) }}>Cancel</Button></div>
            </article>
          )
        })}
        {upcoming.length === 0 && <p className="card p-6 text-slate">You have no upcoming registrations.</p>}
      </section>
      {suggestions.length > 0 && (
        <section className="mt-10">
          <h2 className="font-semibold text-lg">You might like</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {suggestions.map((e) => (
              <article key={e.id} className="card p-4 flex flex-col">
                <p className="stamp">{fmtLong(e.date)}</p>
                <p className="font-semibold mt-1">{e.title}</p>
                <p className="text-sm text-slate mt-1 line-clamp-2 flex-1">{e.description}</p>
                <Button className="mt-3 self-start" variant="outline" icon={<Ticket size={16} />} onClick={() => { registerFor(e.id, e.title, 1); setDone(e.title) }}>Register</Button>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
