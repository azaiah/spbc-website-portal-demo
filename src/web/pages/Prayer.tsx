import { Lock, HeartHandshake, Phone, Flame, Users } from 'lucide-react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { useDemo } from '@/data/store'
import { uid } from '@/data/ids'
import { todayIso } from '@/data/dates'
import { church } from '@/config/site'
import { links } from '@/config/links'
import { PageHero, Container, Eyebrow, PrimaryButton, Ext } from '../ui'
import { SiteForm, F, Check } from '../forms'

export default function Prayer() {
  useDocumentMeta('Prayer | The Saint Paul’s Baptist Church', 'Join 7:14 Prayer every Wednesday by phone, or send a prayer request to the Saint Paul’s Prayer Team. You’re never alone.')
  const { upsert, log } = useDemo()
  return (
    <>
      <PageHero eyebrow="Prayer & counseling" title="You’re never alone." tone="lilac" photo="prayer-pew" text="Our Intercessors, Prayer Partners and Counselors are here for you.">
        <PrimaryButton href={church.prayerLineHref} icon={<Phone size={18} />}>Call the 7:14 line</PrimaryButton>
      </PageHero>
      <section className="py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="grid gap-4 content-start">
            <div className="rounded-[28px] bg-possibility text-white p-7">
              <p className="font-caps font-semibold text-glow">Every Wednesday · 7:14 AM</p>
              <h2 className="mt-2 font-display font-extrabold text-4xl">7:14 Prayer</h2>
              <p className="mt-3 text-lg text-white/90">Community prayer by phone. Call <a href={church.prayerLineHref} className="font-bold underline underline-offset-4">{church.prayerLine}</a> and select 1 to subscribe.</p>
              <Ext href={links.prayerCalls.href} className="mt-4 inline-flex items-center gap-2 font-bold text-glow min-h-[44px]">Listen to past prayer calls →</Ext>
            </div>
            <div className="rounded-[24px] bg-paper border border-line p-6 flex gap-4"><Users className="text-ember shrink-0" size={26} /><div><p className="font-bold text-lg">Prayer Team and Prayer Partners</p><p className="text-stone">The Prayer Team prays for needs in the church and the world. Prayer Partners pray with people after every weekend service.</p></div></div>
            <div className="rounded-[24px] bg-paper border border-line p-6 flex gap-4"><Lock className="text-ember shrink-0" size={26} /><div><p className="font-bold text-lg">Confidential when you need it</p><p className="text-stone">Mark your request private and only pastoral staff will see it.</p></div></div>
            <div className="rounded-[24px] bg-paper border border-line p-6 flex gap-4"><HeartHandshake className="text-ember shrink-0" size={26} /><div><p className="font-bold text-lg">Counseling</p><p className="text-stone">Ask for a call and someone from our counseling team will reach out.</p></div></div>
            <div className="rounded-[24px] border-2 border-danger/30 bg-[#fff5f4] p-6">
              <p className="font-bold flex items-center gap-2 text-lg"><Flame size={20} className="text-danger" /> If you are in crisis right now</p>
              <p className="mt-1 text-stone">Call or text <b className="text-ink">988</b> (Suicide &amp; Crisis Lifeline) any time. In an emergency, call <b className="text-ink">911</b>.</p>
            </div>
          </div>
          <div className="rounded-[32px] bg-paper border border-line shadow-lift p-6 sm:p-9 h-fit">
            <Eyebrow>Jeremiah 33:3 · “Call to Me and I will answer you.”</Eyebrow>
            <h2 className="mt-3 font-display font-bold text-4xl">Send a prayer request</h2>
            <p className="mt-2 mb-6 text-stone text-lg">Only your first name is required.</p>
            <SiteForm name={church.formNames.prayer} submitLabel="Send my request" success={{ title: 'We’re praying with you.', text: 'Your request reached the Prayer Team. If you asked for a call, expect one soon.' }}
              onSubmitted={(d) => { upsert('care', { id: uid('cr'), kind: d.call === 'yes' ? 'pastoral' : 'prayer', name: d.name || 'Friend', contact: d.phone || d.email || '', text: [d.request, d.campus && `Campus: ${d.campus}`, d.stage && `Life stage: ${d.stage}`].filter(Boolean).join(' · '), confidential: d.private === 'yes', status: 'new', date: todayIso(), updates: [] }); log(d.name || 'Website visitor', 'Sent a prayer request', d.private === 'yes' ? 'Confidential' : 'Prayer Team') }}>
              <div className="grid gap-4 sm:grid-cols-2">
                <F label="First name" name="name" required autoComplete="given-name" />
                <F label="Phone" name="phone" type="tel" autoComplete="tel" hint="(optional)" />
                <F label="Email" name="email" type="email" autoComplete="email" hint="(optional)" className="sm:col-span-2" />
                <F label="Campus" name="campus" as="select" options={['Creighton', 'Belt', 'Online', 'I’m not sure']} />
                <F label="Life stage" name="stage" as="select" options={['imagiNATION', 'SMB', 'Dreamchasers', 'ASPIRE', 'Fusion', 'Encore', 'Prime Time', 'Refiners', 'Prefer not to say']} />
                <F label="How can we pray for you?" name="request" as="textarea" required rows={5} className="sm:col-span-2" />
              </div>
              <Check name="private" label="Keep this private: pastoral staff only." />
              <Check name="call" label="Please call me. I’d like to talk with someone." />
            </SiteForm>
            <p className="mt-6 text-[16px] text-stone">Members can also <Ext href="/login?next=/portal/care" className="font-bold text-grow underline underline-offset-4">sign in to Saint Paul’s Everywhere</Ext> to send a request and see when a pastor has followed up.</p>
          </div>
        </Container>
      </section>
    </>
  )
}
