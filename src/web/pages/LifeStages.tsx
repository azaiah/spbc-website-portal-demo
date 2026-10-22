import { Link, useParams, Navigate } from 'react-router-dom'
import { ArrowRight, CalendarDays, Users, Mail } from 'lucide-react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { useDemo } from '@/data/store'
import { uid } from '@/data/ids'
import { daysFromNow } from '@/data/dates'
import { church, lifeStages } from '@/config/site'
import { events, upcomingEvents } from '@/data/events'
import { PageHero, Container, Eyebrow, PrimaryButton, OutlineButton, Leaf } from '../ui'
import { LifeStageFinder } from '../LifeStageFinder'
import { SiteForm, F } from '../forms'
import { EventCard } from '../home/Sections'

export default function LifeStages() {
  useDocumentMeta('Life Stages | The Saint Paul’s Baptist Church', 'imagiNATION, SMB, Dreamchasers, ASPIRE, Fusion, Encore, Prime Time and Refiners: pastoral care, Bible study and friends for every season of life at Saint Paul’s.')
  return (
    <>
      <PageHero eyebrow="Pastoral care for every life stage" title="A pastor and a place for every season." tone="lilac" text="Saint Paul’s cares for people in eight life stages, from birth to 70 and beyond. Each one has its own Life Stage Pastor, Bible study and friends." />
      <section className="py-14 sm:py-20"><Container><LifeStageFinder /></Container></section>
      <section className="pb-20 sm:pb-28">
        <Container>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {lifeStages.map((s) => (
              <li key={s.id}>
                <Link to={`/life-stages/${s.id}`} className="group relative block h-full overflow-hidden rounded-[28px] p-7 text-white min-h-[300px] hover:-translate-y-1 transition-transform" style={{ background: `linear-gradient(160deg, ${s.color}, #17131C 160%)` }}>
                  <Leaf size={170} className="absolute -right-8 -bottom-10 text-white/10 group-hover:rotate-12 transition-transform duration-700" />
                  <p className="font-caps font-semibold text-white/85">Ages {s.ages}</p>
                  <p className="mt-1 font-display font-extrabold text-[2rem] xl:text-[2.2rem] leading-tight tracking-tight">{s.name}</p>
                  <p className="mt-3 text-white/90 text-lg leading-snug">{s.blurb}</p>
                  <p className="mt-4 text-[16px] text-white/80">Life Stage Pastor</p>
                  <p className="font-bold text-lg">{s.pastor}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  )
}

export function LifeStagePage() {
  const { id } = useParams()
  const s = lifeStages.find((x) => x.id === id)
  const { upsert, log } = useDemo()
  useDocumentMeta(s ? `${s.name} (ages ${s.ages}) | The Saint Paul’s Baptist Church` : 'Life Stages | The Saint Paul’s Baptist Church', s?.blurb)
  if (!s) return <Navigate to="/life-stages" replace />
  const related = upcomingEvents().filter((e) => e.lifeStages?.includes(s.id))
  const fallback = related.length ? related : upcomingEvents().slice(0, 2)
  const idx = lifeStages.findIndex((x) => x.id === s.id)
  const prev = lifeStages[idx - 1], next = lifeStages[idx + 1]
  return (
    <>
      <section className="relative overflow-hidden text-white" style={{ background: `linear-gradient(150deg, ${s.color}, #17131C 150%)` }}>
        <Leaf size={520} className="absolute -right-24 -top-10 text-white/[0.07]" />
        <Container className="relative pt-36 sm:pt-44 pb-16 sm:pb-24">
          <p className="font-caps font-semibold text-white/85">Life stage · Ages {s.ages}</p>
          <h1 className="mt-3 font-display font-extrabold tracking-[-0.03em] text-6xl sm:text-8xl">{s.name}</h1>
          <p className="mt-5 max-w-2xl text-2xl text-white/90 leading-relaxed">{s.blurb}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryButton href="#connect" icon={<ArrowRight size={18} />}>Connect with {s.name}</PrimaryButton>
            <Link to="/life-stages" className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 min-h-[52px] font-bold hover:bg-white/10">All life stages</Link>
          </div>
        </Container>
      </section>
      <section className="py-14 sm:py-20">
        <Container className="grid gap-5 md:grid-cols-3">
          <div className="rounded-[24px] bg-paper border border-line p-6 shadow-card"><Users className="text-ember" size={28} /><p className="mt-3 text-stone">Life Stage Pastor</p><p className="font-display font-bold text-2xl">{s.pastor}</p></div>
          <div className="rounded-[24px] bg-paper border border-line p-6 shadow-card"><CalendarDays className="text-ember" size={28} /><p className="mt-3 text-stone">Bible study</p><p className="font-display font-bold text-2xl">{s.study ?? 'Ask us about this season’s schedule'}</p></div>
          <div className="rounded-[24px] bg-paper border border-line p-6 shadow-card"><Mail className="text-ember" size={28} /><p className="mt-3 text-stone">Reach the team</p>{s.email ? <a href={`mailto:${s.email}`} className="hit font-display font-bold text-2xl text-grow break-all">{s.email}</a> : <a href="#connect" className="font-display font-bold text-2xl text-grow">Send a note below</a>}</div>
        </Container>
      </section>
      <section className="pb-14 sm:pb-20">
        <Container>
          <Eyebrow>Coming up</Eyebrow>
          <h2 className="mt-3 display text-4xl">{related.length ? `For ${s.name}` : 'Across Saint Paul’s'}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{fallback.slice(0, 3).map((e) => <EventCard key={e.slug} e={e} />)}</div>
          {events.length > 0 && <div className="mt-6"><OutlineButton to="/events">All events</OutlineButton></div>}
        </Container>
      </section>
      <section id="connect" className="py-16 sm:py-24 bg-parchment scroll-mt-28">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] items-start">
          <div>
            <Eyebrow>Get connected</Eyebrow>
            <h2 className="mt-3 display text-4xl sm:text-5xl">We’ll help you find your people.</h2>
            <p className="mt-4 text-xl text-stone">Send a note and the {s.name} team will reach out with this season’s groups and studies.</p>
          </div>
          <div className="rounded-[32px] bg-paper border border-line shadow-lift p-6 sm:p-9">
            <SiteForm name={church.formNames.volunteer} submitLabel={`Connect me with ${s.name}`} success={{ title: 'You’re connected!', text: `The ${s.name} team will reach out soon.` }}
              onSubmitted={(d) => { upsert('tasks', { id: uid('t'), title: `${s.name}: connect ${d.name || 'a guest'} (${d.phone || d.email || 'no contact'})`, assigneeId: `m_${3 + idx}`, due: daysFromNow(3), status: 'todo', module: 'ministries', priority: 'normal' }); log(d.name || 'Website visitor', 'Asked to connect with a life stage', s.name) }}>
              <input type="hidden" name="ministry" value={s.name} />
              <div className="grid gap-4 sm:grid-cols-2">
                <F label="Your name" name="name" required autoComplete="name" />
                <F label="Phone" name="phone" type="tel" autoComplete="tel" />
                <F label="Email" name="email" type="email" autoComplete="email" className="sm:col-span-2" />
                <F label="Anything we should know?" name="message" as="textarea" rows={3} className="sm:col-span-2" />
              </div>
            </SiteForm>
          </div>
        </Container>
      </section>
      <nav aria-label="Other life stages" className="py-10">
        <Container className="flex justify-between gap-4 flex-wrap">
          {prev ? <Link to={`/life-stages/${prev.id}`} className="font-bold text-grow min-h-[48px] inline-flex items-center">← {prev.name}</Link> : <span />}
          {next && <Link to={`/life-stages/${next.id}`} className="font-bold text-grow min-h-[48px] inline-flex items-center">{next.name} →</Link>}
        </Container>
      </nav>
    </>
  )
}
