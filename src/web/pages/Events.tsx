import { useMemo, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { CalendarPlus, Clock, MapPin, ArrowRight, Navigation, ArrowLeft, Share2 } from 'lucide-react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { campuses } from '@/config/site'
import { upcomingEvents, pastEvents, eventBySlug, icsFor, lineupTagline, type CampusKey, type PublicEvent } from '@/data/events'
import { PageHero, Container, Eyebrow, PrimaryButton, OutlineButton, flyerSrc, Ext } from '../ui'
import { EventCard } from '../home/Sections'

const filters: { id: 'all' | CampusKey; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'creighton', label: 'Creighton' },
  { id: 'belt', label: 'Belt' },
  { id: 'online', label: 'Online' },
]

function matches(e: PublicEvent, f: 'all' | CampusKey) {
  if (f === 'all') return true
  if (f === 'online') return e.campus === 'online'
  return e.campus === f || e.campus === 'both'
}

export default function Events() {
  useDocumentMeta('Events | The Saint Paul’s Baptist Church', 'Fall 2026 at Saint Paul’s: Trunk or Treat, Fire on Fridays, the Veterans Brunch, the 117th Church Anniversary, The Spirit of Christmas and Breakthrough 2027.')
  const [f, setF] = useState<'all' | CampusKey>('all')
  const up = useMemo(() => upcomingEvents().filter((e) => matches(e, f)), [f])
  const past = pastEvents()
  return (
    <>
      <PageHero eyebrow="What’s happening at Saint Paul’s" title="Ignite your fall." text={`${lineupTagline} Save the dates, bring your family and friends, and let’s grow together.`}>
        <PrimaryButton href="#upcoming" icon={<ArrowRight size={18} />}>See the lineup</PrimaryButton>
        <OutlineButton href="/login?next=/portal/events">My registrations</OutlineButton>
      </PageHero>
      <section id="upcoming" className="py-14 sm:py-20 scroll-mt-28">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="display text-4xl sm:text-5xl">Coming up</h2>
            <div role="group" aria-label="Filter by campus" className="flex flex-wrap gap-2">
              {filters.map((x) => (
                <button key={x.id} type="button" onClick={() => setF(x.id)} aria-pressed={f === x.id} className={`min-h-[48px] rounded-full px-5 font-bold border-2 transition-colors ${f === x.id ? 'bg-grow text-white border-grow' : 'border-line text-ink hover:border-grow'}`}>{x.label}</button>
              ))}
            </div>
          </div>
          {up.length ? (
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{up.map((e) => <li key={e.slug}><EventCard e={e} /></li>)}</ul>
          ) : (
            <p className="mt-8 rounded-3xl border-2 border-dashed border-line p-10 text-center text-stone text-lg">Nothing scheduled here right now. Check “Everything” or the full church calendar.</p>
          )}
        </Container>
      </section>
      <section className="py-14 sm:py-20 bg-parchment" aria-labelledby="recaps">
        <Container>
          <Eyebrow>Recaps</Eyebrow>
          <h2 id="recaps" className="mt-3 display text-4xl">This season so far</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{past.map((e) => <li key={e.slug}><EventCard e={e} compact /></li>)}</ul>
        </Container>
      </section>
    </>
  )
}

function download(e: PublicEvent) {
  const blob = new Blob([icsFor(e)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `${e.slug}.ics`
  document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function EventDetail() {
  const { slug } = useParams()
  const e = slug ? eventBySlug(slug) : undefined
  useDocumentMeta(e ? `${e.title} | The Saint Paul’s Baptist Church` : 'Events | The Saint Paul’s Baptist Church', e?.summary)
  const [shared, setShared] = useState(false)
  if (!e) return <Navigate to="/events" replace />
  const isPast = (e.endDate ?? e.date) < new Date().toISOString().slice(0, 10)
  const campusList = e.campus === 'both' ? campuses.filter((c) => c.street) : campuses.filter((c) => c.id === e.campus && c.street)
  const share = async () => {
    const url = window.location.href
    try { if (navigator.share) await navigator.share({ title: e.title, text: e.summary, url }); else { await navigator.clipboard.writeText(url); setShared(true) } } catch { /* cancelled */ }
  }
  return (
    <>
      <section className="bg-parchment pt-32 sm:pt-40 pb-14 sm:pb-20">
        <Container>
          <Link to="/events" className="inline-flex items-center gap-2 font-bold text-grow min-h-[48px]"><ArrowLeft size={18} /> All events</Link>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <div>
              {isPast && <p className="inline-block rounded-full bg-ink text-white px-3 py-1 text-[15px] font-bold">Recap</p>}
              {e.kicker && <p className="mt-3 font-caps font-semibold text-ember text-lg">{e.kicker}</p>}
              <h1 className="mt-2 display text-5xl sm:text-7xl text-balance">{e.title}</h1>
              <p className="mt-5 text-2xl text-stone leading-relaxed">{e.summary}</p>
              <dl className="mt-8 grid gap-3">
                <div className="flex gap-3 text-lg"><dt className="sr-only">When</dt><Clock className="text-ember shrink-0 mt-1" /><dd className="font-bold">{e.when}</dd></div>
                <div className="flex gap-3 text-lg"><dt className="sr-only">Where</dt><MapPin className="text-ember shrink-0 mt-1" /><dd><b>{e.where}</b>{e.address && <span className="block text-stone">{e.address}</span>}</dd></div>
              </dl>
              {!isPast && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {e.actions?.map((a, i) => (a.primary || i === 0
                    ? <PrimaryButton key={a.label} href={a.href.startsWith('/') ? undefined : a.href} to={a.href.startsWith('/') ? a.href : undefined} icon={<ArrowRight size={18} />}>{a.label}</PrimaryButton>
                    : <OutlineButton key={a.label} href={a.href.startsWith('/') ? undefined : a.href} to={a.href.startsWith('/') ? a.href : undefined}>{a.label}</OutlineButton>))}
                  <button type="button" onClick={() => download(e)} className="inline-flex items-center gap-2 rounded-full border-2 border-line px-6 min-h-[52px] font-bold hover:border-grow hover:text-grow"><CalendarPlus size={18} /> Add to calendar</button>
                  <button type="button" onClick={share} className="inline-flex items-center gap-2 rounded-full border-2 border-line px-6 min-h-[52px] font-bold hover:border-grow hover:text-grow"><Share2 size={18} /> {shared ? 'Link copied' : 'Share'}</button>
                </div>
              )}
            </div>
            {e.flyer && (
              <figure className="rounded-[28px] overflow-hidden bg-paper border border-line shadow-lift">
                <img src={flyerSrc(e.flyer)} alt={e.flyerAlt ?? ''} className="w-full h-auto" />
                <figcaption className="sr-only">Event flyer. All details are written out on this page.</figcaption>
              </figure>
            )}
          </div>
        </Container>
      </section>
      <section className="py-14 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="display text-4xl">About this {isPast ? 'event' : 'event'}</h2>
            <div className="mt-5 space-y-4 text-xl text-stone leading-relaxed">{e.body.map((b) => <p key={b}>{b}</p>)}</div>
            {e.highlights && <ul className="mt-6 grid gap-2">{e.highlights.map((h) => <li key={h} className="rounded-2xl bg-parchment px-4 py-3 font-semibold text-lg">{h}</li>)}</ul>}
            {e.scripture && <blockquote className="mt-8 border-l-4 border-orange pl-5"><p className="font-serif italic text-3xl leading-snug">“{e.scripture.text}”</p><cite className="mt-2 block not-italic font-caps font-semibold text-ember">{e.scripture.ref}</cite></blockquote>}
          </div>
          <aside className="grid gap-4 content-start">
            {e.sessions.length > 1 && !isPast && (
              <div className="rounded-[24px] bg-paper border border-line p-6">
                <h3 className="font-display font-bold text-2xl">Dates</h3>
                <ul className="mt-3 divide-y divide-line">
                  {e.sessions.filter((s) => s.date >= new Date().toISOString().slice(0, 10)).slice(0, 8).map((s, i) => (
                    <li key={i} className="py-3"><p className="font-semibold">{new Date(s.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {new Date(`2000-01-01T${s.start}:00`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>{s.label && <p className="text-stone text-[17px] leading-snug">{s.label}</p>}</li>
                  ))}
                </ul>
              </div>
            )}
            {campusList.map((c) => (
              <div key={c.id} className="rounded-[24px] overflow-hidden bg-paper border border-line">
                <iframe title={`Map to the ${c.name}`} src={c.mapsEmbed} loading="lazy" className="h-44 w-full border-0" referrerPolicy="no-referrer-when-downgrade" />
                <div className="p-5"><p className="font-display font-bold text-xl">{c.name}</p><p className="text-stone">{c.street}, {c.city}</p><Ext href={c.directionsUrl!} className="mt-2 inline-flex items-center gap-1.5 font-bold text-grow min-h-[44px]"><Navigation size={16} /> Directions</Ext></div>
              </div>
            ))}
          </aside>
        </Container>
      </section>
    </>
  )
}
