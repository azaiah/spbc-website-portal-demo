import { PlayCircle, Youtube, Facebook, Smartphone, BookOpen, Phone, Download } from 'lucide-react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { church } from '@/config/site'
import { links } from '@/config/links'
import { Container, Eyebrow, PrimaryButton, OutlineButton, Ext } from '../ui'

/** Watch: live at 9 AM + three replay libraries (resolved from the church's myspbc.info short links). */
export default function Watch() {
  useDocumentMeta('Watch Online | The Saint Paul’s Baptist Church', 'Worship live Sundays at 9:00 AM at MySPBC.tv, YouTube and Facebook @myspbc. Weekend Worship replays, THE BRIDGE Bible study and 7:14 Prayer calls.')
  const libs = [
    { i: <PlayCircle size={30} />, t: 'Weekend Worship', d: 'Every Sunday message from Dr. Lance Watson and guest preachers.', h: links.weekendWorship.href, c: 'Watch replays' },
    { i: <BookOpen size={30} />, t: 'THE BRIDGE', d: 'Thursday Bible study lessons, including Joy Is My Superpower.', h: links.theBridge.href, c: 'Replay lessons' },
    { i: <Phone size={30} />, t: '7:14 Prayer Calls', d: 'Wednesday morning community prayer, recorded.', h: links.prayerCalls.href, c: 'Listen' },
  ]
  return (
    <>
      <section className="relative overflow-hidden bg-night text-white">
        <video className="absolute inset-0 h-full w-full object-cover opacity-50" autoPlay muted loop playsInline poster="/video/hero-poster.jpg" aria-hidden="true">
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-night/30" />
        <Container className="relative pt-40 sm:pt-52 pb-20 sm:pb-28">
          <Eyebrow light>Saint Paul’s Everywhere</Eyebrow>
          <h1 className="mt-4 display text-6xl sm:text-8xl">Worship live, Sundays at 9.</h1>
          <p className="mt-5 max-w-2xl text-2xl text-white/90">Join the Creighton Campus service from anywhere at MySPBC.tv, on YouTube or Facebook @myspbc, or in the SPBC app.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryButton href={links.watchLive.href} size="lg" icon={<PlayCircle size={20} />}>Watch at MySPBC.tv</PrimaryButton>
            <a href={links.youtube.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-white/50 px-6 min-h-[60px] text-lg font-bold hover:bg-white/10"><Youtube size={20} /> YouTube</a>
            <a href={links.facebook.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-white/50 px-6 min-h-[60px] text-lg font-bold hover:bg-white/10"><Facebook size={20} /> Facebook</a>
          </div>
        </Container>
      </section>
      <section className="py-16 sm:py-24">
        <Container>
          <h2 className="display text-4xl sm:text-5xl">Catch up anytime</h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {libs.map((l) => (
              <li key={l.t} className="rounded-[28px] bg-paper border border-line p-7 shadow-card flex flex-col">
                <span className="text-ember">{l.i}</span>
                <h3 className="mt-3 font-display font-bold text-3xl">{l.t}</h3>
                <p className="mt-2 text-lg text-stone flex-1">{l.d}</p>
                <Ext href={l.h} className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-grow text-white font-bold px-6 min-h-[52px] hover:bg-canopy">{l.c}</Ext>
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-[28px] bg-parchment p-7 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="font-display font-bold text-3xl">Take Saint Paul’s with you</p>
              <p className="mt-1 text-lg text-stone">Watch, pray and find a group in the free SPBC app. Or read this week’s e-bulletin.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <PrimaryButton to="/app" icon={<Smartphone size={18} />}>Get the app</PrimaryButton>
              <OutlineButton href={links.bulletin.href} icon={<Download size={18} />}>E-bulletin</OutlineButton>
            </div>
          </div>
          <p className="mt-8 text-center text-stone text-lg">Prefer to worship in person? <a href="/visit" className="font-bold text-grow underline underline-offset-4">Plan a visit</a> or call {church.phone}.</p>
        </Container>
      </section>
    </>
  )
}
