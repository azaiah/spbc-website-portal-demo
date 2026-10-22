/**
 * Every outside link the site uses, in one place (docs/05-link-map.md).
 * Clicked through 2026-10-21. The church's own short links (myspbc.info/...) are kept as targets
 * because the church controls where they point.
 * TODO: confirm with church — anything marked `todo: true` is a link the old site promised but never provided.
 */
export type OutLink = { label: string; href: string; note?: string; todo?: boolean }

export const links = {
  watchLive: { label: 'Watch live at MySPBC.tv', href: 'https://myspbc.tv' },
  watchLiveAlt: { label: 'Live stream', href: 'https://live.myspbc.org', note: 'Used on myspbc.events; confirm which is canonical' },
  weekendWorship: { label: 'Weekend Worship replays', href: 'http://myspbc.info/Worship', note: 'Resolves to the YouTube “Weekend Worship” playlist' },
  prayerCalls: { label: '7:14 Prayer Calls', href: 'http://myspbc.info/714Prayer', note: 'Resolves to the Subsplash “7:14 Prayer Calls” media list' },
  theBridge: { label: 'THE BRIDGE replays', href: 'http://myspbc.info/TheBridge', note: 'Resolves to the YouTube “The Bridge Bible Study” playlist' },
  youtube: { label: 'YouTube @myspbc', href: 'https://www.youtube.com/myspbc' },
  facebook: { label: 'Facebook @myspbc', href: 'https://www.facebook.com/myspbc/' },
  instagram: { label: 'Instagram @myspbc', href: 'https://www.instagram.com/myspbc/' },
  give: { label: 'Give with Pushpay', href: 'https://pushpay.com/g/spbconline?src=churchconnect' },
  contactForm: { label: 'Church contact form', href: 'https://myspbc.ccbchurch.com/goto/forms/347/responses/new' },
  newHereForm: { label: 'New here? card', href: 'https://myspbc.ccbchurch.com/goto/forms/105/responses/new' },
  prayerForm: { label: 'Prayer request', href: '/prayer', note: 'Replaces the Rock prayer form (grow.myspbc.org/prayer); members can also use the portal at /portal/care' },
  memberLogin: { label: 'Sign in', href: '/login', note: 'Saint Paul’s Everywhere member portal (replaces the Rock “My Account” page, grow.myspbc.org/myaccount)' },
  calendar: { label: 'Full church calendar', href: '/events', note: 'Replaces the Rock calendar (grow.myspbc.org/events)' },
  getApp: { label: 'Get the SPBC app', href: 'https://grow.myspbc.org/getapp' },
  appStore: { label: 'Download on the App Store', href: 'https://grow.myspbc.org/app-apple-appstore' },
  googlePlay: { label: 'Get it on Google Play', href: 'https://grow.myspbc.org/app-google-playstore' },
  bulletin: { label: 'This week’s e-bulletin (PDF)', href: 'https://acrobat.adobe.com/id/urn:aaid:sc:us:20e17aa7-cf9e-4325-a2ec-926d1394ede2' },
  culinary: { label: 'Fire on Fridays buffet preorders', href: 'https://grow.myspbc.org/culinarycalendar' },
  outreachEmail: { label: 'Outreach@myspbc.org', href: 'mailto:Outreach@myspbc.org' },
  imaginationEmail: { label: 'imagination@myspbc.org', href: 'mailto:imagination@myspbc.org' },
  staffEmail: { label: 'Staff email (Microsoft 365)', href: 'https://outlook.office.com', note: 'TODO: confirm with church' },
  // Promised on the old homepage but never linked (dead CTAs). Pages exist here; outside tools need URLs from the church.
  myFit: { label: 'Take the MyFitAssessment', href: '/serve#myfit', todo: true },
  dnaClass: { label: 'DNA new members class schedule', href: '/next-steps#dna', todo: true },
  sqwire: { label: 'Financial wellness with Sqwire', href: '/next-steps#financial-wellness', todo: true },
  jobs: { label: 'Current job openings', href: '/next-steps#careers', todo: true },
  store: { label: 'Print-on-demand store', href: '/next-steps#store', todo: true },
  flowers: { label: 'Send flowers, plants, balloons or baskets', href: '/next-steps#flowers', todo: true },
  groups: { label: 'Group semester listing', href: '/grow#groups', todo: true },
  possibilityProgress: { label: 'Follow the progress', href: '/city-of-possibility' },
} satisfies Record<string, OutLink>

export const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href)
