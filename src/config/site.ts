/**
 * The Saint Paul's Baptist Church: public facts used across the website.
 * Sources (crawled 2026-10-21): myspbc.org, myspbc.events (21 pages), grow.myspbc.org public calendar + prayer page,
 * press (WTVR, WRIC, Richmond BizSense, Homes.com, Henrico Citizen), ProPublica, Rep. Bobby Scott's 2009 floor statement.
 * See docs/01, 02 and 05. Search "TODO: confirm with church" before launch.
 */
export const church = {
  name: 'The Saint Paul’s Baptist Church',
  plainName: "The Saint Paul's Baptist Church",
  short: 'Saint Paul’s',
  initials: 'SPBC',
  tagline: 'A church for people on the GROW.',
  mission: 'We exist to empower people to GROW into the persons God created them to be.',
  everywhere: 'Saint Paul’s Everywhere. One church. One mission. Wherever you are.',
  /** City of Possibility name origin (Homes.com, 2025): "with God all things are possible" */
  scripture: 'With God all things are possible.',
  scriptureRef: 'Matthew 19:26',
  founded: 1909,
  foundedNote: 'Thanksgiving night, 1909',
  /** 117th Church Anniversary: Sunday, November 15, 2026 */
  anniversary: 117,
  phone: '804.643.4769',
  phoneWord: '(GROW)',
  phoneHref: 'tel:+18046434769',
  transportPhone: '804.463.2429',
  transportHref: 'tel:+18044632429',
  prayerLine: '855.518.2394',
  prayerLineHref: 'tel:+18555182394',
  /** Role inboxes confirmed on the church's own pages. TODO: confirm a general info@ / visit@ / care@ inbox. */
  outreachEmail: 'Outreach@myspbc.org',
  imaginationEmail: 'imagination@myspbc.org',
  facebook: 'https://www.facebook.com/myspbc/',
  instagram: 'https://www.instagram.com/myspbc/',
  youtube: 'https://www.youtube.com/myspbc',
  theme2026: { title: 'Generations United: We Are One', ref: 'Ephesians 3:17–19', text: 'That you, being rooted and grounded in love, may be able to comprehend with all the saints what is the width and length and depth and height, to know the love of Christ which passes knowledge.' },
  nia: { name: 'Nia Community Development Corporation of Greater Richmond', ein: '54-1736110', founded: 1992 },
  foundation: { name: 'Saint Paul’s Community Foundation', ein: '20-4242064' },
  // Primary (Creighton) address, used by the staff hub and letters.
  address: '4247 Creighton Road',
  street: '4247 Creighton Rd',
  city: 'Henrico',
  state: 'VA',
  zip: '23223',
  neighborhood: 'Eastern Henrico and Southside Richmond',
  /** TODO: confirm with church a general office inbox; Outreach@ is the role inbox published on myspbc.events. */
  email: 'Outreach@myspbc.org',
  // The church's community development arm, used by the Grant Advisor (applies where churches cannot).
  centerName: 'Nia Community Development Corporation of Greater Richmond',
  centerShort: 'Nia',
  centerEin: '54-1736110',
  centerMission: 'To empower people to help themselves and others achieve wellness, holistically, through awareness, education, support and advocacy.',
  centerEmail: 'Outreach@myspbc.org',
  formNames: { contact: 'spbc-contact', prayer: 'spbc-prayer', help: 'spbc-help', visit: 'spbc-visit', volunteer: 'spbc-volunteer', guides: 'spbc-guides' },
} as const

export type Campus = {
  id: 'creighton' | 'belt' | 'online'
  name: string
  short: string
  time: string
  /** Special Sundays (anniversaries) move Belt to 12:00 PM. */
  note?: string
  street?: string
  city?: string
  zip?: string
  area: string
  directionsUrl?: string
  mapsEmbed?: string
  watchUrl?: string
  blurb: string
}

const dir = (q: string) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`

export const campuses: Campus[] = [
  {
    id: 'creighton', name: 'Creighton Campus', short: 'Creighton', time: '9:00 AM', street: '4247 Creighton Road', city: 'Henrico, VA', zip: '23223', area: 'Eastern Henrico (Varina)',
    directionsUrl: dir("The Saint Paul's Baptist Church, 4247 Creighton Road, Henrico, VA 23223"),
    mapsEmbed: 'https://www.google.com/maps?q=4247+Creighton+Road+Henrico+VA+23223&output=embed',
    blurb: 'Our flagship campus on Creighton Road, home of The Commons, Fire on Fridays and our Christmas production. Worship streams live at 9 AM.',
  },
  {
    id: 'belt', name: 'Belt Campus', short: 'Belt', time: '11:30 AM', note: 'Special Sundays at 12:00 PM', street: '700 E. Belt Boulevard', city: 'Richmond, VA', zip: '23224', area: 'Southside Richmond',
    directionsUrl: dir("The Saint Paul's Baptist Church, 700 E. Belt Boulevard, Richmond, VA 23224"),
    mapsEmbed: 'https://www.google.com/maps?q=700+E+Belt+Boulevard+Richmond+VA+23224&output=embed',
    blurb: 'Our Southside campus on Belt Boulevard, home of Dignity on the Go mobile showers and Freeform Fridays for young adults.',
  },
  {
    id: 'online', name: 'Online', short: 'Online', time: '9:00 AM', area: 'Saint Paul’s Everywhere', watchUrl: 'https://myspbc.tv',
    blurb: 'Worship live at MySPBC.tv, on YouTube or Facebook @myspbc, or in the SPBC app. Replays all week.',
  },
]

export type WeeklyItem = { day: string; short: string; dayIndex: number; time: string; title: string; detail: string; kind: 'worship' | 'study' | 'care' | 'outreach' | 'youth' | 'music' | 'fellowship'; where: string; href?: string }

/**
 * The weekly rhythm (myspbc.org + the public Rock calendar at grow.myspbc.org/events, read 2026-10-21;
 * weekdays derived from each series' start date in that calendar).
 */
export const weekly: WeeklyItem[] = [
  { day: 'Sunday', short: 'Sun', dayIndex: 0, time: '9:00 AM', title: 'Worship · Creighton & Online', detail: '4247 Creighton Road and live at MySPBC.tv. imagiNATION Bible Study for kids during worship.', kind: 'worship', where: 'Creighton · Online', href: '/visit/creighton' },
  { day: 'Sunday', short: 'Sun', dayIndex: 0, time: '11:30 AM', title: 'Worship · Belt', detail: '700 E. Belt Boulevard. imagiNATION Bible Study for kids during worship.', kind: 'worship', where: 'Belt', href: '/visit/belt' },
  { day: 'Tuesday', short: 'Tue', dayIndex: 2, time: '11:00 AM', title: 'Refiners Bible Study · Belt', detail: 'Daytime study for our 70+ saints.', kind: 'study', where: 'Belt', href: '/life-stages/refiners' },
  { day: 'Tuesday', short: 'Tue', dayIndex: 2, time: '7:00 PM', title: 'Dreamchasers & Fusion Bible Study', detail: 'Dreamchasers (20s) online; Fusion (40s) at Creighton.', kind: 'study', where: 'Online · Creighton', href: '/life-stages' },
  { day: 'Wednesday', short: 'Wed', dayIndex: 3, time: '7:14 AM', title: '7:14 Prayer', detail: 'Community prayer by phone. Call 855.518.2394 and select 1 to subscribe.', kind: 'care', where: 'By phone', href: '/prayer' },
  { day: 'Wednesday', short: 'Wed', dayIndex: 3, time: '10:00 AM', title: 'Dignity on the Go: Mobile Showers', detail: 'Free mobile showers for neighbors.', kind: 'outreach', where: 'Belt', href: '/community' },
  { day: 'Wednesday', short: 'Wed', dayIndex: 3, time: '11:00 AM', title: 'Refiners Bible Study · Creighton', detail: 'Daytime study for our 70+ saints.', kind: 'study', where: 'Creighton', href: '/life-stages/refiners' },
  { day: 'Wednesday', short: 'Wed', dayIndex: 3, time: '7:00 PM', title: 'Encore & Prime Time Bible Study', detail: 'Encore (50s) at Creighton; Prime Time (60s) online.', kind: 'study', where: 'Creighton · Online', href: '/life-stages' },
  { day: 'Thursday', short: 'Thu', dayIndex: 4, time: '11 AM or 7 PM', title: 'THE BRIDGE Bible Study', detail: 'Online Bible study for everyone. This fall: Joy Is My Superpower, a study in Philippians.', kind: 'study', where: 'Online', href: '/grow' },
  { day: 'Friday', short: 'Fri', dayIndex: 5, time: '4:00 PM', title: 'Community Fresh Food Distribution', detail: 'Fresh food for neighbors, Fridays through December 11.', kind: 'outreach', where: 'Creighton', href: '/community' },
  { day: 'Friday', short: 'Fri', dayIndex: 5, time: '7:00 PM', title: 'Freeform Fridays', detail: 'Third Fridays for young and emerging adults: relax, relate and release.', kind: 'fellowship', where: 'Belt', href: '/life-stages/dreamchasers' },
]

/** Office hours. TODO: confirm with church (not published on the current site). */
export const officeHours: { d: string; h: string }[] = [
  { d: 'Office hours', h: 'Call 804.643.4769 (GROW)' },
]

export type LifeStage = {
  id: string
  name: string
  ages: string
  min: number
  max: number
  pastor: string
  blurb: string
  study?: string
  color: string
  email?: string
}

/**
 * Eight life stages with their Life Stage Pastors, as listed on myspbc.org.
 * TODO: confirm pairings with church (pastor names sit between cards on the live page).
 */
export const lifeStages: LifeStage[] = [
  { id: 'imagination', name: 'imagiNATION', ages: 'Birth to 10', min: 0, max: 10, pastor: 'Min. Vernita Williams', blurb: 'Children’s ministry: Bible study during worship at both campuses, Trunk or Treat, and a safe, joyful place to meet Jesus.', study: 'Sundays during worship: 9:00 AM Creighton · 11:30 AM Belt', color: '#C2410C', email: 'imagination@myspbc.org' },
  { id: 'smb', name: 'SMB', ages: '11 to 19', min: 11, max: 19, pastor: 'Min. Martina Jones', blurb: 'Students and youth: Bible study, mentoring and events built for middle and high schoolers.', color: '#A8344F' },
  { id: 'dreamchasers', name: 'Dreamchasers', ages: '20 to 29', min: 20, max: 29, pastor: 'Rev. Juan Shackelford', blurb: 'Young adults chasing God’s dream for their lives. Online Bible study and Freeform Fridays at Belt.', study: 'Tuesdays 7:00 PM online · Freeform Fridays at Belt', color: '#673391' },
  { id: 'aspire', name: 'ASPIRE', ages: '30 to 39', min: 30, max: 39, pastor: 'Rev. Lance Watson, Jr.', blurb: 'Building careers, marriages and families on faith.', color: '#1F5F94' },
  { id: 'fusion', name: 'Fusion', ages: '40 to 49', min: 40, max: 49, pastor: 'Rev. Michelle Townsend', blurb: 'Faith, family and purpose in the middle of life.', study: 'Tuesdays 7:00 PM at Creighton', color: '#006C3A' },
  { id: 'encore', name: 'Encore', ages: '50 to 59', min: 50, max: 59, pastor: 'Dr. Lisa Johnson', blurb: 'Your next act, lived with purpose and fellowship.', study: 'Wednesdays 7:00 PM at Creighton', color: '#8A5A12' },
  { id: 'prime-time', name: 'Prime Time', ages: '60 to 69', min: 60, max: 69, pastor: 'Dr. Maceo Freeman, Jr.', blurb: 'Seasoned saints in their prime: study, service and friendship.', study: 'Wednesdays 7:00 PM online', color: '#00492A' },
  { id: 'refiners', name: 'Refiners', ages: '70 and up', min: 70, max: 120, pastor: 'Rev. Roscoe Jones', blurb: 'Wisdom that refines a whole church. Daytime Bible study at both campuses.', study: 'Tuesdays 11 AM at Belt · Wednesdays 11 AM at Creighton', color: '#5B3A7A' },
]

export const stageForAge = (age: number) => lifeStages.find((s) => age >= s.min && age <= s.max) ?? lifeStages[lifeStages.length - 1]

export const leadership = {
  pastor: { name: 'Rev. Dr. Lance D. Watson, Sr.', title: 'Senior Pastor', since: 1985 },
  firstLady: { name: 'First Lady Rose Watson', title: 'First Lady' },
}

/** Kept for the staff Help page */
export const site = { email: church.outreachEmail, phone: church.phone }
