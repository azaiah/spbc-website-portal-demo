import { Link } from 'react-router-dom'
import { ArrowRight, GraduationCap, Landmark, Mic2, BookHeart } from 'lucide-react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { church, leadership, lifeStages } from '@/config/site'
import { links } from '@/config/links'
import { PageHero, Container, Eyebrow, Photo, PrimaryButton, OutlineButton, Leaf } from '../ui'
import { Rise } from '../motion'

/**
 * Timeline facts and sources (docs/02-church-external.md):
 * 1909 Rep. Bobby Scott floor statement (2009) · Church Hill + 1991 + Kennedy HS: Richmond BizSense 2019 ·
 * 1985: 41st Pastor & People Anniversary (Oct 2026) · 1992 Nia: World Religions & Spirituality Project + IRS ·
 * 2005 Belt: wrldrels (secondary) · 2020 House chaplain: chaplain.house.gov · 2025 City of Possibility: BizSense/WRIC/WTVR.
 * TODO: confirm with church — Creighton opening year (2001 vs 2003 in press), Botetourt Street first location,
 * name of the fourth pastor, year of the move to Church Hill, and a beliefs statement.
 */
const timeline: { year: string; title: string; text: string }[] = [
  { year: '1909', title: 'One light on Thanksgiving night', text: 'Members of First Union Baptist Church received a letter of release to form a new congregation. They organized as The Saint Paul’s Baptist Church.' },
  { year: 'Church Hill', title: 'Homes on the line for a church home', text: 'When a church building on East Marshall Street became available, several members mortgaged their own homes to guarantee that Saint Paul’s could move in.' },
  { year: 'Building', title: 'A credit union, housing and more', text: 'Under the church’s fourth and longest-serving pastor before today, Saint Paul’s founded the Saint Paul’s Baptist Federal Credit Union, a housing corporation and Saint Paul’s Manor.' },
  { year: '1985', title: 'Pastor & People begins', text: 'A young preacher from Detroit, Lance D. Watson, became the sixth pastor of Saint Paul’s. It is the only church he has ever pastored.' },
  { year: '1991', title: 'Worship in a high school', text: 'The church outgrew Church Hill and worshiped at the former John F. Kennedy High School while it built a much larger home on Creighton Road.' },
  { year: '1992', title: 'Nia is born', text: 'Saint Paul’s formed Nia, a faith-based community development corporation for health, housing, jobs, youth and families.' },
  { year: '2000s', title: 'Creighton Road', text: 'The Creighton Road sanctuary opened in eastern Henrico, and the campus grew into a home for ministry, mission and media.' },
  { year: '2005', title: 'The Belt Campus', text: 'Weatherford Memorial Baptist Church entrusted its buildings at 700 E. Belt Boulevard to Saint Paul’s, and the church became one church in two places.' },
  { year: '2009', title: '100 years, honored in Congress', text: 'Congressman Bobby Scott recognized Saint Paul’s centennial on the floor of the U.S. House of Representatives.' },
  { year: '2025', title: 'The City of Possibility', text: 'Saint Paul’s presented plans for 321 acres it owns in Eastern Henrico: homes, gardens and gathering places, open to everyone.' },
  { year: '2026', title: '117 years · Generations United', text: 'Forty-one years of Pastor & People, a new SPBC app, and the 117th Church Anniversary on November 15.' },
]

const affiliates = [
  { name: church.nia.name, text: `A 501(c)(3) community development corporation founded in ${church.nia.founded} (EIN ${church.nia.ein}): health education, training and employment, housing and youth and family services.` },
  { name: church.foundation.name, text: `A 501(c)(3) (EIN ${church.foundation.ein}) that supports the church’s emergency financial assistance program.` },
  { name: 'Saint Paul’s Baptist Federal Credit Union', text: 'A credit union for members of the church and their relatives.' },
  { name: 'Destiny schools and Charisma Books & Gifts', text: 'Education and resources that grew out of the church’s ministry.' }, // TODO: confirm current programs with church
]

export default function OurStory() {
  useDocumentMeta('Our Story | The Saint Paul’s Baptist Church, since 1909', 'From Thanksgiving night 1909 to two campuses and the City of Possibility: the history of The Saint Paul’s Baptist Church, Senior Pastor Dr. Lance D. Watson, Sr. and our Life Stage Pastors.')
  return (
    <>
      <PageHero eyebrow="Our story" title="From one light to a city." photo="worship-lights" text={`For ${new Date().getFullYear() - church.founded} years, Saint Paul’s has been a church for people on the GROW.`}>
        <PrimaryButton to="/visit" icon={<ArrowRight size={18} />}>Plan your visit</PrimaryButton>
        <OutlineButton href="#pastor">Meet our pastor</OutlineButton>
      </PageHero>

      <section className="py-16 sm:py-24" aria-labelledby="tl-h">
        <Container>
          <Eyebrow>Since 1909</Eyebrow>
          <h2 id="tl-h" className="mt-3 display text-4xl sm:text-6xl max-w-3xl">A story of faith that keeps growing.</h2>
          <ol className="mt-12 relative border-l-4 border-orange/30 ml-3 sm:ml-6">
            {timeline.map((t) => (
              <Rise key={t.title}>
                <li className="relative pl-8 sm:pl-12 pb-10 last:pb-0">
                  <span aria-hidden="true" className="absolute -left-[14px] top-1 h-6 w-6 rounded-full bg-orange ring-4 ring-morning flex items-center justify-center"><Leaf size={12} className="text-white" /></span>
                  <p className="font-display font-extrabold text-3xl text-ember">{t.year}</p>
                  <h3 className="mt-1 font-display font-bold text-2xl sm:text-3xl">{t.title}</h3>
                  <p className="mt-2 text-lg text-stone max-w-3xl leading-relaxed">{t.text}</p>
                </li>
              </Rise>
            ))}
          </ol>
        </Container>
      </section>

      <section id="pastor" className="py-16 sm:py-24 bg-parchment scroll-mt-28" aria-labelledby="p-h">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] items-start">
          <div className="lg:sticky lg:top-32">
            {/* TODO: replace with a portrait of Dr. & First Lady Watson supplied by the church */}
            <Photo name="sanctuary-choir" className="aspect-[4/5] rounded-[32px] shadow-lift" />
          </div>
          <div>
            <Eyebrow>Senior Pastor</Eyebrow>
            <h2 id="p-h" className="mt-3 display text-4xl sm:text-6xl">{leadership.pastor.name}</h2>
            <p className="mt-3 text-xl font-semibold text-ember">Pastor since 1985 · with First Lady Rose Watson</p>
            <div className="mt-6 space-y-5 text-xl text-stone leading-relaxed">
              <p>Dr. Lance D. Watson grew up in Detroit, the 15th of 17 children. He credits Detroit churches’ generosity with helping his family survive, and that conviction runs through Saint Paul’s ministry of feeding the hungry, supporting people without housing, helping with bills and walking with people returning home from incarceration.</p>
              <p>Saint Paul’s is his first and only pastorate. He also co-mentors “Strategic Leadership for Black Congregations” at United Theological Seminary, preaches across the country and has hosted the “Positive Power” broadcast.</p>
            </div>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                { i: <GraduationCap />, t: 'Wayne State University', d: 'B.S. Psychology, B.A. Philosophy, M.A. Guidance & Counseling' },
                { i: <BookHeart />, t: 'Samuel DeWitt Proctor School of Theology, VUU', d: 'Master of Divinity, 1986' },
                { i: <GraduationCap />, t: 'United Theological Seminary', d: 'Doctor of Ministry, 2006' },
                { i: <Landmark />, t: 'U.S. House of Representatives', d: 'Guest chaplain, February 12, 2020' },
                { i: <Mic2 />, t: 'Author and producer', d: 'The Rhythm of Gratitude (2026); executive producer of “God with Us”' },
              ].map((x) => (
                <li key={x.t} className="rounded-2xl bg-paper border border-line p-4 flex gap-3"><span className="text-ember mt-0.5">{x.i}</span><span><b className="block">{x.t}</b><span className="text-stone text-[17px]">{x.d}</span></span></li>
              ))}
            </ul>
            <div className="mt-8 rounded-3xl bg-paper border border-line p-6">
              <h3 className="font-display font-bold text-2xl">First Lady Rose Watson</h3>
              <p className="mt-2 text-lg text-stone">A gifted singer who has led the Mass Choir alongside our music ministry. This September the church celebrated First Lady Day in her honor.</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24" aria-labelledby="ls-h">
        <Container>
          <Eyebrow>Pastoral care for every life stage</Eyebrow>
          <h2 id="ls-h" className="mt-3 display text-4xl sm:text-6xl">Our Life Stage Pastors</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {lifeStages.map((s) => (
              <li key={s.id}>
                <Link to={`/life-stages/${s.id}`} className="block h-full rounded-[24px] p-6 text-white hover:-translate-y-1 transition-transform" style={{ background: s.color }}>
                  <p className="font-caps font-semibold text-white/85">{s.name} · {s.ages}</p>
                  <p className="mt-2 font-display font-bold text-2xl leading-tight">{s.pastor}</p>
                  <p className="mt-3 inline-flex items-center gap-1 font-bold">Meet {s.name} <ArrowRight size={16} /></p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-16 sm:py-24 bg-canopy text-white" aria-labelledby="af-h">
        <Container>
          <Eyebrow light>Faith in action</Eyebrow>
          <h2 id="af-h" className="mt-3 display text-4xl sm:text-6xl max-w-3xl">The family of Saint Paul’s ministries</h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {affiliates.map((a) => (
              <li key={a.name} className="rounded-[24px] bg-white/[0.07] border border-white/15 p-6">
                <p className="font-display font-bold text-2xl">{a.name}</p>
                <p className="mt-2 text-white/85 text-lg">{a.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <PrimaryButton to="/city-of-possibility" icon={<ArrowRight size={18} />}>The City of Possibility</PrimaryButton>
            <a href={links.weekendWorship.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 min-h-[52px] font-bold hover:bg-white/10">Watch a message</a>
          </div>
        </Container>
      </section>
    </>
  )
}
