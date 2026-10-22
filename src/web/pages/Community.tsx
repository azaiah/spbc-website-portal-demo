import { Link } from 'react-router-dom'
import { Apple, ShowerHead, Stethoscope, Car, Baby, HandCoins, HeartHandshake, ArrowRight, Phone, Mail, Building2, Landmark, Flame, Medal } from 'lucide-react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { useDemo } from '@/data/store'
import { uid } from '@/data/ids'
import { todayIso } from '@/data/dates'
import { church } from '@/config/site'
import { links } from '@/config/links'
import type { ServiceProgram } from '@/data/types'
import { PageHero, Container, Eyebrow, PrimaryButton, OutlineButton, Photo, Leaf, Art } from '../ui'
import { SiteForm, F, Check } from '../forms'

const programs = [
  { i: <Apple size={26} />, t: 'Community Fresh Food Distribution', when: 'Fridays · 4:00 PM · Creighton', d: 'Fresh food for neighbors through December 11, with Feed More.' },
  { i: <ShowerHead size={26} />, t: 'Dignity on the Go: Mobile Showers', when: 'Wednesdays · 10:00 AM · Belt', d: 'A hot shower and a moment of dignity for neighbors without a place to wash.' },
  { i: <Baby size={26} />, t: 'Diaper pop-ups', when: 'Seasonal · with Urban Baby Beginnings', d: 'Diaper support for local families alongside our fresh food distribution.' },
  { i: <Stethoscope size={26} />, t: 'Health fairs and clinics', when: 'Seasonal · Creighton', d: 'Free screenings, nutrition, movement and on-campus vaccine clinics.' },
  { i: <Car size={26} />, t: 'Transportation', when: 'Call 804.463.2429', d: 'Rides to worship, Bible study and church programs.' },
  { i: <HandCoins size={26} />, t: 'Emergency financial assistance', when: 'Through the Saint Paul’s Community Foundation', d: 'Help with bills and emergencies, reviewed with care and confidentiality.' },
  { i: <HeartHandshake size={26} />, t: 'Prayer and counseling', when: 'Intercessors and Counselors', d: 'You’re never alone. Talk with someone who will pray and listen.' },
  { i: <Medal size={26} />, t: 'Veterans and civic life', when: 'Veterans Brunch · Your Voice, Your Vote', d: 'Honoring those who served and helping neighbors make their voices heard.' },
]

export default function Community() {
  useDocumentMeta('Community Outreach | The Saint Paul’s Baptist Church', 'Fresh food every Friday, mobile showers every Wednesday, health clinics, rides, emergency help and counseling from The Saint Paul’s Baptist Church in Richmond and Henrico.')
  return (
    <>
      <PageHero eyebrow="Community outreach" title="We’re finding needs and meeting them." photo="prayer-pew" tone="canopy" text="Every blessing brings an obligation. Saint Paul’s feeds the hungry, supports people without housing, helps with bills and walks with neighbors coming home from prison.">
        <PrimaryButton to="/community/get-help" icon={<ArrowRight size={18} />}>Get help</PrimaryButton>
        <Link to="/serve" className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 min-h-[52px] font-bold text-white hover:bg-white/10">Volunteer</Link>
      </PageHero>
      <section className="py-16 sm:py-24">
        <Container>
          <h2 className="display text-4xl sm:text-5xl">Ways we serve</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((p) => (
              <li key={p.t} className="rounded-[24px] bg-paper border border-line p-6 shadow-card">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-grow-50 text-grow">{p.i}</span>
                <h3 className="mt-4 font-display font-bold text-2xl leading-tight">{p.t}</h3>
                <p className="mt-1 font-semibold text-ember">{p.when}</p>
                <p className="mt-2 text-stone text-lg">{p.d}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <section className="py-16 sm:py-24 bg-parchment">
        <Container className="grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <Eyebrow>For partners and funders</Eyebrow>
            <h2 className="mt-3 display text-4xl sm:text-5xl">Partner with Saint Paul’s.</h2>
            <p className="mt-4 text-xl text-stone leading-relaxed">Saint Paul’s serves Southside Richmond and Eastern Henrico through the church and its nonprofit affiliates.</p>
            <dl className="mt-6 grid gap-3">
              <div className="rounded-2xl bg-paper border border-line p-5"><dt className="font-display font-bold text-xl">{church.nia.name}</dt><dd className="text-stone">501(c)(3) · EIN {church.nia.ein} · founded {church.nia.founded}</dd></div>
              <div className="rounded-2xl bg-paper border border-line p-5"><dt className="font-display font-bold text-xl">{church.foundation.name}</dt><dd className="text-stone">501(c)(3) · EIN {church.foundation.ein} · emergency financial assistance</dd></div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryButton href={links.outreachEmail.href} icon={<Mail size={18} />}>Email Outreach</PrimaryButton>
              <OutlineButton to="/city-of-possibility" icon={<Building2 size={18} />}>The City of Possibility</OutlineButton>
            </div>
          </div>
          <Photo name="worship-lights" className="aspect-[4/3] rounded-[32px] shadow-lift" />
        </Container>
      </section>
    </>
  )
}

const needToProgram: Record<string, ServiceProgram> = { 'Food': 'food', 'A shower': 'emergency', 'Diapers': 'emergency', 'A ride': 'transportation', 'Help with a bill': 'emergency', 'Housing': 'housing', 'A job': 'employment', 'Senior support': 'senior', 'Prayer or counseling': 'emergency', 'Something else': 'emergency' }

export function GetHelp() {
  useDocumentMeta('Get Help | The Saint Paul’s Baptist Church', 'Need food, a shower, a ride, help with a bill or someone to talk to? Saint Paul’s is here. You don’t need to be a member to ask.')
  const { upsert, log } = useDemo()
  return (
    <>
      <PageHero eyebrow="Get help" title="You don’t have to figure this out alone." text="You don’t need to be a member to ask. Tell us what you need and the Outreach team will get back to you, usually within two business days." />
      <section className="py-14 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="grid gap-4 content-start">
            <div className="rounded-[24px] bg-grow text-white p-6">
              <p className="font-display font-bold text-2xl">Right now, this week</p>
              <ul className="mt-3 space-y-3 text-lg">
                <li><b>Fresh food:</b> Fridays 4:00 PM, Creighton Campus</li>
                <li><b>Mobile showers:</b> Wednesdays 10:00 AM, Belt Campus</li>
                <li><b>Rides:</b> <a href={church.transportHref} className="underline underline-offset-4 font-bold">{church.transportPhone}</a></li>
                <li><b>Prayer line:</b> <a href={church.prayerLineHref} className="underline underline-offset-4 font-bold">{church.prayerLine}</a> (Wednesdays 7:14 AM)</li>
              </ul>
            </div>
            <a href={church.phoneHref} className="rounded-[24px] bg-paper border border-line p-6 flex gap-4 items-center hover:border-grow"><Phone className="text-ember" size={28} /><span><b className="block text-xl">Call the church</b><span className="text-stone">{church.phone} {church.phoneWord}</span></span></a>
            <a href={links.outreachEmail.href} className="rounded-[24px] bg-paper border border-line p-6 flex gap-4 items-center hover:border-grow"><Mail className="text-ember" size={28} /><span><b className="block text-xl">Email Outreach</b><span className="text-stone">{church.outreachEmail}</span></span></a>
            <div className="rounded-[24px] border-2 border-danger/30 bg-[#fff5f4] p-6">
              <p className="font-bold flex items-center gap-2 text-lg"><Flame size={20} className="text-danger" /> In crisis right now?</p>
              <p className="mt-1 text-stone text-lg">Call or text <b className="text-ink">988</b> (Suicide &amp; Crisis Lifeline) any time. In an emergency, call <b className="text-ink">911</b>.</p>
            </div>
          </div>
          <div className="rounded-[32px] bg-paper border border-line shadow-lift p-6 sm:p-9">
            <h2 className="font-display font-bold text-4xl">Ask for help</h2>
            <p className="mt-2 mb-6 text-stone text-lg">Only what we need to reach you. Your request stays with the Outreach team.</p>
            <SiteForm name={church.formNames.help} submitLabel="Send my request" success={{ title: 'We received your request.', text: 'The Outreach team will contact you, usually within two business days. If you need food this week, come Friday at 4 PM to the Creighton Campus.' }}
              onSubmitted={(d) => { upsert('services', { id: uid('sv'), program: needToProgram[d.need] ?? 'emergency', name: d.name || 'Neighbor', contact: d.phone || d.email || '', text: `${d.need ?? 'Help'}: ${d.details ?? ''}`.trim(), status: 'new', date: todayIso(), householdSize: Number(d.household) || undefined }); log(d.name || 'Neighbor', 'Requested help on the website', d.need || 'Help') }}>
              <input type="hidden" name="type" value="Get help" />
              <div className="grid gap-4 sm:grid-cols-2">
                <F label="What do you need?" name="need" as="select" required options={Object.keys(needToProgram)} className="sm:col-span-2" />
                <F label="Your name" name="name" required autoComplete="name" />
                <F label="Phone" name="phone" type="tel" autoComplete="tel" />
                <F label="Email" name="email" type="email" autoComplete="email" hint="(optional)" />
                <F label="People in your household" name="household" type="number" hint="(optional)" />
                <F label="Tell us a little more" name="details" as="textarea" rows={4} className="sm:col-span-2" />
              </div>
              <Check name="consent" label="It’s OK to call or text me about this request." defaultChecked />
            </SiteForm>
          </div>
        </Container>
      </section>
    </>
  )
}

export function CityOfPossibility() {
  useDocumentMeta('The City of Possibility | The Saint Paul’s Baptist Church', 'Saint Paul’s is planning a 321-acre, mixed-use community in Eastern Henrico, built around faith in action: homes, gardens and gathering places, open to everyone.')
  return (
    <>
      <section className="relative overflow-hidden text-white">
        <Art name="spbc-s5-dawn" alt="Sunrise over open land in Eastern Henrico" fallback="land" className="absolute inset-0" eager />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,rgba(15,36,25,0.95)_10%,rgba(15,36,25,0.4)_60%,rgba(15,36,25,0.2))]" />
        <Container className="relative pt-40 sm:pt-52 pb-20 sm:pb-28">
          <p className="font-caps font-semibold text-glow text-lg">Faith in action · Eastern Henrico</p>
          <h1 className="mt-3 font-display font-extrabold tracking-[-0.03em] leading-[0.95] text-6xl sm:text-8xl max-w-4xl">The City of Possibility</h1>
          <p className="mt-4 font-serif italic text-3xl text-glow">“With God all things are possible.” Matthew 19:26</p>
          <p className="mt-6 max-w-2xl text-2xl text-white/90 leading-relaxed">We’re transforming 321 acres in Eastern Henrico into a vibrant, inclusive community with homes, shops, green spaces and more. A future where everyone belongs.</p>
        </Container>
      </section>
      <section className="py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5 text-xl text-stone leading-relaxed">
            <Eyebrow>The vision</Eyebrow>
            <h2 className="display text-4xl sm:text-5xl text-ink">Built around the church, flowing from it, open to all.</h2>
            <p>The land sits on the south side of Creighton Road between Cedar Fork Road and I-295, assembled by Saint Paul’s over many years. The name comes from the church’s story: it began with no money and no land, just a dream and a promise that with God all things are possible.</p>
            <p>Plans presented to Henrico County describe a mix of apartments, townhomes, cottages and single-family homes, with affordable homes spread throughout the community rather than set apart, alongside gathering places, gardens and trails.</p>
            <p>It is not meant to be a Saint Paul’s-only neighborhood. It is meant to be a good place for anyone to live, and a contribution to all of Eastern Henrico.</p>
          </div>
          <div className="grid gap-4 content-start">
            {[['321', 'acres in Eastern Henrico'], ['1909', 'the year the dream began with one light'], ['All', 'neighbors welcome']].map(([k, v]) => (
              <div key={k} className="rounded-[24px] bg-parchment p-6"><p className="font-display font-extrabold text-6xl text-grow">{k}</p><p className="text-lg text-stone font-semibold">{v}</p></div>
            ))}
            {/* TODO: confirm with church: current rezoning status, project website/newsletter, and approved renderings (Clark Nexsen) to publish here. */}
            <div className="rounded-[24px] bg-canopy text-white p-6">
              <Landmark size={28} className="text-glow" />
              <p className="mt-3 font-display font-bold text-2xl">Follow the progress</p>
              <p className="mt-1 text-white/85">Updates on approvals, renderings and partnership opportunities will be posted here.</p>
              <a href={links.outreachEmail.href} className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange text-ink font-bold px-6 min-h-[52px]"><Mail size={18} /> Ask about partnering</a>
            </div>
          </div>
        </Container>
      </section>
      <section className="pb-20">
        <Container>
          <div className="relative overflow-hidden rounded-[32px] bg-possibility text-white p-8 sm:p-12">
            <Leaf size={300} className="absolute -right-10 -bottom-16 text-white/10" />
            <p className="font-display font-bold text-3xl sm:text-4xl max-w-3xl">The church that started with one lamp still believes God for more.</p>
            <div className="mt-6 flex flex-wrap gap-3"><PrimaryButton to="/our-story" icon={<ArrowRight size={18} />}>Read our story</PrimaryButton><Link to="/give" className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 min-h-[52px] font-bold hover:bg-white/10">Give</Link></div>
          </div>
        </Container>
      </section>
    </>
  )
}

