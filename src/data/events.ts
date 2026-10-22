/**
 * Public events, folded in from myspbc.events (all 21 pages read 2026-10-21) and the public Rock calendar.
 * Registration buttons go to the church's own Rock RMS event pages (docs/05-link-map.md §C).
 * Flyers are the church's own images in public/images/church/flyers.
 * In production the staff hub's Events module publishes here (see README "Integrations").
 */
export type CampusKey = 'creighton' | 'belt' | 'both' | 'online' | 'offsite' | 'virginia'
export type EventKind = 'worship' | 'study' | 'family' | 'community' | 'fellowship' | 'celebration' | 'care'

export type Session = { date: string; start: string; end?: string; campus?: CampusKey; label?: string }

export type PublicEvent = {
  slug: string
  title: string
  kicker?: string
  kind: EventKind
  campus: CampusKey
  /** Human-readable when (shown on cards) */
  when: string
  /** Human-readable where */
  where: string
  address?: string
  /** First date (sorting, upcoming/past split) and last date for ranges */
  date: string
  endDate?: string
  sessions: Session[]
  summary: string
  body: string[]
  highlights?: string[]
  flyer?: string
  flyerAlt?: string
  actions?: { label: string; href: string; primary?: boolean }[]
  lifeStages?: string[]
  free?: boolean
  scripture?: { text: string; ref: string }
}

const CREIGHTON = '4247 Creighton Road, Henrico, VA 23223'
const BELT = '700 E. Belt Boulevard, Richmond, VA 23224'
const BOTH = `Creighton: ${CREIGHTON} · Belt: ${BELT}`
/** Weekly sessions from a start date for n weeks. */
function weeklyFrom(start: string, weeks: number, t: string, tEnd: string, campus?: CampusKey, label?: string): Session[] {
  const out: Session[] = []
  const d = new Date(start + 'T12:00:00')
  for (let i = 0; i < weeks; i++) { out.push({ date: d.toISOString().slice(0, 10), start: t, end: tEnd, campus, label }); d.setDate(d.getDate() + 7) }
  return out
}
/** Registrations happen in Saint Paul’s Everywhere (the member portal), which replaces the Rock event pages.
 *  Old Rock occurrence ids are kept in comments so the church can map existing sign-ups. */
export const register = (slug: string, option?: string) => `/portal/events?register=${slug}${option ? `&option=${encodeURIComponent(option)}` : ''}`

export const events: PublicEvent[] = [
  {
    slug: 'your-voice-your-vote', title: 'Your Voice, Your Vote', kind: 'community', campus: 'virginia', date: '2026-09-18', endDate: '2026-11-03',
    when: 'Early voting Sep 18 to Oct 31 · Election Day Tue, Nov 3', where: 'Your local polling place',
    sessions: [{ date: '2026-11-03', start: '06:00', end: '19:00', label: 'Election Day' }],
    summary: 'Make your voice heard, Virginia. Check your registration and make your plan to vote early or on Election Day.',
    body: ['Early voting in Virginia runs September 18 through October 31. The registration deadline is October 23, and Election Day is Tuesday, November 3.', 'Polling hours vary by locality, so check your local schedule and polling place before you go.'],
    flyer: 'flyers/your-voice-your-vote.png', flyerAlt: 'Your Voice, Your Vote flyer',
    actions: [{ label: 'Find your polling place at vote.gov', href: 'https://vote.gov', primary: true }],
  },
  {
    slug: 'joy-is-my-superpower', title: 'Joy Is My Superpower', kicker: 'THE BRIDGE · A study in Philippians', kind: 'study', campus: 'online', date: '2026-09-24',
    when: 'Thursdays · 11:00 AM or 7:00 PM', where: 'Online at MySPBC.tv',
    // TODO: confirm with church when the fall study ends (page says ongoing; 12 weeks assumed)
    endDate: '2026-12-10',
    sessions: [...weeklyFrom('2026-09-24', 12, '11:00', '12:00', 'online', 'Midday'), ...weeklyFrom('2026-09-24', 12, '19:00', '20:00', 'online', 'Evening')],
    summary: 'Hold on to joy, find peace and live with purpose, no matter what life brings.',
    body: ['Our fall study of THE BRIDGE, our online Bible study, walks through Philippians and presents joy as strength for everyday life, not just a feeling.', 'Pick the midday or evening study each Thursday. Missed one? Every lesson is on the replay list.'],
    flyer: 'flyers/joy-is-my-superpower.png', flyerAlt: 'Joy Is My Superpower Bible study flyer',
    actions: [{ label: 'Join online', href: 'https://myspbc.tv', primary: true }, { label: 'Replay previous lessons', href: 'http://myspbc.info/TheBridge' }],
    scripture: { text: 'Rejoice in the Lord always. Again I will say, rejoice!', ref: 'Philippians 4:4' },
  },
  {
    slug: 'before-you-jump-the-broom', title: 'Before You Jump the Broom', kicker: 'Free 6-week premarital series', kind: 'care', campus: 'creighton', date: '2026-10-07', endDate: '2026-11-11',
    when: 'Wednesdays, Oct 7 to Nov 11 · 6:30 PM', where: 'Creighton Campus', address: CREIGHTON,
    sessions: weeklyFrom('2026-10-07', 6, '18:30', '20:00', 'creighton'),
    summary: 'Don’t just plan the big day. Prepare for a marriage that lasts.',
    body: ['A free six-week premarital counseling series with real conversations, practical tools and wisdom to help you build a strong foundation before you say “I do.”'],
    flyer: 'flyers/before-you-jump-the-broom.png', flyerAlt: 'Before You Jump the Broom premarital series flyer',
    actions: [{ label: 'Register', href: register('before-you-jump-the-broom'), primary: true }], free: true,
  },
  {
    slug: 'harvest-festival', title: 'Harvest Festival: Trunk or Treat', kind: 'family', campus: 'both', date: '2026-10-31',
    when: 'Saturday, October 31 · 1:00 to 3:00 PM', where: 'Both campuses', address: BOTH,
    sessions: [{ date: '2026-10-31', start: '13:00', end: '15:00', campus: 'both' }],
    summary: 'Treats, trunks and togetherness. A free outdoor afternoon of Trunk or Treat, games, food and fall fun.',
    body: ['imagiNATION and SMB invite the whole family to the Harvest Festival at the Creighton and Belt campuses. Admission is free and no registration is needed to attend.', 'Bring canned goods if you can to help stock our food pantry and support Saint Paul’s Outreach. Candy donations can go in the donation boxes in the Atrium at both campuses.'],
    highlights: ['Free admission', 'Bring canned goods for the pantry', 'Volunteers: decorate a trunk or hand out candy'],
    flyer: 'flyers/harvest-festival.jpg', flyerAlt: 'Harvest Festival Trunk or Treat flyer',
    actions: [{ label: 'Provide a trunk at Creighton', href: register('harvest-festival', 'Trunk at Creighton'), primary: true }, { label: 'Provide a trunk at Belt', href: register('harvest-festival', 'Trunk at Belt') } /* Rock 295, 294 */], lifeStages: ['imagination', 'smb'], free: true,
  },
  {
    slug: 'rhythm-of-gratitude', title: 'The Rhythm of Gratitude', kicker: 'A new devotional from Pastor Watson', kind: 'celebration', campus: 'creighton', date: '2026-11-01',
    when: 'Book signing Sunday, November 1 · time to be announced', where: 'Location to be announced',
    sessions: [{ date: '2026-11-01', start: '12:00', label: 'Book signing (time TBA)' }],
    summary: 'Discover Dr. Lance Watson’s new book, The Rhythm of Gratitude: A 30-Day Devotional for a More Joyful Life.',
    body: ['Scripture, music playlists, reflections, prayer and daily “Gratitude Workouts” help readers of every generation make gratitude part of everyday life.', 'Preorder your copy and join the book signing on Sunday, November 1. Time and location will be announced.'],
    flyer: 'flyers/rhythm-of-gratitude.jpg', flyerAlt: 'The Rhythm of Gratitude devotional flyer',
    actions: [{ label: 'Preorder your copy', href: 'https://square.link/u/gkbFj3T4', primary: true }],
  },
  {
    slug: 'fire-on-fridays', title: 'Fire on Fridays', kind: 'worship', campus: 'creighton', date: '2026-11-06', endDate: '2026-11-27',
    when: 'Every Friday in November · 7:00 PM', where: 'Creighton Campus only', address: CREIGHTON,
    sessions: [
      { date: '2026-11-06', start: '19:00', end: '21:00', campus: 'creighton', label: 'Bishop Rudolph McKissick, Jr.' },
      { date: '2026-11-13', start: '19:00', end: '21:00', campus: 'creighton', label: 'Dr. Jennifer L. Carner' },
      { date: '2026-11-20', start: '19:00', end: '21:00', campus: 'creighton', label: 'Dr. Ralph West' },
      { date: '2026-11-27', start: '19:00', end: '21:00', campus: 'creighton', label: 'Allison Henderson Brooks' },
    ],
    summary: 'Prayer, praise and preaching to close out your week and set your heart for the weekend.',
    body: ['Fire on Fridays returns every Friday night in November at the Creighton Campus. Bring your expectation.', 'The Culinary Arts Ministry serves a buffet from 5:00 PM. Preorder for dine-in; to-go is $8.99 per pound.'],
    flyer: 'flyers/fire-fridays.png', flyerAlt: 'Fire on Fridays flyer',
    actions: [{ label: 'Preorder a buffet meal', href: register('fire-on-fridays', 'Buffet meal'), primary: true }, { label: 'Watch online', href: 'https://myspbc.tv' }],
  },
  {
    slug: 'veterans-brunch', title: 'Veterans Brunch', kind: 'community', campus: 'creighton', date: '2026-11-07',
    when: 'Saturday, November 7 · 11:30 AM to 1:30 PM', where: 'The Commons, Creighton Campus', address: CREIGHTON,
    sessions: [{ date: '2026-11-07', start: '11:30', end: '13:30', campus: 'creighton' }],
    summary: 'A free brunch honoring veterans of every age, with food, fellowship and laughter.',
    body: ['We celebrate your service and sacrifice with a free brunch in The Commons, laughter with comedian Antoine Scott, and organizations offering resources for veterans.'],
    flyer: 'flyers/veterans-brunch.jpg', flyerAlt: 'Veterans Brunch flyer',
    actions: [{ label: 'Register', href: register('veterans-brunch'), primary: true }], free: true,
  },
  {
    slug: 'movie-night', title: 'Pastor & People Movie Experience', kicker: '“God with Us”', kind: 'fellowship', campus: 'offsite', date: '2026-11-14',
    when: 'Saturday, November 14 · 12:00, 3:00 or 6:00 PM', where: 'Victory Theater on Midlothian', address: '7903 Midlothian Turnpike, Richmond, VA',
    sessions: [{ date: '2026-11-14', start: '12:00', end: '14:30' }, { date: '2026-11-14', start: '15:00', end: '17:30' }, { date: '2026-11-14', start: '18:00', end: '20:30', label: 'With comedian Larry Willis' }],
    summary: 'A special showing of “God with Us” with the film’s executive producer, our own Senior Pastor Dr. Lance Watson, Sr.',
    body: ['Pick any of three showtimes. The 6:00 PM showing includes a special set by comedian Larry Willis.', 'Seating is limited and registration is required.'],
    flyer: 'flyers/movie-night.png', flyerAlt: 'Pastor and People Movie Experience flyer',
    actions: [{ label: 'Register (required)', href: register('movie-night'), primary: true } /* Rock 283 */],
  },
  {
    slug: 'church-anniversary', title: '117th Church Anniversary', kicker: 'Generations United: We Are One', kind: 'celebration', campus: 'both', date: '2026-11-15',
    when: 'Sunday, November 15 · Creighton 9:00 AM · Belt 12:00 PM', where: 'Both campuses', address: BOTH,
    sessions: [{ date: '2026-11-15', start: '09:00', end: '11:00', campus: 'creighton' }, { date: '2026-11-15', start: '12:00', end: '14:00', campus: 'belt' }],
    summary: 'One hundred seventeen years of faithfulness in Richmond. We honor the legacy and look ahead to what God is still doing.',
    body: ['This year’s theme, Generations United: We Are One, is inspired by Ephesians 3:17–19 and the love and faith that connect us across generations.', 'We welcome Dr. Walter Malone Jr. as our special guest preacher. Worship at 9:00 AM at Creighton or 12:00 PM at Belt.'],
    flyer: 'flyers/church-anniversary.png', flyerAlt: '117th Church Anniversary flyer',
    actions: [{ label: 'Plan your visit', href: '/visit', primary: true }, { label: 'Watch online', href: 'https://myspbc.tv' }],
    scripture: { text: 'That you, being rooted and grounded in love, may be able to comprehend with all the saints…', ref: 'Ephesians 3:17–18' },
  },
  {
    slug: 'christmas', title: 'The Spirit of Christmas', kicker: 'Our signature Christmas production', kind: 'celebration', campus: 'creighton', date: '2026-12-12', endDate: '2026-12-13',
    when: 'December 12 & 13 · 7:00 PM both nights', where: 'Creighton Campus', address: CREIGHTON,
    sessions: [{ date: '2026-12-12', start: '19:00', end: '21:00', campus: 'creighton' }, { date: '2026-12-13', start: '19:00', end: '21:00', campus: 'creighton' }],
    summary: 'Choir, orchestra, candlelight and the story that changes everything. Invite the whole family.',
    // TODO: confirm with church whether tickets or reservations are needed.
    body: ['Two nights of our signature Christmas production: the easiest night of the year to bring a guest.'],
    actions: [{ label: 'Plan your visit', href: '/visit/creighton', primary: true }],
  },
  {
    slug: 'nye', title: 'Breakthrough 2027', kicker: 'New Year’s Eve service', kind: 'worship', campus: 'both', date: '2026-12-31',
    when: 'Thursday, December 31 · Belt 12:00 PM · Creighton 7:00 PM', where: 'Both campuses', address: BOTH,
    sessions: [{ date: '2026-12-31', start: '12:00', end: '14:00', campus: 'belt' }, { date: '2026-12-31', start: '19:00', end: '21:00', campus: 'creighton' }],
    summary: 'Celebrate the blessings of one year and anticipate the blessings of a new one.',
    body: ['A powerful Word from Senior Pastor Dr. Lance Watson and uplifting worship from our music ministry featuring the New Year’s Eve Choir.'],
    actions: [{ label: 'Plan your visit', href: '/visit', primary: true }, { label: 'Watch online', href: 'https://myspbc.tv' }],
  },
  // ---------- Past (recaps) ----------
  {
    slug: 'pastor-people', title: '41st Pastor & People Anniversary', kicker: 'Unlocking the Legacy', kind: 'celebration', campus: 'both', date: '2026-10-11',
    when: 'Sunday, October 11 · Creighton 9:00 AM · Belt 12:00 PM', where: 'Both campuses', address: BOTH,
    sessions: [{ date: '2026-10-11', start: '09:00', campus: 'creighton' }, { date: '2026-10-11', start: '12:00', campus: 'belt' }],
    summary: 'Forty-one years of Pastor and People: Dr. Lance D. Watson and the Saint Paul’s family.',
    body: ['We celebrated our 41st Pastor & People Anniversary, “Unlocking the Legacy,” with Dr. Lance D. Watson at both campuses and online.'],
    flyer: 'flyers/pastor-people.png', flyerAlt: '41st Pastor and People Anniversary flyer',
    actions: [{ label: 'Watch the replay', href: 'http://myspbc.info/Worship' }],
  },
  {
    slug: 'mens-fellowship-night', title: 'Men’s Fellowship Night', kicker: 'Bowling & Billiards with Pastor', kind: 'fellowship', campus: 'offsite', date: '2026-10-09',
    when: 'Friday, October 9 · 7:00 to 10:00 PM', where: 'Uptown Alley, Midlothian', address: '6101 Brad McNeer Parkway, Midlothian, VA 23112',
    sessions: [{ date: '2026-10-09', start: '19:00', end: '22:00' }],
    summary: 'The Men’s Ministry gathered for bowling, billiards and brotherhood.', body: ['A night for the men of Saint Paul’s to bowl, shoot pool and build friendships.'],
    flyer: 'flyers/mens-fellowship-night.png', flyerAlt: 'Men’s Fellowship Night flyer',
  },
  {
    slug: 'vaccination-clinic', title: 'Immunization & Vaccination Clinic', kind: 'care', campus: 'creighton', date: '2026-09-27',
    when: 'Sunday, September 27 · 10:30 AM to 12:30 PM', where: 'The Commons, Creighton Campus', address: CREIGHTON,
    sessions: [{ date: '2026-09-27', start: '10:30', end: '12:30', campus: 'creighton' }],
    summary: 'COVID-19, flu, tetanus, pneumonia, RSV and shingles vaccines before the holidays.', body: ['Neighbors and members got protected before fall and winter gatherings, right on campus.'],
    flyer: 'flyers/vaccination-clinic.jpg', flyerAlt: 'Immunization and Vaccination Clinic flyer',
  },
  {
    slug: 'diaper-food-popup', title: 'Community Diaper Pop-Up & Fresh Food Distribution', kind: 'community', campus: 'creighton', date: '2026-09-25',
    when: 'Friday, September 25 · 4:00 PM', where: 'Creighton Campus', address: CREIGHTON,
    sessions: [{ date: '2026-09-25', start: '16:00', campus: 'creighton' }],
    summary: 'Diapers for local families and fresh food for neighbors, with Urban Baby Beginnings and Feed More.', body: ['Families registered with Urban Baby Beginnings for diaper support, and neighbors received fresh food at our Friday distribution.'],
    flyer: 'flyers/diaper-food-popup.png', flyerAlt: 'Community Diaper Pop-Up and Fresh Food Distribution flyer',
    actions: [{ label: 'Email Outreach', href: 'mailto:Outreach@myspbc.org' }],
  },
  {
    slug: 'first-lady', title: 'First Lady Day', kicker: 'Passport to 41', kind: 'celebration', campus: 'both', date: '2026-09-20',
    when: 'Sunday, September 20 · Creighton 9:00 AM · Belt 12:00 PM', where: 'Both campuses', address: BOTH,
    sessions: [{ date: '2026-09-20', start: '09:00', campus: 'creighton' }, { date: '2026-09-20', start: '12:00', campus: 'belt' }],
    summary: 'We celebrated First Lady Rose Watson, with Bishop Jason Nelson preaching at both campuses.', body: ['First Lady Day honored First Lady Rose Watson on her birthday, with Bishop Jason Nelson as our guest preacher.'],
    flyer: 'flyers/first-lady.png', flyerAlt: 'First Lady Day flyer',
  },
  {
    slug: 'youth-mentoring-open-house', title: 'Youth Mentoring Open House', kicker: 'Sons & Daughters of the King · Kisura & Lions of Judah', kind: 'family', campus: 'creighton', date: '2026-09-17',
    when: 'Thursday, September 17 · 6:00 PM', where: 'The Commons, Creighton Campus', address: CREIGHTON,
    sessions: [{ date: '2026-09-17', start: '18:00', campus: 'creighton' }],
    summary: 'An open house for middle and high schoolers and their parents to meet our youth mentoring programs.', body: ['Guests included pro boxer Tori Jovan Nelson, Dr. Sheriff Antoinette Irving and Shenee McCray, LCSW.'],
    flyer: 'flyers/youth-mentoring-open-house.png', flyerAlt: 'Youth Mentoring Open House flyer', lifeStages: ['smb'],
  },
  {
    slug: 'prayer-power-hour', title: 'Prayer Power Hour', kind: 'care', campus: 'creighton', date: '2026-09-15',
    when: 'Tuesday, September 15 · 7:00 PM', where: 'Creighton Campus Chapel', address: CREIGHTON,
    sessions: [{ date: '2026-09-15', start: '19:00', end: '20:00', campus: 'creighton' }],
    summary: 'The church family gathered to pray, bringing requests, praise and expectation.', body: ['An hour of united prayer in the Creighton Campus Chapel.'],
    flyer: 'flyers/prayer-power-hour.png', flyerAlt: 'Prayer Power Hour flyer',
    scripture: { text: 'Call to Me and I will answer you.', ref: 'Jeremiah 33:3' },
  },
  {
    slug: 'health-fair', title: '2026 Family Health Fair', kind: 'community', campus: 'creighton', date: '2026-09-13',
    when: 'Sunday, September 13 · 12:00 to 4:00 PM', where: 'Creighton Campus', address: CREIGHTON,
    sessions: [{ date: '2026-09-13', start: '12:00', end: '16:00', campus: 'creighton' }],
    summary: 'Free health screenings, nutrition tips, movement, vendors and giveaways, with the Henrico County Alumnae Chapter of Delta Sigma Theta Sorority, Inc.', body: ['A free, family-friendly afternoon of health and wellness, open to the public.'],
    flyer: 'flyers/health-fair.png', flyerAlt: '2026 Family Health Fair flyer',
  },
  {
    slug: 'homecoming', title: 'Homecoming Weekend', kind: 'celebration', campus: 'creighton', date: '2026-09-13',
    when: 'Sunday, September 13 · Worship 10:00 AM', where: 'Creighton Campus', address: CREIGHTON,
    sessions: [{ date: '2026-09-13', start: '10:00', campus: 'creighton' }],
    summary: 'One combined family reunion service with Dr. Lance Watson, Maranda Curtis and the combined choirs, then an afternoon on the grounds.',
    body: ['After worship: the Family Health Fair, a HOMEcoming scavenger hunt, a seniors line-dancing Guinness World Record challenge, a Kids Zone, live entertainment, basketball, tug of war and tailgating.'],
    flyer: 'flyers/homecoming.webp', flyerAlt: 'Homecoming Weekend flyer',
  },
]

/** Fall 2026 lineup tagline from myspbc.events */
export const lineupTagline = 'Ignite your fall: Faith, Family, Friends, Fun and Fellowship.'

const end = (e: PublicEvent) => e.endDate ?? e.date
export const today = () => new Date().toISOString().slice(0, 10)
export const upcomingEvents = (ref = today()) => events.filter((e) => end(e) >= ref).sort((a, b) => nextDate(a, ref).localeCompare(nextDate(b, ref)))
export const pastEvents = (ref = today()) => events.filter((e) => end(e) < ref).sort((a, b) => b.date.localeCompare(a.date))
export const eventBySlug = (slug: string) => events.find((e) => e.slug === slug)
/** The next date this event happens (for ranges, the next session date or today if in progress). */
export function nextDate(e: PublicEvent, ref = today()) {
  const next = e.sessions.map((s) => s.date).filter((d) => d >= ref).sort()[0]
  if (next) return next
  return e.date >= ref ? e.date : ref
}

/** Build an .ics file for one event (all sessions). */
export function icsFor(e: PublicEvent): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'
  const fmt = (d: string, t: string) => `${d.replace(/-/g, '')}T${t.replace(':', '')}00`
  const addHour = (t: string) => { const [h, m] = t.split(':').map(Number); return `${String(Math.min(h + 1, 23)).padStart(2, '0')}:${String(m).padStart(2, '0')}` }
  const esc = (s: string) => s.replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n')
  const vevents = e.sessions.map((s, i) => [
    'BEGIN:VEVENT',
    `UID:${e.slug}-${i}@myspbc.org`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=America/New_York:${fmt(s.date, s.start)}`,
    `DTEND;TZID=America/New_York:${fmt(s.date, s.end ?? addHour(s.start))}`,
    `SUMMARY:${esc(e.title + (s.label ? ` (${s.label})` : ''))}`,
    `LOCATION:${esc(e.address ?? e.where)}`,
    `DESCRIPTION:${esc(e.summary)}`,
    'END:VEVENT',
  ].join('\r\n'))
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', "PRODID:-//The Saint Paul's Baptist Church//Events//EN", 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', ...vevents, 'END:VCALENDAR'].join('\r\n')
}
