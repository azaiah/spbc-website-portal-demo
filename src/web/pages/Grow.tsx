import { Link } from 'react-router-dom'
import { BookOpen, PlayCircle, Users, Compass, Sprout, GraduationCap, HandHeart, Smartphone, Download, Mail, Flower2, Briefcase, ShoppingBag, Wallet, UserPlus, Bus, LogIn, ArrowRight, QrCode } from 'lucide-react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { useDemo } from '@/data/store'
import { uid } from '@/data/ids'
import { daysFromNow } from '@/data/dates'
import { church, lifeStages } from '@/config/site'
import { links } from '@/config/links'
import { PageHero, Container, Eyebrow, PrimaryButton, OutlineButton, GreenButton, Photo, Leaf, Ext } from '../ui'
import { SiteForm, F, Check } from '../forms'

export default function Grow() {
  useDocumentMeta('Grow: THE BRIDGE, GPS and groups | The Saint Paul’s Baptist Church', 'THE BRIDGE online Bible study every Thursday, the weekly GPS (Grow, Pray, Serve) guide, life-stage groups and the DNA new members class at Saint Paul’s.')
  const { upsert, log } = useDemo()
  return (
    <>
      <PageHero eyebrow="Grow" title="Grow into the person God created you to be." photo="bible-study" text="Our mission in one sentence. Here’s how people at Saint Paul’s grow week to week." />
      <section className="py-16 sm:py-24">
        <Container className="grid gap-5 lg:grid-cols-3">
          <article className="rounded-[28px] bg-possibility text-white p-7 lg:col-span-2 relative overflow-hidden">
            <Leaf size={260} className="absolute -right-10 -bottom-14 text-white/10" />
            <BookOpen size={34} className="text-glow" />
            <h2 className="mt-4 font-display font-extrabold text-5xl">THE BRIDGE</h2>
            <p className="mt-1 font-semibold text-glow text-xl">Online Bible study · Thursdays 11:00 AM or 7:00 PM</p>
            <p className="mt-4 text-xl text-white/90 max-w-2xl">This fall: <b>Joy Is My Superpower</b>, a study in Philippians on holding on to joy, finding peace and living with purpose, no matter what life brings.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryButton href={links.watchLive.href} icon={<PlayCircle size={18} />}>Join online</PrimaryButton>
              <a href={links.theBridge.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 min-h-[52px] font-bold hover:bg-white/10">Replay previous lessons</a>
            </div>
          </article>
          <article id="gps" className="rounded-[28px] bg-paper border border-line p-7 shadow-card scroll-mt-28">
            <Compass size={34} className="text-ember" />
            <h2 className="mt-4 font-display font-extrabold text-4xl">Your weekly GPS</h2>
            <p className="mt-1 font-semibold text-ember">Grow · Pray · Serve</p>
            <p className="mt-3 text-lg text-stone">Each Sunday’s message comes with a GPS guide to apply it all week, plus a student guide for THE BRIDGE.</p>
            <div className="mt-5 flex flex-wrap gap-2"><GreenButton href={links.bulletin.href} icon={<Download size={16} />}>This week’s e-bulletin</GreenButton></div>
          </article>
        </Container>
      </section>
      <section id="guides" className="pb-16 sm:pb-24 scroll-mt-28">
        <Container>
          <div className="rounded-[28px] bg-parchment p-6 sm:p-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-start">
            <div>
              <Mail size={32} className="text-ember" />
              <h2 className="mt-3 display text-4xl">Get the guides every week</h2>
              <p className="mt-3 text-lg text-stone">The GPS message application guide and THE BRIDGE student guide, in your inbox.</p>
            </div>
            <SiteForm name={church.formNames.guides} submitLabel="Subscribe" success={{ title: 'You’re subscribed.', text: 'Look for the guides in your inbox each week.' }}
              onSubmitted={(d) => { upsert('tasks', { id: uid('t'), title: `Add ${d.email} to the weekly guides list (${d.guides || 'GPS'})`, assigneeId: 'm_12', due: daysFromNow(2), status: 'todo', module: 'comms', priority: 'low' }); log(d.name || 'Website visitor', 'Subscribed to weekly guides', d.guides || 'GPS') }}>
              <div className="grid gap-4 sm:grid-cols-2">
                <F label="Name" name="name" autoComplete="name" />
                <F label="Email" name="email" type="email" required autoComplete="email" />
                <F label="Which guides?" name="guides" as="select" options={['Both guides', 'GPS message guide', 'THE BRIDGE student guide']} className="sm:col-span-2" />
              </div>
            </SiteForm>
          </div>
        </Container>
      </section>
      <section id="groups" className="py-16 sm:py-24 bg-paper border-y border-line scroll-mt-28">
        <Container className="grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <Eyebrow>Find a group you love</Eyebrow>
            <h2 className="mt-3 display text-4xl sm:text-5xl">God created us for community.</h2>
            <p className="mt-4 text-xl text-stone">Small groups meet almost every day of the week, organized by semester and life stage. Browse groups and sign up in the SPBC app, or let us help you choose.</p>
            {/* TODO: confirm with church: public URL for the group semester listing (Rock group finder). */}
            <div className="mt-6 flex flex-wrap gap-3"><PrimaryButton to="/app" icon={<Smartphone size={18} />}>Find a group in the app</PrimaryButton><OutlineButton to="/life-stages">Groups by life stage</OutlineButton></div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {lifeStages.filter((s) => s.study).map((s) => (
              <li key={s.id}><Link to={`/life-stages/${s.id}`} className="block rounded-2xl border border-line p-4 hover:border-grow"><span className="font-display font-bold text-xl" style={{ color: s.color }}>{s.name}</span><span className="block text-stone">{s.study}</span></Link></li>
            ))}
          </ul>
        </Container>
      </section>
      <section className="py-16 sm:py-24">
        <Container className="grid gap-5 md:grid-cols-3">
          {[
            { id: 'dna', i: <Sprout size={30} />, t: 'DNA new members class', d: 'Ready to join Saint Paul’s? DNA walks you through who we are and how to plug in.', to: '/next-steps#dna' },
            { id: 'vu', i: <GraduationCap size={30} />, t: 'Volunteer University', d: 'A quarterly one-day experience at Creighton to equip everyone who serves.', to: '/serve' },
            { id: 'pray', i: <HandHeart size={30} />, t: '7:14 Prayer', d: 'Pray with your church family every Wednesday at 7:14 AM by phone.', to: '/prayer' },
          ].map((c) => (
            <Link key={c.id} to={c.to} className="rounded-[24px] bg-paper border border-line p-6 shadow-card hover:-translate-y-1 transition-transform"><span className="text-ember">{c.i}</span><h3 className="mt-3 font-display font-bold text-2xl">{c.t}</h3><p className="mt-2 text-lg text-stone">{c.d}</p><span className="mt-3 inline-flex items-center gap-1 font-bold text-grow">Learn more <ArrowRight size={16} /></span></Link>
          ))}
        </Container>
      </section>
    </>
  )
}

export function Serve() {
  useDocumentMeta('Serve | The Saint Paul’s Baptist Church', 'Discover how you were created to serve. Take the MyFitAssessment, join Volunteer University and find your place on a team at Saint Paul’s.')
  const { upsert, log } = useDemo()
  return (
    <>
      <PageHero eyebrow="Volunteer with us" title="Discover how you were created to serve." tone="lilac" text="Take the MyFitAssessment, come to Volunteer University and find a team where your gifts make a difference." />
      <section className="py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start">
          <div className="grid gap-4">
            <div id="myfit" className="rounded-[28px] bg-grow text-white p-7 scroll-mt-28">
              <Users size={32} className="text-glow" />
              <h2 className="mt-3 font-display font-extrabold text-4xl">MyFitAssessment</h2>
              <p className="mt-2 text-lg text-white/90">A short assessment that helps match your gifts, passions and schedule to a place to serve. Tell us you’re interested and we’ll send it to you.</p>
              {/* TODO: confirm with church: the MyFitAssessment link (the old homepage promised it but never linked it). */}
            </div>
            <div className="rounded-[28px] bg-paper border border-line p-7">
              <GraduationCap size={32} className="text-ember" />
              <h2 className="mt-3 font-display font-bold text-3xl">Volunteer University</h2>
              <p className="mt-2 text-lg text-stone">A quarterly, one-day experience at the Creighton Campus designed to equip everyone who serves, whether every week or every now and then.</p>
              <Ext href={links.calendar.href} className="mt-3 inline-flex items-center gap-1 font-bold text-grow min-h-[44px]">See the next date on the calendar <ArrowRight size={16} /></Ext>
            </div>
          </div>
          <div className="rounded-[32px] bg-paper border border-line shadow-lift p-6 sm:p-9">
            <h2 className="font-display font-bold text-4xl">I want to serve</h2>
            <p className="mt-2 mb-6 text-stone text-lg">We’ll send the MyFitAssessment and connect you with a team.</p>
            <SiteForm name={church.formNames.volunteer} submitLabel="Count me in" success={{ title: 'Thank you for saying yes!', text: 'We’ll send your MyFitAssessment and connect you with a team leader.' }}
              onSubmitted={(d) => { upsert('tasks', { id: uid('t'), title: `Volunteer: send MyFit to ${d.name} (${d.ministry || 'any team'})`, assigneeId: 'm_12', due: daysFromNow(3), status: 'todo', module: 'people', priority: 'normal' }); log(d.name || 'Website visitor', 'Signed up to serve', d.ministry || 'Any team') }}>
              <div className="grid gap-4 sm:grid-cols-2">
                <F label="Your name" name="name" required autoComplete="name" />
                <F label="Campus" name="campus" as="select" options={['Creighton', 'Belt', 'Online / either']} />
                <F label="Email" name="email" type="email" required autoComplete="email" />
                <F label="Phone" name="phone" type="tel" autoComplete="tel" />
                <F label="Where would you like to help?" name="ministry" as="select" options={['Not sure yet', 'Greeting and hospitality', 'Children (imagiNATION)', 'Students (SMB)', 'Outreach: food and showers', 'Transportation', 'Media and production', 'Music', 'Culinary Arts', 'Prayer']} className="sm:col-span-2" />
                <F label="Anything else?" name="message" as="textarea" rows={3} className="sm:col-span-2" />
              </div>
              <Check name="updates" label="Tell me about the next Volunteer University." defaultChecked />
            </SiteForm>
          </div>
        </Container>
      </section>
    </>
  )
}

/**
 * Next steps: every "Let's stay connected" item from the old homepage, which were all unlinked text.
 * TODO: confirm with church — real URLs for DNA schedule, Sqwire, careers, store and flowers.
 */
export function NextSteps() {
  useDocumentMeta('Next Steps | The Saint Paul’s Baptist Church', 'Join Saint Paul’s, take the DNA new members class, get a ride, update your profile, find financial wellness resources and more.')
  const items = [
    { id: 'join', i: <UserPlus size={26} />, t: 'Join Saint Paul’s', d: 'Ready to make Saint Paul’s your church home? Tell us and a member of our team will walk you through it.', cta: { label: 'I’m ready to join', to: '/contact?subject=Joining%20Saint%20Paul%E2%80%99s' } },
    { id: 'dna', i: <Sprout size={26} />, t: 'DNA new members class', d: 'Learn who we are, what we believe and how to grow and serve here. Ask for the current class schedule.', cta: { label: 'Ask for the schedule', to: '/contact?subject=DNA%20class' } },
    { id: 'ride', i: <Bus size={26} />, t: 'Transportation', d: 'Need a ride to worship or a program? Call 804.463.2429.', cta: { label: 'Call 804.463.2429', href: church.transportHref } },
    { id: 'financial-wellness', i: <Wallet size={26} />, t: 'Financial wellness with Sqwire', d: 'Tools and coaching to help you achieve financial wellness.', cta: { label: 'Ask about Sqwire', to: '/contact?subject=Sqwire%20financial%20wellness' } },
    { id: 'profile', i: <LogIn size={26} />, t: 'Update your member profile', d: 'Keep your contact information, household and life stage up to date.', cta: { label: 'Open my profile', href: '/login?next=/portal/profile' } },
    { id: 'careers', i: <Briefcase size={26} />, t: 'Work at Saint Paul’s', d: 'See our current job openings and apply.', cta: { label: 'Ask about openings', to: '/contact?subject=Job%20openings' } },
    { id: 'store', i: <ShoppingBag size={26} />, t: 'Saint Paul’s store', d: 'Custom print-on-demand apparel and gifts.', cta: { label: 'Ask about the store', to: '/contact?subject=Store' } },
    { id: 'flowers', i: <Flower2 size={26} />, t: 'Flowers and gifts', d: 'Send flowers, plants, balloons or baskets to someone you love.', cta: { label: 'Ask how to order', to: '/contact?subject=Flowers' } },
  ]
  return (
    <>
      <PageHero eyebrow="Let’s stay connected" title="Your next step." text="Whatever you’re looking for, it starts here." />
      <section className="py-16 sm:py-24">
        <Container>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((x) => (
              <li key={x.id} id={x.id} className="rounded-[24px] bg-paper border border-line p-6 shadow-card flex flex-col scroll-mt-28">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-ember">{x.i}</span>
                <h2 className="mt-4 font-display font-bold text-2xl leading-tight">{x.t}</h2>
                <p className="mt-2 text-stone text-lg flex-1">{x.d}</p>
                {'to' in x.cta && x.cta.to ? <Link to={x.cta.to} className="mt-4 inline-flex items-center gap-1 font-bold text-grow min-h-[48px]">{x.cta.label} <ArrowRight size={16} /></Link> : <Ext href={(x.cta as { href: string }).href} className="mt-4 inline-flex items-center gap-1 font-bold text-grow min-h-[48px]">{x.cta.label} <ArrowRight size={16} /></Ext>}
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  )
}

export function AppPage() {
  useDocumentMeta('Get the SPBC App | Saint Paul’s Everywhere', 'Watch messages, send and receive prayer, find a group and register for events in the free SPBC app. Saint Paul’s Everywhere.')
  return (
    <>
      <section className="relative overflow-hidden bg-canopy text-white">
        <Leaf size={560} className="absolute -right-24 -top-24 text-white/[0.06]" />
        <Container className="relative pt-36 sm:pt-44 pb-16 sm:pb-24 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div>
            <p className="font-caps font-semibold text-glow text-lg">Saint Paul’s Everywhere</p>
            <h1 className="mt-3 display text-6xl sm:text-7xl">One church. One mission. Wherever you are.</h1>
            <p className="mt-5 text-2xl text-white/90">Stay connected and growing every day with the free SPBC app.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryButton href={links.appStore.href} icon={<Smartphone size={18} />}>App Store</PrimaryButton>
              <a href={links.googlePlay.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-white/50 px-6 min-h-[52px] font-bold hover:bg-white/10"><Smartphone size={18} /> Google Play</a>
            </div>
            <p className="mt-4 text-white/75 flex items-center gap-2"><QrCode size={18} /> Or open grow.myspbc.org/getapp on your phone.</p>
          </div>
          <Photo name="bible-study" className="aspect-[4/5] max-h-[560px] rounded-[32px] shadow-lift" />
        </Container>
      </section>
      <section className="py-16 sm:py-24">
        <Container>
          <h2 className="display text-4xl sm:text-5xl">Four things you’ll come back to</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: <PlayCircle size={28} />, t: 'Watch messages', d: 'Watch live, catch up later in the week, or send a message to someone who needs it.' },
              { i: <HandHeart size={28} />, t: 'Prayer', d: 'Share what you’re carrying, pray for others and see how many people lifted your name.' },
              { i: <Users size={28} />, t: 'Find your group', d: 'Browse small groups and sign up right in the app.' },
              { i: <BookOpen size={28} />, t: 'Never miss what’s happening', d: 'See what’s coming and register in a couple of taps.' },
            ].map((x) => <li key={x.t} className="rounded-[24px] bg-paper border border-line p-6 shadow-card"><span className="text-ember">{x.i}</span><h3 className="mt-3 font-display font-bold text-2xl">{x.t}</h3><p className="mt-2 text-lg text-stone">{x.d}</p></li>)}
          </ul>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ['Do I still need the Pushpay app?', 'If you already give with the Pushpay app, keep using it. The SPBC app also has a giving link to the same Pushpay giving page.'],
              ['I have the old app with the green logo.', 'That app is no longer updated. Delete it and install the new SPBC app for the latest features.'],
              ['Do group leaders still use the LEAD app?', 'No. Its features are moving into the single new SPBC app.'],
            ].map(([q, a]) => <div key={q} className="rounded-[24px] bg-parchment p-6"><p className="font-display font-bold text-xl">{q}</p><p className="mt-2 text-stone text-lg">{a}</p></div>)}
          </div>
        </Container>
      </section>
    </>
  )
}
