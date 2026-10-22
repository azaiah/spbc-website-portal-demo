/// <reference types="vitest" />
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

/**
 * Public address. Lives in ONE place: site.config.json.
 * Every canonical tag, link-preview tag, sitemap entry and robots.txt line is built from it,
 * so a link texted or posted anywhere always shows and opens this exact address.
 */
const SITE_URL: string = JSON.parse(readFileSync(new URL('./site.config.json', import.meta.url), 'utf8')).url.replace(/\/+$/, '')
const SITE_HOST = new URL(SITE_URL).host
const OG_VERSION = new Date().toISOString().slice(0, 10).replace(/-/g, '')

type PageMeta = {
  /** Route path, no trailing slash except root */
  path: string
  /** Output HTML file in dist ('index.html' for root) */
  file: string
  title: string
  description: string
  ogTitle: string
  ogDescription: string
  image: string
  imageAlt: string
  index: boolean
  sitemapPriority?: number
}

import { events } from './src/data/events'
import { lifeStages, campuses } from './src/config/site'

const OG = (n: string) => `/og/${n}.png`
const CHURCH = "The Saint Paul’s Baptist Church"
const ALT = "The Saint Paul’s Baptist Church: a church for people on the GROW. Creighton 9 AM · Belt 11:30 AM · Online."
type P = Omit<PageMeta, 'file' | 'image' | 'imageAlt' | 'ogTitle' | 'ogDescription'> & Partial<Pick<PageMeta, 'image' | 'imageAlt' | 'ogTitle' | 'ogDescription'>>
const fileFor = (path: string) => (path === '/' ? 'index.html' : `${path.slice(1)}.html`)
const page = (p: P): PageMeta => ({ ...p, file: fileFor(p.path), image: p.image ?? OG('home'), imageAlt: p.imageAlt ?? ALT, ogTitle: p.ogTitle ?? p.title.split(' | ')[0], ogDescription: p.ogDescription ?? p.description })

/** Link previews per shareable page (one HTML file each, so texted links show the right card). */
const pages: PageMeta[] = [
  page({ path: '/', title: `${CHURCH} | A church for people on the GROW · Richmond & Henrico, VA`, ogTitle: `${CHURCH}: a church for people on the GROW`, description: 'Worship Sundays at 9:00 AM at the Creighton Campus (Henrico) and online, or 11:30 AM at the Belt Campus (Richmond). Pastoral care for every life stage, THE BRIDGE Bible study and outreach since 1909.', index: true, sitemapPriority: 1.0 }),
  page({ path: '/visit', title: `Plan Your Visit | ${CHURCH}`, description: 'Choose the Creighton Campus (9 AM, Henrico), the Belt Campus (11:30 AM, Richmond) or online. What to expect, kids, rides and directions.', image: OG('visit'), index: true, sitemapPriority: 0.9 }),
  ...campuses.map((c) => page({ path: `/visit/${c.id}`, title: `${c.name} · Sundays ${c.time} | ${CHURCH}`, description: c.street ? `${c.street}, ${c.city} ${c.zip}. ${c.blurb}` : c.blurb, image: OG('visit'), index: true, sitemapPriority: 0.8 })),
  page({ path: '/our-story', title: `Our Story | ${CHURCH}, since 1909`, description: 'From Thanksgiving night 1909 to two campuses and the City of Possibility. Senior Pastor Dr. Lance D. Watson, Sr. and our Life Stage Pastors.', image: OG('story'), index: true, sitemapPriority: 0.8 }),
  page({ path: '/life-stages', title: `Life Stages | ${CHURCH}`, description: 'imagiNATION, SMB, Dreamchasers, ASPIRE, Fusion, Encore, Prime Time and Refiners: a pastor and a place for every season of life.', image: OG('life-stages'), index: true, sitemapPriority: 0.8 }),
  ...lifeStages.map((s) => page({ path: `/life-stages/${s.id}`, title: `${s.name} (ages ${s.ages}) | ${CHURCH}`, description: `${s.blurb} Life Stage Pastor: ${s.pastor}.`, image: OG('life-stages'), index: true, sitemapPriority: 0.6 })),
  page({ path: '/grow', title: `Grow: THE BRIDGE, GPS and groups | ${CHURCH}`, description: 'THE BRIDGE online Bible study every Thursday, the weekly GPS guide, life-stage groups and the DNA new members class.', index: true, sitemapPriority: 0.7 }),
  page({ path: '/serve', title: `Serve | ${CHURCH}`, description: 'Discover how you were created to serve: the MyFitAssessment, Volunteer University and teams at both campuses.', index: true, sitemapPriority: 0.5 }),
  page({ path: '/next-steps', title: `Next Steps | ${CHURCH}`, description: 'Join Saint Paul’s, the DNA class, rides, financial wellness, careers and more.', index: true, sitemapPriority: 0.5 }),
  page({ path: '/app', title: `Get the SPBC App | Saint Paul’s Everywhere`, description: 'Watch messages, send and receive prayer, find a group and register for events in the free SPBC app.', index: true, sitemapPriority: 0.5 }),
  page({ path: '/community', title: `Community Outreach | ${CHURCH}`, description: 'Fresh food every Friday, mobile showers every Wednesday, clinics, rides, emergency help and counseling.', image: OG('community'), index: true, sitemapPriority: 0.8 }),
  page({ path: '/community/get-help', title: `Get Help | ${CHURCH}`, description: 'Need food, a shower, a ride, help with a bill or someone to talk to? You don’t need to be a member to ask.', image: OG('community'), index: true, sitemapPriority: 0.8 }),
  page({ path: '/city-of-possibility', title: `The City of Possibility | ${CHURCH}`, description: '321 acres in Eastern Henrico: homes, gardens and gathering places, open to everyone. With God all things are possible.', image: OG('possibility'), index: true, sitemapPriority: 0.7 }),
  page({ path: '/events', title: `Events | ${CHURCH}`, description: 'Trunk or Treat, Fire on Fridays, the Veterans Brunch, the 117th Church Anniversary, The Spirit of Christmas and Breakthrough 2027.', image: OG('events'), index: true, sitemapPriority: 0.8 }),
  ...events.map((e) => page({ path: `/events/${e.slug}`, title: `${e.title} | ${CHURCH}`, description: `${e.when} · ${e.where}. ${e.summary}`, ogTitle: e.title, image: OG(`event-${e.slug}`), imageAlt: `${e.title}: ${e.when}, ${e.where}`, index: true, sitemapPriority: 0.6 })),
  page({ path: '/watch', title: `Watch Online | ${CHURCH}`, description: 'Worship live Sundays at 9:00 AM at MySPBC.tv, YouTube and Facebook @myspbc. Replays all week.', image: OG('watch'), index: true, sitemapPriority: 0.7 }),
  page({ path: '/give', title: `Give | ${CHURCH}`, description: 'Give securely online or in the SPBC app. Set up recurring giving in about a minute.', image: OG('give'), index: true, sitemapPriority: 0.7 }),
  page({ path: '/prayer', title: `Prayer | ${CHURCH}`, description: 'Join 7:14 Prayer every Wednesday by phone or send a prayer request. You’re never alone.', index: true, sitemapPriority: 0.6 }),
  page({ path: '/contact', title: `Contact | ${CHURCH} · 804.643.4769`, description: 'Call 804.643.4769 (GROW) or visit 4247 Creighton Road, Henrico, or 700 E. Belt Boulevard, Richmond.', index: true, sitemapPriority: 0.6 }),
  page({ path: '/privacy', title: `Privacy Policy | ${CHURCH}`, description: 'How we collect, use and protect your information.', index: true, sitemapPriority: 0.2 }),
  page({ path: '/terms', title: `Terms of Use | ${CHURCH}`, description: 'Terms of use for this website and Saint Paul’s Everywhere.', index: true, sitemapPriority: 0.2 }),
  page({ path: '/login', title: 'Sign in | Saint Paul’s Everywhere', description: 'Sign in to Saint Paul’s Everywhere, the member and staff hub of The Saint Paul’s Baptist Church.', image: OG('connect'), index: false }),
  page({ path: '/portal', title: 'Member Portal | Saint Paul’s Everywhere', description: 'Your life stage, events, groups, giving and prayer requests in one place.', image: OG('connect'), index: false }),
  page({ path: '/admin', title: 'Staff Hub | Saint Paul’s Everywhere', description: 'Both campuses, life stages, events, outreach, the Grant Advisor and AI agents in one place.', image: OG('connect'), index: false }),
]

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function render(template: string, p: PageMeta): string {
  const url = p.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${p.path}`
  const map: Record<string, string> = {
    '__PAGE_TITLE__': esc(p.title),
    '__PAGE_DESC__': esc(p.description),
    '__PAGE_ROBOTS__': p.index ? 'index, follow' : 'noindex, follow',
    '__PAGE_URL__': url,
    '__PAGE_OG_TITLE__': esc(p.ogTitle),
    '__PAGE_OG_DESC__': esc(p.ogDescription),
    // ?v= changes every build so iMessage, Facebook and Slack fetch the new card instead of a cached one.
    '__PAGE_IMAGE__': `${SITE_URL}${p.image}?v=${OG_VERSION}`,
    '__PAGE_IMAGE_ALT__': esc(p.imageAlt),
    '__SITE_HOST__': SITE_HOST,
  }
  let out = template
  for (const [k, v] of Object.entries(map)) out = out.split(k).join(v)
  const left = out.match(/__(?:PAGE_[A-Z_]+|SITE_HOST)__/)
  if (left) throw new Error(`site-meta: unreplaced token ${left[0]}`)
  return out
}

function siteMeta(): Plugin {
  let template = ''
  let outDir = 'dist'
  return {
    name: 'site-meta',
    configResolved(c) { outDir = resolve(c.root, c.build.outDir) },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        template = html
        return render(html, pages[0])
      },
    },
    closeBundle() {
      if (!template) return
      for (const p of pages.slice(1)) {
        const f = resolve(outDir, p.file)
        mkdirSync(dirname(f), { recursive: true })
        writeFileSync(f, render(template, p))
      }
      const today = new Date().toISOString().slice(0, 10)
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
        .filter((p) => p.index)
        .map((p) => `  <url><loc>${p.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${p.path}`}</loc><lastmod>${today}</lastmod><priority>${(p.sitemapPriority ?? 0.5).toFixed(1)}</priority></url>`)
        .join('\n')}\n</urlset>\n`
      writeFileSync(resolve(outDir, 'sitemap.xml'), sitemap)
      writeFileSync(resolve(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
      // Netlify rewrites: each shareable page to its own HTML (link previews), then SPA fallbacks. Generated so it never drifts.
      const legacy = ['/about /our-story 301', '/ministries /life-stages 301', '/get-help /community/get-help 301']
      const rw = pages.slice(1).filter((p) => !['/portal', '/admin'].includes(p.path)).map((p) => `${p.path} /${p.file} 200`)
      writeFileSync(resolve(outDir, '_redirects'), [...legacy, ...rw, '/portal /portal.html 200', '/portal/* /portal.html 200', '/admin /admin.html 200', '/admin/* /admin.html 200', '/* /index.html 200', ''].join('\n'))
    },
  }
}

export default defineConfig({
  plugins: [react(), siteMeta()],
  define: {
    __SITE_URL__: JSON.stringify(SITE_URL),
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
