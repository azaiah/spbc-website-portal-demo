import { Link, useParams, Navigate } from 'react-router-dom'
import { Car, Baby, Clock, Shirt, Navigation, Phone, PlayCircle, Accessibility, HelpCircle, ArrowRight, MapPin, Bus } from 'lucide-react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { useDemo } from '@/data/store'
import { uid } from '@/data/ids'
import { todayIso } from '@/data/dates'
import { church, campuses, type Campus } from '@/config/site'
import { links } from '@/config/links'
import { PageHero, Container, Eyebrow, PrimaryButton, GreenButton, OutlineButton, Photo, Leaf } from '../ui'
import { SiteForm, F, Check } from '../forms'

const faqs: { q: string; a: string }[] = [
  { q: 'Which campus should I visit?', a: 'Both campuses are one church with the same pastor and message. Creighton (Henrico) worships at 9:00 AM; Belt (Southside Richmond) at 11:30 AM. Choose the time and place that work for your family.' },
  // TODO: confirm with church: typical service length.
  { q: 'How long is the service?', a: 'Plan to give yourself the whole morning so you are not rushed. Call us and we’ll tell you what to expect at your campus.' },
  { q: 'What about my kids?', a: 'imagiNATION, our ministry for birth to age 10, holds Bible study for children during worship at both campuses. Students 11 to 19 are part of SMB.' },
  { q: 'I don’t have a ride.', a: 'Call our Transportation line at 804.463.2429 or use the ride form on this page.' },
  { q: 'Can I watch first?', a: 'Yes. Worship streams live at 9:00 AM on MySPBC.tv, YouTube and Facebook @myspbc, with replays all week.' },
  // TODO: confirm with church: accessible parking, entrances, seating and hearing assistance at each campus.
  { q: 'Is the building accessible?', a: 'Tell us what you need on the visit form or call 804.643.4769, and we’ll make sure you have an easy way in and a good seat.' },
]

export function VisitForms() {
  const { upsert, log } = useDemo()
  return (
    <section id="plan" className="py-16 sm:py-24 bg-parchment scroll-mt-28">
      <Container className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] bg-paper border border-line shadow-lift p-6 sm:p-9">
          <Eyebrow>Let us know you’re coming</Eyebrow>
          <h2 className="mt-3 font-display font-bold text-4xl">Plan my visit</h2>
          <p className="mt-2 mb-6 text-stone text-lg">We’ll be ready to welcome you and answer any questions.</p>
          <SiteForm name={church.formNames.visit} submitLabel="Plan my visit" success={{ title: 'We can’t wait to meet you!', text: 'Your visit is on our list. Someone from Saint Paul’s will reach out before Sunday with anything you need to know.' }}
            onSubmitted={(d) => { const [first, ...rest] = (d.name || 'Guest').split(' '); upsert('members', { id: uid('m'), first, last: rest.join(' ') || '(guest)', email: d.email ?? '', phone: d.phone ?? '', householdId: 'hh_web', status: 'visitor', joinedAt: '', firstVisit: d.date || todayIso(), ministryIds: [], tags: ['Planned visit (website)', d.campus ?? ''].filter(Boolean), consent: { email: !!d.email, sms: d.texts === 'yes' }, lastContact: '', address: '', notes: [d.party && `Party of ${d.party}`, d.kids && `Kids: ${d.kids}`, d.notes].filter(Boolean).join(' · '), volunteerInterests: [] }); log(d.name || 'Guest', 'Planned a visit on the website', `${d.campus ?? 'Campus'} · ${d.date || 'Sunday'}`) }}>
            <input type="hidden" name="type" value="Plan a visit" />
            <div className="grid gap-4 sm:grid-cols-2">
              <F label="Your name" name="name" required autoComplete="name" />
              <F label="Campus" name="campus" as="select" required options={['Creighton · 9:00 AM', 'Belt · 11:30 AM', 'Online first, in person later']} />
              <F label="Which Sunday?" name="date" type="date" />
              <F label="How many in your group?" name="party" type="number" />
              <F label="Phone" name="phone" type="tel" autoComplete="tel" />
              <F label="Email" name="email" type="email" autoComplete="email" />
              <F label="Children’s ages (if any)" name="kids" placeholder="e.g. 4 and 9" className="sm:col-span-2" />
              <F label="Anything we should know?" name="notes" as="textarea" rows={3} className="sm:col-span-2" hint="(wheelchair, first time in church, prayer need...)" />
            </div>
            <Check name="texts" label="Text me a reminder and directions the day before." />
          </SiteForm>
        </div>
        <div id="ride" className="rounded-[32px] bg-canopy text-white p-6 sm:p-9 scroll-mt-28">
          <Bus size={36} className="text-glow" />
          <h2 className="mt-3 font-display font-bold text-4xl">Need a ride?</h2>
          <p className="mt-2 text-white/85 text-lg">Our Transportation ministry helps members and neighbors get to worship and programs. Call <a href={church.transportHref} className="font-bold underline underline-offset-4">{church.transportPhone}</a> or send a request.</p>
          <div className="mt-6 rounded-3xl bg-paper text-ink p-5 sm:p-6">
            <SiteForm name={church.formNames.help} submitLabel="Request a ride" success={{ title: 'Request received.', text: 'The Transportation ministry will call to confirm your pickup time.' }}
              onSubmitted={(d) => { upsert('services', { id: uid('sv'), program: 'transportation', name: d.name || 'Neighbor', contact: d.phone || '', text: `Ride request: ${d.where ?? ''} to ${d.forwhat ?? 'Sunday worship'}. ${d.notes ?? ''}`.trim(), status: 'new', date: todayIso() }); log(d.name || 'Neighbor', 'Requested a ride on the website', d.forwhat || 'Sunday worship') }}>
              <input type="hidden" name="type" value="Ride request" />
              <F label="Your name" name="name" required autoComplete="name" />
              <F label="Phone" name="phone" type="tel" required autoComplete="tel" />
              <F label="Pickup neighborhood or address" name="where" required />
              <F label="Ride to" name="forwhat" as="select" options={['Sunday worship · Creighton', 'Sunday worship · Belt', 'Bible study', 'An event', 'Other']} />
            </SiteForm>
          </div>
        </div>
      </Container>
    </section>
  )
}

function CampusDetail({ c }: { c: Campus }) {
  return (
    <div className="rounded-[28px] bg-paper border border-line shadow-card overflow-hidden flex flex-col">
      {c.mapsEmbed ? <iframe title={`Map to the ${c.name}`} src={c.mapsEmbed} loading="lazy" className="h-56 w-full border-0" referrerPolicy="no-referrer-when-downgrade" /> : <div className="h-56 bg-night lights flex items-center justify-center"><PlayCircle size={64} className="text-orange" /></div>}
      <div className="p-6 flex-1 flex flex-col">
        <p className="font-caps font-semibold text-ember">{c.area}</p>
        <h3 className="mt-1 font-display font-bold text-3xl">{c.name}</h3>
        <p className="mt-1 font-display font-extrabold text-4xl text-grow">Sundays {c.time}</p>
        {c.note && <p className="text-stone">{c.note}</p>}
        <p className="mt-3 text-stone text-lg flex-1">{c.blurb}</p>
        {c.street && <p className="mt-3 font-semibold">{c.street}, {c.city} {c.zip}</p>}
        <div className="mt-5 flex flex-wrap gap-2">
          {c.directionsUrl && <GreenButton href={c.directionsUrl} icon={<Navigation size={16} />}>Directions</GreenButton>}
          {c.watchUrl && <GreenButton href={c.watchUrl} icon={<PlayCircle size={16} />}>Watch live</GreenButton>}
          <OutlineButton to={`/visit/${c.id}`}>Campus details</OutlineButton>
        </div>
      </div>
    </div>
  )
}

export default function Visit() {
  useDocumentMeta('Plan Your Visit | The Saint Paul’s Baptist Church', 'Your first Sunday at Saint Paul’s: choose the Creighton Campus (9 AM, Henrico) or the Belt Campus (11:30 AM, Richmond), what to expect, kids, rides and directions.')
  const expect = [
    { i: <Clock size={26} />, t: 'Arrive a little early', d: 'Fifteen minutes gives you time to park, find a seat and settle in.' },
    { i: <Baby size={26} />, t: 'Kids: imagiNATION', d: 'Bible study for children during worship at both campuses.' },
    { i: <Shirt size={26} />, t: 'Come as you are', d: 'Wear what makes you comfortable. God is more interested in you than your outfit.' },
    { i: <Car size={26} />, t: 'Rides available', d: `No car? Call ${church.transportPhone}.` },
  ]
  return (
    <>
      <PageHero eyebrow="Plan your visit" title="We saved you a seat." photo="sanctuary-choir" text="Two campuses, one church. Pick the time that fits your Sunday and we’ll take care of the rest.">
        <PrimaryButton href="#plan" icon={<ArrowRight size={18} />}>Plan my visit</PrimaryButton>
        <OutlineButton href={links.watchLive.href} icon={<PlayCircle size={18} />}>Watch online first</OutlineButton>
      </PageHero>
      <section className="py-16 sm:py-24">
        <Container>
          <h2 className="display text-4xl sm:text-5xl">Choose your campus</h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">{campuses.map((c) => <CampusDetail key={c.id} c={c} />)}</div>
        </Container>
      </section>
      <section className="py-16 sm:py-24 bg-paper border-y border-line">
        <Container>
          <Eyebrow>Your first ten minutes</Eyebrow>
          <h2 className="mt-3 display text-4xl sm:text-5xl">What to expect</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {expect.map((x) => (
              <div key={x.t} className="rounded-[24px] bg-morning border border-line p-6">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-ember">{x.i}</span>
                <h3 className="mt-4 font-display font-bold text-2xl">{x.t}</h3>
                <p className="mt-2 text-stone text-lg">{x.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <VisitForms />
      <section className="py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <HelpCircle size={36} className="text-ember" />
            <h2 className="mt-3 display text-4xl sm:text-5xl">Questions guests ask</h2>
            <p className="mt-4 text-stone text-lg">Still wondering? Call <a href={church.phoneHref} className="font-bold text-grow underline underline-offset-4">{church.phone}</a>.</p>
          </div>
          <div className="grid gap-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-3xl border border-line bg-paper p-5 open:shadow-card">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-bold text-xl min-h-[44px]">{f.q}<span className="text-ember group-open:rotate-45 transition-transform text-3xl leading-none" aria-hidden="true">+</span></summary>
                <p className="mt-3 text-stone text-lg">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}

/** /visit/:campus */
export function CampusPage() {
  const { campus } = useParams()
  const c = campuses.find((x) => x.id === campus)
  useDocumentMeta(c ? `${c.name} · Sundays ${c.time} | The Saint Paul’s Baptist Church` : 'Visit | The Saint Paul’s Baptist Church', c?.blurb)
  if (!c) return <Navigate to="/visit" replace />
  const isOnline = c.id === 'online'
  return (
    <>
      <PageHero eyebrow={c.area} title={`${c.name}`} photo={isOnline ? 'bible-study' : c.id === 'creighton' ? 'worship-lights' : 'sanctuary-choir'} text={<><b className="text-ink">Sundays {c.time}</b>{c.note ? ` · ${c.note}` : ''}. {c.blurb}</>}>
        {c.directionsUrl && <PrimaryButton href={c.directionsUrl} icon={<Navigation size={18} />}>Get directions</PrimaryButton>}
        {isOnline && <PrimaryButton href={links.watchLive.href} icon={<PlayCircle size={18} />}>Watch live</PrimaryButton>}
        <OutlineButton href="#plan">Plan my visit</OutlineButton>
      </PageHero>
      <section className="py-16 sm:py-20">
        <Container className="grid gap-6 lg:grid-cols-3">
          {!isOnline ? (
            <>
              <div className="rounded-[28px] overflow-hidden border border-line bg-paper shadow-card lg:col-span-2"><iframe title={`Map to the ${c.name}`} src={c.mapsEmbed} loading="lazy" className="h-[380px] w-full border-0" referrerPolicy="no-referrer-when-downgrade" /></div>
              <div className="rounded-[28px] bg-parchment p-6 grid gap-4 content-start">
                <p className="flex gap-3"><MapPin className="text-ember shrink-0" /><span><b>{c.street}</b><br />{c.city} {c.zip}</span></p>
                <p className="flex gap-3"><Car className="text-ember shrink-0" />{/* TODO: confirm with church: parking lots, overflow and accessible entrances per campus. */}<span>Ask us about parking and the easiest entrance when you plan your visit.</span></p>
                <p className="flex gap-3"><Accessibility className="text-ember shrink-0" /><span>Need help getting in? Tell us on the visit form and we’ll be ready.</span></p>
                <p className="flex gap-3"><Phone className="text-ember shrink-0" /><a href={church.phoneHref} className="hit font-bold text-grow underline underline-offset-4">{church.phone} {church.phoneWord}</a></p>
                <p className="flex gap-3"><Leaf className="text-orange shrink-0 mt-1" /><span>On this campus: {c.id === 'creighton' ? 'The Commons, Fire on Fridays, Refiners and Encore Bible study, Fresh Food Distribution (Fridays 4 PM), the Christmas production.' : 'Dignity on the Go mobile showers (Wednesdays 10 AM), Refiners Bible study (Tuesdays 11 AM), Freeform Fridays for young adults.'}</span></p>
              </div>
            </>
          ) : (
            <div className="lg:col-span-3 grid gap-4 sm:grid-cols-3">
              {[{ h: links.watchLive.href, t: 'MySPBC.tv', d: 'Live Sundays at 9:00 AM' }, { h: links.youtube.href, t: 'YouTube @myspbc', d: 'Live and Weekend Worship replays' }, { h: links.facebook.href, t: 'Facebook @myspbc', d: 'Live with your church family' }].map((x) => (
                <a key={x.t} href={x.h} target="_blank" rel="noopener noreferrer" className="rounded-[24px] bg-paper border border-line p-6 shadow-card hover:-translate-y-1 transition-transform"><PlayCircle className="text-ember" size={30} /><p className="mt-3 font-display font-bold text-2xl">{x.t}</p><p className="text-stone">{x.d}</p></a>
              ))}
            </div>
          )}
        </Container>
      </section>
      <section className="pb-6"><Container><Link to="/visit" className="inline-flex items-center gap-2 font-bold text-grow min-h-[48px]">← All campuses</Link></Container></section>
      <VisitForms />
      <section className="py-14"><Container><Photo name="prayer-pew" className="aspect-[21/9] rounded-[32px]" /></Container></section>
    </>
  )
}
