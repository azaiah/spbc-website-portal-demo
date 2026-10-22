import { Heart, Repeat, Smartphone, ShieldCheck, Apple, ShowerHead, PlayCircle, Building2, Phone, HandCoins, ArrowRight } from 'lucide-react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { church } from '@/config/site'
import { links } from '@/config/links'
import { PageHero, Container, Eyebrow, PrimaryButton, OutlineButton, Leaf } from '../ui'

/**
 * Give. Saint Paul's gives through Pushpay (pushpay.com/g/spbconline), so this page explains and hands off.
 * Recurring is presented first (kit lesson: default to recurring). No invented impact numbers.
 * TODO: confirm with church — funds list, text-to-give number, mailing address for checks.
 */
export default function Give() {
  useDocumentMeta('Give | The Saint Paul’s Baptist Church', 'Give securely to The Saint Paul’s Baptist Church online with Pushpay or in the SPBC app. Set up recurring giving in about a minute.')
  return (
    <>
      <PageHero eyebrow="Generosity" title="Every gift keeps the light moving." text="Your giving fuels worship at two campuses, fresh food on Fridays, showers on wheels at Belt and the Word streaming to people who can’t get to church.">
        <PrimaryButton href={links.give.href} size="lg" icon={<Heart size={20} />}>Give online</PrimaryButton>
        <OutlineButton to="/app" icon={<Smartphone size={18} />}>Give in the app</OutlineButton>
      </PageHero>
      <section className="py-16 sm:py-24">
        <Container className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-[28px] bg-grow text-white p-7 lg:row-span-2 relative overflow-hidden">
            <Leaf size={240} className="absolute -right-10 -bottom-12 text-white/10" />
            <Repeat size={34} className="text-glow" />
            <h2 className="mt-4 font-display font-extrabold text-4xl">Give every week, automatically</h2>
            <p className="mt-3 text-xl text-white/90">Recurring giving is the simplest way to be faithful when life gets busy. Choose an amount and a schedule once, and change or stop it anytime.</p>
            <ol className="mt-6 space-y-3 text-lg">
              <li className="flex gap-3"><span className="font-display font-extrabold text-glow">1</span><span>Tap <b>Give online</b>.</span></li>
              <li className="flex gap-3"><span className="font-display font-extrabold text-glow">2</span><span>Enter your amount and choose <b>recurring</b>.</span></li>
              <li className="flex gap-3"><span className="font-display font-extrabold text-glow">3</span> Pick weekly, every two weeks or monthly. Done.</li>
            </ol>
            <div className="mt-7"><PrimaryButton href={links.give.href} icon={<ArrowRight size={18} />}>Set up recurring giving</PrimaryButton></div>
          </div>
          <div className="rounded-[28px] bg-paper border border-line p-7 shadow-card">
            <Smartphone size={30} className="text-ember" />
            <h3 className="mt-3 font-display font-bold text-2xl">In the SPBC app</h3>
            <p className="mt-2 text-lg text-stone">The SPBC app has a giving link to the same Pushpay page. Already use the Pushpay app? Keep using it.</p>
          </div>
          <div className="rounded-[28px] bg-paper border border-line p-7 shadow-card">
            <ShieldCheck size={30} className="text-ember" />
            <h3 className="mt-3 font-display font-bold text-2xl">Safe and secure</h3>
            <p className="mt-2 text-lg text-stone">Online gifts are processed by Pushpay. Your card details never touch this website.</p>
          </div>
          <div className="rounded-[28px] bg-paper border border-line p-7 shadow-card">
            <Building2 size={30} className="text-ember" />
            <h3 className="mt-3 font-display font-bold text-2xl">In person</h3>
            <p className="mt-2 text-lg text-stone">Give during worship at the Creighton or Belt Campus.</p>
          </div>
          <div className="rounded-[28px] bg-paper border border-line p-7 shadow-card">
            <Phone size={30} className="text-ember" />
            <h3 className="mt-3 font-display font-bold text-2xl">Questions about giving?</h3>
            <p className="mt-2 text-lg text-stone">Statements, stock gifts or help with your account: call <a href={church.phoneHref} className="font-bold text-grow">{church.phone}</a>.</p>
          </div>
        </Container>
      </section>
      <section className="py-16 sm:py-24 bg-parchment">
        <Container>
          <Eyebrow>What your gift does</Eyebrow>
          <h2 className="mt-3 display text-4xl sm:text-5xl max-w-3xl">Generosity you can see.</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: <Apple size={26} />, t: 'Fresh food on Fridays', d: 'Neighbors receive fresh food at the Creighton Campus every Friday afternoon.' },
              { i: <ShowerHead size={26} />, t: 'Showers on wheels', d: 'Dignity on the Go brings mobile showers to the Belt Campus every Wednesday.' },
              { i: <PlayCircle size={26} />, t: 'The Word, everywhere', d: 'Livestreams and replays reach members who are homebound, traveling or far away.' },
              { i: <HandCoins size={26} />, t: 'Help in a crisis', d: 'The Saint Paul’s Community Foundation supports the church’s emergency financial assistance.' },
            ].map((x) => <li key={x.t} className="rounded-[24px] bg-paper border border-line p-6"><span className="text-grow">{x.i}</span><h3 className="mt-3 font-display font-bold text-2xl">{x.t}</h3><p className="mt-2 text-lg text-stone">{x.d}</p></li>)}
          </ul>
        </Container>
      </section>
    </>
  )
}
