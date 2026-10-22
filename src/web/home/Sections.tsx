import { Link } from 'react-router-dom'
import { ArrowRight, Car, Baby, Clock, Shirt, HandHeart, BookOpen, Sprout, Heart, PlayCircle, Smartphone, Phone, MapPin, CalendarPlus, LifeBuoy, ShowerHead, Apple, Stethoscope, Users } from 'lucide-react'
import { church, weekly, campuses, leadership } from '@/config/site'
import { links } from '@/config/links'
import { upcomingEvents, type PublicEvent, nextDate } from '@/data/events'
import { Container, Eyebrow, Photo, PrimaryButton, GreenButton, OutlineButton, SectionHeading, Leaf, flyerSrc, Ext } from '../ui'
import { Rise, Stagger, item } from '../motion'
import { motion } from 'framer-motion'
import { LifeStageFinder } from '../LifeStageFinder'

const kindColor: Record<string, string> = { worship: 'bg-orange-50 text-ember', study: 'bg-possibility-50 text-possibility', care: 'bg-grow-50 text-grow', outreach: 'bg-grow-50 text-canopy', fellowship: 'bg-lilac text-possibility', youth: 'bg-orange-50 text-ember', music: 'bg-orange-50 text-ember' }

/** This week at Saint Paul's, chunked by day (Miller's law). */
export function ThisWeek() {
  const days = ['Sunday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  return (
    <section className="py-20 sm:py-28" aria-labelledby="week-h">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading eyebrow="This week" title="There’s something for you every week." />
          <Ext href={links.calendar.href} className="inline-flex items-center gap-2 font-bold text-grow min-h-[48px] hover:underline underline-offset-4">Full church calendar <ArrowRight size={18} /></Ext>
        </div>
        <h2 id="week-h" className="sr-only">This week</h2>
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {days.map((d) => (
            <motion.div key={d} variants={item} className="rounded-[24px] bg-paper border border-line p-5 flex flex-col gap-3">
              <p className="font-display font-extrabold text-2xl text-ink">{d}</p>
              {weekly.filter((w) => w.day === d).map((w) => (
                <Link key={w.title} to={w.href ?? '/events'} className="group block rounded-2xl p-3 -mx-1 hover:bg-parchment">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-[14px] font-bold ${kindColor[w.kind]}`}>{w.time}</span>
                  <span className="mt-1.5 block font-bold text-[17px] leading-snug text-ink group-hover:text-grow">{w.title}</span>
                  <span className="block text-[15px] text-stone">{w.where}</span>
                </Link>
              ))}
            </motion.div>
          ))}
        </Stagger>
      </Container>
    </section>
  )
}

/** Meet our pastor: facts only (no invented quotes). TODO: pastor portrait from the church. */
export function Pastor() {
  const years = new Date().getFullYear() - leadership.pastor.since
  return (
    <section className="py-20 sm:py-28 bg-parchment" aria-labelledby="pastor-h">
      <Container className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] items-center">
        <Rise>
          <div className="relative">
            <Photo name="sanctuary-choir" className="aspect-[4/3] rounded-[32px] shadow-lift" />
            <div className="absolute -bottom-6 -right-2 sm:-right-6 rounded-3xl bg-paper shadow-lift border border-line px-6 py-5">
              <p className="font-display font-extrabold text-5xl text-grow tabular-nums">{years}</p>
              <p className="text-stone font-semibold">years of Pastor &amp; People</p>
            </div>
          </div>
        </Rise>
        <div>
          <Eyebrow>Meet our pastor</Eyebrow>
          <h2 id="pastor-h" className="display text-[2.5rem] sm:text-6xl mt-4">Dr. Lance D. Watson, Sr.</h2>
          <p className="mt-2 text-xl font-semibold text-ember">Senior Pastor since 1985 · with First Lady Rose Watson</p>
          <div className="mt-6 space-y-4 text-xl text-stone leading-relaxed">
            <p>Pastor Watson grew up in Detroit, the 15th of 17 children, and credits the generosity of Detroit churches with helping his family through hard times. That sense of obligation shapes everything Saint Paul’s does: feeding the hungry, paying people’s bills, walking with people coming home from prison.</p>
            <p>Saint Paul’s is his first and only pastorate. This October the church celebrated 41 years of Pastor &amp; People.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <GreenButton to="/our-story#pastor" icon={<ArrowRight size={18} />}>More about Pastor Watson</GreenButton>
            <OutlineButton href={links.weekendWorship.href}>Watch a recent message</OutlineButton>
          </div>
        </div>
      </Container>
    </section>
  )
}

/** Plan your first visit: picture the first ten minutes. */
export function FirstVisit() {
  const cards = [
    { i: <MapPin size={26} />, t: 'Pick a campus', d: 'Creighton at 9:00 AM or Belt at 11:30 AM. Both have the same heart and the same Word.' },
    { i: <Car size={26} />, t: 'Park and come in', d: 'Arriving about 15 minutes early gives you time to park, find a seat and settle in. Need a ride? Call 804.463.2429.' },
    { i: <Baby size={26} />, t: 'Kids have a place', d: 'imagiNATION has Bible study for children during worship at both campuses.' },
    { i: <Shirt size={26} />, t: 'Come as you are', d: 'Wear what makes you comfortable. Worship is joyful, the choir is live and the message is practical.' },
  ]
  return (
    <section className="py-20 sm:py-28" aria-labelledby="visit-h">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] items-start">
          <div className="lg:sticky lg:top-32">
            <Eyebrow>Your first Sunday</Eyebrow>
            <h2 id="visit-h" className="display text-[2.5rem] sm:text-6xl mt-4 text-balance">Here’s what to expect.</h2>
            <p className="mt-5 text-xl text-stone leading-relaxed">No pressure and no spotlight. Tell us you’re coming and we’ll be ready to welcome you.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryButton to="/visit" size="lg" icon={<ArrowRight size={20} />}>Plan your visit</PrimaryButton>
            </div>
          </div>
          <Stagger className="grid gap-4 sm:grid-cols-2">
            {cards.map((c) => (
              <motion.div key={c.t} variants={item} className="rounded-[24px] bg-paper border border-line p-6 shadow-card">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-ember">{c.i}</span>
                <h3 className="mt-4 font-display font-bold text-2xl">{c.t}</h3>
                <p className="mt-2 text-stone text-lg leading-relaxed">{c.d}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  )
}

/** The year's theme band (anniversary theme until Nov 15, 2026). */
export function ThemeBand() {
  return (
    <section className="relative overflow-hidden bg-possibility text-white py-20 sm:py-24" aria-label="This year’s theme">
      <div aria-hidden="true" className="absolute inset-0 opacity-40 bg-[radial-gradient(50%_80%_at_85%_20%,rgba(243,128,31,0.6),transparent_70%)]" />
      <Leaf size={420} className="absolute -left-20 -bottom-32 text-white/[0.06]" />
      <Container className="relative grid gap-8 lg:grid-cols-[1fr_auto] items-end">
        <div>
          <p className="font-caps font-semibold text-glow">117th Church Anniversary · Sunday, November 15</p>
          <h2 className="mt-3 display text-5xl sm:text-7xl">{church.theme2026.title}</h2>
          <p className="mt-5 max-w-3xl font-serif italic text-2xl sm:text-3xl leading-snug text-white/95">“{church.theme2026.text}”</p>
          <p className="mt-3 font-caps font-semibold text-glow">{church.theme2026.ref}</p>
        </div>
        <PrimaryButton to="/events/church-anniversary" icon={<ArrowRight size={18} />}>Anniversary details</PrimaryButton>
      </Container>
    </section>
  )
}

/** GPS: Grow · Pray · Serve, plus Get help (as visible as Plan a visit). */
export function Pathways() {
  const paths = [
    { to: '/grow', i: <Sprout size={28} />, t: 'Grow', d: 'THE BRIDGE Bible study, life-stage groups and the DNA new members class.', c: 'from-grow to-canopy' },
    { to: '/prayer', i: <HandHeart size={28} />, t: 'Pray', d: '7:14 Prayer every Wednesday, our Prayer Team and counselors. You’re never alone.', c: 'from-possibility to-[#3d1f57]' },
    { to: '/serve', i: <Users size={28} />, t: 'Serve', d: 'Take the MyFitAssessment and discover how you were created to serve.', c: 'from-ember to-[#7a370a]' },
    { to: '/community/get-help', i: <LifeBuoy size={28} />, t: 'Get help', d: 'Fresh food, mobile showers, rides, emergency help and counseling. Start here.', c: 'from-ink to-[#2d2633]' },
  ]
  return (
    <section className="py-20 sm:py-28 bg-parchment" aria-labelledby="gps-h">
      <Container>
        <SectionHeading eyebrow="Your GPS" title="Grow. Pray. Serve." text={<>Every week’s message comes with a <b className="text-ink">GPS guide</b> to help you live it out. Here’s where to start.</>} />
        <h2 id="gps-h" className="sr-only">Grow, pray, serve</h2>
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {paths.map((p) => (
            <motion.div key={p.t} variants={item}>
              <Link to={p.to} className={`group relative block h-full overflow-hidden rounded-[28px] bg-gradient-to-br ${p.c} text-white p-7 min-h-[260px] hover:-translate-y-1 transition-transform`}>
                <Leaf size={140} className="absolute -right-6 -bottom-8 text-white/10 group-hover:scale-110 transition-transform duration-700" />
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">{p.i}</span>
                <h3 className="mt-5 font-display font-extrabold text-4xl">{p.t}</h3>
                <p className="mt-2 text-white/90 text-lg leading-relaxed">{p.d}</p>
                <span className="mt-4 inline-flex items-center gap-1 font-bold">Start <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
              </Link>
            </motion.div>
          ))}
        </Stagger>
      </Container>
    </section>
  )
}

export function LifeStagesSection() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="ls-h">
      <Container>
        <SectionHeading eyebrow="Pastoral care for every life stage" title="Find your people." text="From newborns to our 70+ Refiners, every season of life has its own pastor, Bible study and friends." />
        <h2 id="ls-h" className="sr-only">Life stages</h2>
        <div className="mt-10"><LifeStageFinder /></div>
      </Container>
    </section>
  )
}

/** Community: only real programs, no invented numbers. */
export function CommunitySection() {
  const items = [
    { i: <Apple size={24} />, t: 'Community Fresh Food Distribution', d: 'Fridays at 4:00 PM at Creighton, with Feed More.' },
    { i: <ShowerHead size={24} />, t: 'Dignity on the Go: Mobile Showers', d: 'Wednesdays at 10:00 AM at Belt.' },
    { i: <Stethoscope size={24} />, t: 'Health fairs and clinics', d: 'Free screenings and vaccines on campus through the year.' },
    { i: <Car size={24} />, t: 'Transportation', d: 'Rides to worship and programs: 804.463.2429.' },
  ]
  return (
    <section className="py-20 sm:py-28 bg-canopy text-white relative overflow-hidden" aria-labelledby="comm-h">
      <Leaf size={520} className="absolute -right-24 -top-24 text-white/[0.05]" />
      <Container className="relative grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <Eyebrow light>We’re finding needs and meeting them</Eyebrow>
          <h2 id="comm-h" className="display text-[2.5rem] sm:text-6xl mt-4 text-balance">Faith you can see from the street.</h2>
          <p className="mt-5 text-xl text-white/85 leading-relaxed">Saint Paul’s feeds the hungry, supports people without housing, helps with bills and walks with neighbors coming home from prison. If you need help, you don’t need to be a member to ask.</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {items.map((x) => (
              <li key={x.t} className="rounded-2xl bg-white/[0.07] border border-white/15 p-4 flex gap-3">
                <span className="mt-0.5 text-glow">{x.i}</span>
                <span><b className="block text-[17px]">{x.t}</b><span className="text-white/80 text-[16px]">{x.d}</span></span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryButton to="/community/get-help" icon={<ArrowRight size={18} />}>Get help</PrimaryButton>
            <Link to="/community" className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 min-h-[52px] font-bold hover:bg-white/10">See all outreach</Link>
          </div>
        </div>
        <Rise><Photo name="prayer-pew" className="aspect-[4/5] max-h-[620px] rounded-[32px] shadow-lift" /></Rise>
      </Container>
    </section>
  )
}

export function EventCard({ e, compact = false }: { e: PublicEvent; compact?: boolean }) {
  const d = new Date(nextDate(e) + 'T12:00:00')
  return (
    <Link to={`/events/${e.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[24px] bg-paper border border-line shadow-card hover:-translate-y-1 hover:shadow-lift transition-all">
      {!compact && e.flyer && (
        <div className="relative aspect-[4/3] overflow-hidden bg-parchment">
          <img src={flyerSrc(e.flyer)} alt={e.flyerAlt ?? ''} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-700" />
        </div>
      )}
      <div className="flex gap-4 p-5 flex-1">
        <div className="shrink-0 w-16 text-center rounded-2xl bg-orange-50 py-2 h-fit">
          <p className="font-caps text-[14px] font-bold text-ember uppercase">{d.toLocaleDateString('en-US', { month: 'short' })}</p>
          <p className="font-display font-extrabold text-3xl text-ink leading-none">{d.getDate()}</p>
        </div>
        <div className="min-w-0">
          {e.kicker && <p className="text-[15px] font-semibold text-possibility">{e.kicker}</p>}
          <h3 className="font-display font-bold text-2xl leading-tight group-hover:text-grow">{e.title}</h3>
          <p className="mt-1 text-[16px] text-stone flex items-start gap-1.5"><Clock size={16} className="mt-1 shrink-0" />{e.when}</p>
          <p className="text-[16px] text-stone flex items-start gap-1.5"><MapPin size={16} className="mt-1 shrink-0" />{e.where}</p>
        </div>
      </div>
    </Link>
  )
}

export function EventsSection() {
  const list = upcomingEvents().slice(0, 3)
  return (
    <section className="py-20 sm:py-28 bg-parchment" aria-labelledby="ev-h">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading eyebrow="Fall 2026 lineup" title="Faith, family, friends, fun and fellowship." />
          <GreenButton to="/events" icon={<CalendarPlus size={18} />}>All events</GreenButton>
        </div>
        <h2 id="ev-h" className="sr-only">Upcoming events</h2>
        <Stagger className="mt-10 grid gap-5 md:grid-cols-3">
          {list.map((e) => <motion.div key={e.slug} variants={item}><EventCard e={e} /></motion.div>)}
        </Stagger>
      </Container>
    </section>
  )
}

export function WatchSection() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="watch-h">
      <Container className="grid gap-10 lg:grid-cols-2 items-center">
        <a href={links.weekendWorship.href} target="_blank" rel="noopener noreferrer" className="group relative block aspect-video overflow-hidden rounded-[28px] shadow-lift bg-night" aria-label="Watch recent Sunday messages on YouTube (opens in a new tab)">
          <video className="absolute inset-0 h-full w-full object-cover opacity-80" autoPlay muted loop playsInline poster="/video/hero-poster.jpg" aria-hidden="true">
            <source src="/video/hero.webm" type="video/webm" />
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
          <span className="absolute inset-0 flex items-center justify-center"><span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-orange text-ink shadow-glow group-hover:scale-110 transition-transform"><PlayCircle size={40} /></span></span>
        </a>
        <div>
          <Eyebrow>Saint Paul’s Everywhere</Eyebrow>
          <h2 id="watch-h" className="display text-[2.5rem] sm:text-6xl mt-4">Worship with us from anywhere.</h2>
          <p className="mt-5 text-xl text-stone leading-relaxed">Sundays at 9:00 AM live at MySPBC.tv, YouTube and Facebook @myspbc. Missed it? Weekend Worship replays are up all week, along with THE BRIDGE and the 7:14 Prayer calls.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryButton href={links.watchLive.href} icon={<PlayCircle size={18} />}>Watch live</PrimaryButton>
            <OutlineButton to="/app" icon={<Smartphone size={18} />}>Get the SPBC app</OutlineButton>
          </div>
        </div>
      </Container>
    </section>
  )
}

export function GiveBand() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 bg-[linear-gradient(120deg,#FDE3CB_0%,#FFD7A3_45%,#F3801F_120%)]" aria-labelledby="give-h">
      <Leaf size={380} className="absolute right-6 -bottom-28 text-white/30" />
      <Container className="relative grid gap-8 lg:grid-cols-[1.2fr_auto] items-center">
        <div>
          <Eyebrow>Generosity</Eyebrow>
          <h2 id="give-h" className="display text-[2.5rem] sm:text-6xl mt-4 text-ink max-w-3xl">Every gift keeps the light moving.</h2>
          <p className="mt-4 text-xl text-ink/80 max-w-2xl leading-relaxed">Your giving feeds families on Fridays, puts showers on wheels at Belt and keeps the Word streaming to people who can’t get to church. Setting up a recurring gift takes about a minute.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Link to="/give" className="inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white px-8 min-h-[60px] text-lg font-bold hover:bg-canopy"><Heart size={20} /> Give now</Link>
          <a href={church.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink/25 text-ink px-8 min-h-[60px] text-lg font-bold hover:bg-white/40"><Phone size={18} /> Questions? Call us</a>
        </div>
      </Container>
    </section>
  )
}

/** Warm ending: prayer, contact, maps (Peak-End rule). */
export function Ending() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="end-h">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] bg-possibility text-white p-8 sm:p-10 relative overflow-hidden">
            <Leaf size={260} className="absolute -right-10 -bottom-16 text-white/10" />
            <Eyebrow light>You’re never alone</Eyebrow>
            <h2 id="end-h" className="mt-4 display text-5xl">Can we pray with you?</h2>
            <p className="mt-4 text-xl text-white/90 leading-relaxed">Our Intercessors and Counselors are here for you. Join 7:14 Prayer by phone every Wednesday at 7:14 AM: <a href={church.prayerLineHref} className="font-bold underline underline-offset-4">{church.prayerLine}</a>, then select 1.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <PrimaryButton to="/prayer" icon={<HandHeart size={18} />}>Send a prayer request</PrimaryButton>
              <a href={church.prayerLineHref} className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 min-h-[52px] font-bold hover:bg-white/10"><Phone size={18} /> Call the prayer line</a>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {campuses.filter((c) => c.street).map((c) => (
              <div key={c.id} className="rounded-[28px] overflow-hidden border border-line bg-paper shadow-card flex flex-col">
                <iframe title={`Map to the ${c.name}`} src={c.mapsEmbed} loading="lazy" className="h-48 w-full border-0" referrerPolicy="no-referrer-when-downgrade" />
                <div className="p-5 flex-1 flex flex-col">
                  <p className="font-display font-bold text-2xl">{c.name}</p>
                  <p className="text-stone">{c.street}<br />{c.city} {c.zip}</p>
                  <p className="mt-2 font-bold text-grow">Sundays {c.time}</p>
                  <a href={c.directionsUrl} target="_blank" rel="noopener noreferrer" className="mt-auto pt-4 inline-flex items-center gap-1.5 font-bold text-grow min-h-[48px] hover:underline">Get directions <ArrowRight size={16} /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-lg text-stone">
          <a href={church.phoneHref} className="inline-flex items-center gap-2 min-h-[48px] font-bold text-ink hover:text-grow"><Phone size={18} className="text-ember" /> {church.phone} {church.phoneWord}</a>
          <Link to="/contact" className="inline-flex items-center gap-2 min-h-[48px] font-bold text-ink hover:text-grow"><BookOpen size={18} className="text-ember" /> Contact the church</Link>
        </div>
      </Container>
    </section>
  )
}
