import { useSearchParams } from 'react-router-dom'
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Navigation, Bus, HandHeart } from 'lucide-react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { useDemo } from '@/data/store'
import { uid } from '@/data/ids'
import { todayIso } from '@/data/dates'
import { church, campuses } from '@/config/site'
import { links } from '@/config/links'
import { PageHero, PrimaryButton, OutlineButton, Container } from '../ui'
import { SiteForm, F, Check } from '../forms'

const subjects = ['General question', 'Planning a visit', 'Joining Saint Paul’s', 'DNA class', 'Life stages and groups', 'Volunteering', 'Outreach or getting help', 'Sqwire financial wellness', 'Job openings', 'Store', 'Flowers', 'City of Possibility or partnership', 'Media or press', 'Something else']

export default function Contact() {
  useDocumentMeta('Contact | The Saint Paul’s Baptist Church · 804.643.4769', 'Call 804.643.4769 (GROW) or visit The Saint Paul’s Baptist Church at 4247 Creighton Road, Henrico, VA 23223 or 700 E. Belt Boulevard, Richmond, VA 23224.')
  const { upsert, log } = useDemo()
  const [params] = useSearchParams()
  const pre = params.get('subject') ?? ''
  const preSubject = subjects.find((s) => s.toLowerCase().startsWith(pre.toLowerCase().slice(0, 6))) ?? ''
  const rows = [
    { i: Phone, l: 'Call the church', v: `${church.phone} ${church.phoneWord}`, href: church.phoneHref },
    { i: Bus, l: 'Transportation', v: church.transportPhone, href: church.transportHref },
    { i: HandHeart, l: '7:14 Prayer line', v: `${church.prayerLine} (select 1)`, href: church.prayerLineHref },
    { i: Mail, l: 'Outreach', v: church.outreachEmail, href: `mailto:${church.outreachEmail}` },
    { i: Facebook, l: 'Facebook', v: '@myspbc', href: church.facebook },
    { i: Instagram, l: 'Instagram', v: '@myspbc', href: church.instagram },
    { i: Youtube, l: 'YouTube', v: '@myspbc', href: church.youtube },
  ]
  return (
    <>
      <PageHero eyebrow="Contact" title="We’d love to hear from you." text="Call, write or stop by either campus.">
        <PrimaryButton href={church.phoneHref} icon={<Phone size={18} />}>Call {church.phone}</PrimaryButton>
        <OutlineButton href="#message">Send a message</OutlineButton>
      </PageHero>
      <section className="py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4 content-start">
            <ul className="grid gap-3">
              {rows.map((r) => (
                <li key={r.l}><a href={r.href} target={r.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="flex items-center gap-4 rounded-3xl border border-line bg-paper p-4 sm:p-5 hover:border-grow hover:shadow-card transition">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-canopy text-glow"><r.i size={20} /></span>
                  <span className="min-w-0"><span className="block text-[16px] text-stone">{r.l}</span><span className="block font-bold text-lg break-words">{r.v}</span></span>
                </a></li>
              ))}
            </ul>
            {campuses.filter((c) => c.street).map((c) => (
              <div key={c.id} className="rounded-3xl border border-line bg-paper overflow-hidden">
                <iframe title={`Map to the ${c.name}`} src={c.mapsEmbed} loading="lazy" className="h-48 w-full border-0" referrerPolicy="no-referrer-when-downgrade" />
                <div className="p-5 flex items-start justify-between gap-3 flex-wrap">
                  <p><b className="block font-display text-xl">{c.name} · Sundays {c.time}</b><span className="text-stone"><MapPin size={16} className="inline -mt-1 mr-1" />{c.street}, {c.city} {c.zip}</span></p>
                  <a href={c.directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-bold text-grow min-h-[44px]"><Navigation size={16} /> Directions</a>
                </div>
              </div>
            ))}
          </div>
          <div id="message" className="rounded-[32px] bg-paper border border-line shadow-lift p-6 sm:p-9 h-fit scroll-mt-28">
            <h2 className="font-display font-bold text-4xl">Send a message</h2>
            <p className="mt-2 mb-6 text-stone text-lg">The church office will reply as soon as possible.</p>
            <SiteForm name={church.formNames.contact} submitLabel="Send message" success={{ title: 'Message sent.', text: 'Thank you for reaching out. Someone from Saint Paul’s will get back to you soon.' }}
              onSubmitted={(d) => { upsert('tasks', { id: uid('t'), title: `Reply to ${d.name}: ${d.subject || 'website message'}`, assigneeId: 'm_12', due: todayIso(), status: 'todo', module: 'office', priority: 'normal' }); log(d.name || 'Website visitor', 'Sent a message from the website', d.subject || 'General') }}>
              <div className="grid gap-4 sm:grid-cols-2">
                <F label="Your name" name="name" required autoComplete="name" />
                <F label="Email" name="email" type="email" required autoComplete="email" />
                <F label="Phone" name="phone" type="tel" autoComplete="tel" hint="(optional)" />
                <div>
                  <label htmlFor="f-subject" className="block text-base font-bold text-ink mb-1.5">Subject<span className="text-ember" aria-hidden="true"> *</span></label>
                  <select id="f-subject" name="subject" required defaultValue={preSubject} className="w-full rounded-2xl border-2 border-line bg-paper px-4 py-3 text-lg text-ink focus:border-grow focus:outline-none focus:ring-4 focus:ring-grow/15 min-h-[56px]">
                    <option value="" disabled>Choose one</option>
                    {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <F label="Message" name="message" as="textarea" required rows={5} className="sm:col-span-2" />
              </div>
              <Check name="updates" label="Send me occasional news and event updates from Saint Paul’s." />
            </SiteForm>
            <p className="mt-6 text-[16px] text-stone">Prefer the church’s existing form? <a href={links.contactForm.href} target="_blank" rel="noopener noreferrer" className="font-bold text-grow underline underline-offset-4">Use it here</a>.</p>
          </div>
        </Container>
      </section>
    </>
  )
}
