import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { DemoProvider } from '@/data/store'
import { SiteLayout } from './web/SiteChrome'
import Home from './web/pages/Home'
import { Mark } from './components/Logo'

const Visit = lazy(() => import('./web/pages/Visit'))
const CampusPage = lazy(() => import('./web/pages/Visit').then((m) => ({ default: m.CampusPage })))
const OurStory = lazy(() => import('./web/pages/OurStory'))
const LifeStages = lazy(() => import('./web/pages/LifeStages'))
const LifeStagePage = lazy(() => import('./web/pages/LifeStages').then((m) => ({ default: m.LifeStagePage })))
const Grow = lazy(() => import('./web/pages/Grow'))
const Serve = lazy(() => import('./web/pages/Grow').then((m) => ({ default: m.Serve })))
const NextSteps = lazy(() => import('./web/pages/Grow').then((m) => ({ default: m.NextSteps })))
const AppPage = lazy(() => import('./web/pages/Grow').then((m) => ({ default: m.AppPage })))
const Community = lazy(() => import('./web/pages/Community'))
const GetHelp = lazy(() => import('./web/pages/Community').then((m) => ({ default: m.GetHelp })))
const CityOfPossibility = lazy(() => import('./web/pages/Community').then((m) => ({ default: m.CityOfPossibility })))
const Events = lazy(() => import('./web/pages/Events'))
const EventDetail = lazy(() => import('./web/pages/Events').then((m) => ({ default: m.EventDetail })))
const Watch = lazy(() => import('./web/pages/Watch'))
const Give = lazy(() => import('./web/pages/Give'))
const Prayer = lazy(() => import('./web/pages/Prayer'))
const Contact = lazy(() => import('./web/pages/Contact'))
const Privacy = lazy(() => import('./web/pages/Legal').then((m) => ({ default: m.Privacy })))
const Terms = lazy(() => import('./web/pages/Legal').then((m) => ({ default: m.Terms })))
const NotFound = lazy(() => import('./web/pages/NotFound'))
const Login = lazy(() => import('./auth/Login'))
const PortalApp = lazy(() => import('./portal/PortalApp'))
const AdminApp = lazy(() => import('./admin/AdminApp'))

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // Pages load lazily, so wait (up to ~2s) for the anchor to exist before scrolling to it.
      let tries = 0
      let t = 0
      const seek = () => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        else if (tries++ < 25) t = window.setTimeout(seek, 80)
      }
      t = window.setTimeout(seek, 60)
      return () => clearTimeout(t)
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname, hash])
  return null
}

function Loading() {
  return (
    <div className="min-h-screen bg-morning flex items-center justify-center" role="status" aria-live="polite">
      <div className="text-center">
        <Mark size={64} green className="mx-auto animate-pulse" />
        <p className="mt-4 font-caps font-semibold text-ember">Loading</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <DemoProvider>
      <ScrollToTop />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/visit" element={<Visit />} />
            <Route path="/visit/:campus" element={<CampusPage />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/about" element={<Navigate to="/our-story" replace />} />
            <Route path="/life-stages" element={<LifeStages />} />
            <Route path="/life-stages/:id" element={<LifeStagePage />} />
            <Route path="/ministries" element={<Navigate to="/life-stages" replace />} />
            <Route path="/grow" element={<Grow />} />
            <Route path="/serve" element={<Serve />} />
            <Route path="/next-steps" element={<NextSteps />} />
            <Route path="/app" element={<AppPage />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/get-help" element={<GetHelp />} />
            <Route path="/get-help" element={<Navigate to="/community/get-help" replace />} />
            <Route path="/city-of-possibility" element={<CityOfPossibility />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:slug" element={<EventDetail />} />
            <Route path="/watch" element={<Watch />} />
            <Route path="/give" element={<Give />} />
            <Route path="/prayer" element={<Prayer />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/portal/*" element={<PortalApp />} />
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </Suspense>
    </DemoProvider>
  )
}
