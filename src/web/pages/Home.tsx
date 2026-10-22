import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Hero } from '../home/Hero'
import { LightFilm } from '../home/LightFilm'
import { EverywhereSection } from '../home/Everywhere'
import { ThisWeek, Pastor, FirstVisit, ThemeBand, Pathways, LifeStagesSection, CommunitySection, EventsSection, WatchSection, GiveBand, Ending } from '../home/Sections'

/** Home: the job order from the ChurchConnect design playbook, in Saint Paul's own words. */
export default function Home() {
  useDocumentMeta('The Saint Paul’s Baptist Church | A church for people on the GROW · Richmond & Henrico, VA', 'Worship Sundays at 9:00 AM at the Creighton Campus and online, or 11:30 AM at the Belt Campus. Pastoral care for every life stage, THE BRIDGE Bible study, outreach and more.')
  return (
    <>
      <Hero />
      <ThisWeek />
      <FirstVisit />
      <Pastor />
      <ThemeBand />
      <Pathways />
      <LightFilm />
      <LifeStagesSection />
      <EverywhereSection />
      <CommunitySection />
      <EventsSection />
      <WatchSection />
      <GiveBand />
      <Ending />
    </>
  )
}
