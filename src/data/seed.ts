import type { DemoState, Member, Household, Gift, ChurchEvent, Registration, Reservation, Staff, Shift, Expense, BudgetLine, CareRequest, ServiceRequest, Attendance, AgentDraft, Approval, Task, Maintenance, Announcement, PantryDay, ShowerDay, Ministry, Sermon } from './types'
import { daysFromNow } from './dates'
import { opportunities, readiness } from './funding'
import { events as publicEvents } from './events'
import { lifeStages } from '@/config/site'

/**
 * Seed data for the Saint Paul's Everywhere demo.
 * Real: church name, campuses, schedule, life stages and their pastors' public names/titles, events, partners, history.
 * Sample (fictional, labeled): congregation members, households, gifts, care and help requests, finances, counts.
 * Real leaders never receive invented giving, care or personal records.
 */

function rng(seed: number) { let s = seed; return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296 } }
const rand = rng(19091125)
const pick = <T,>(a: readonly T[]) => a[Math.floor(rand() * a.length)]
const between = (a: number, b: number) => Math.floor(a + rand() * (b - a + 1))

const firsts = ['Marcus', 'Danielle', 'Jerome', 'Keisha', 'Darnell', 'Alicia', 'Terrence', 'Monique', 'Andre', 'Tamika', 'Reginald', 'Vanessa', 'Calvin', 'Felicia', 'Maurice', 'Gwendolyn', 'Dwayne', 'Patrice', 'Lamar', 'Simone', 'Bernard', 'Brenda', 'Rodney', 'Loretta', 'Cedric', 'Mae', 'Samuel', 'Grace', 'Isaiah', 'Ruth', 'Daniel', 'Esther', 'Joshua', 'Naomi', 'Elijah', 'Hannah', 'Caleb', 'Deborah', 'Micah', 'Lydia', 'Nathan', 'Priscilla', 'Jonathan', 'Abigail', 'Thomas', 'Miriam', 'Peter', 'Rebekah', 'Ernestine', 'Clarence', 'Odessa', 'Willie', 'Shirley', 'Otis', 'Jasmine', 'Malik', 'Aaliyah', 'Xavier', 'Imani', 'Jordan']
const lasts = ['Carter', 'Robinson', 'Mitchell', 'Harris', 'Washington', 'Coleman', 'Brooks', 'Price', 'Bryant', 'Griffin', 'Hayes', 'Ford', 'Simmons', 'Butler', 'Henderson', 'Patterson', 'Powell', 'Bailey', 'Chambers', 'Tucker', 'Lewis', 'Gaines', 'Booker', 'Talley', 'Spruill', 'Branch', 'Jeter', 'Cousins', 'Pleasants', 'Ellis']
const henrico = ['Creighton Rd', 'Cedar Fork Rd', 'Nine Mile Rd', 'Laburnum Ave', 'Darbytown Rd', 'Williamsburg Rd', 'Mechanicsville Tpke', 'Harvie Rd']
const southside = ['Belt Blvd', 'Midlothian Tpke', 'Hull St', 'Broad Rock Blvd', 'Jefferson Davis Hwy', 'Walmsley Blvd', 'Warwick Rd']

export const ministryIds = {
  imagination: 'min_imagination', smb: 'min_smb', dreamchasers: 'min_dreamchasers', aspire: 'min_aspire', fusion: 'min_fusion', encore: 'min_encore', primetime: 'min_primetime', refiners: 'min_refiners',
  outreach: 'min_outreach', transport: 'min_transport', music: 'min_music', culinary: 'min_culinary', media: 'min_media', hospitality: 'min_hospitality', prayer: 'min_prayer', men: 'min_men', marriage: 'min_marriage',
} as const
const stageMinistry = [ministryIds.imagination, ministryIds.smb, ministryIds.dreamchasers, ministryIds.aspire, ministryIds.fusion, ministryIds.encore, ministryIds.primetime, ministryIds.refiners]

function nextSunday(offsetWeeks: number) { const d = new Date(); d.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7) + offsetWeeks * 7); return d.toISOString().slice(0, 10) }
function nextWeekday(wd: number, offsetWeeks = 0) { const d = new Date(); d.setDate(d.getDate() + ((wd - d.getDay() + 7) % 7 || 7) + offsetWeeks * 7); return d.toISOString().slice(0, 10) }
function pastWeekday(wd: number, weeksAgo: number) { const d = new Date(); d.setDate(d.getDate() - ((d.getDay() - wd + 7) % 7 || 7) - (weeksAgo - 1) * 7); return d.toISOString().slice(0, 10) }

/** Public leaders (names and titles as listed by the church). Demo emails only. m_1..m_10 */
const leaders: { first: string; last: string; tags: string[]; ministryIds: string[]; email: string }[] = [
  { first: 'Lance D.', last: 'Watson, Sr.', tags: ['Senior Pastor', 'Rev. Dr.', 'Leader'], ministryIds: [], email: 'senior.pastor@spbc.example' },
  { first: 'Rose', last: 'Watson', tags: ['First Lady', 'Leader'], ministryIds: [ministryIds.music], email: 'first.lady@spbc.example' },
  ...lifeStages.map((s, i) => {
    const parts = s.pastor.replace(/^(Min\.|Rev\.|Dr\.)\s+/, '').split(' ')
    const title = s.pastor.match(/^(Min\.|Rev\.|Dr\.)/)?.[0] ?? ''
    return { first: parts.slice(0, -1).join(' ').replace(/,$/, '') || parts[0], last: parts.slice(-1)[0], tags: [`Life Stage Pastor · ${s.name}`, title, 'Leader'].filter(Boolean), ministryIds: [stageMinistry[i]], email: `${s.id}@spbc.example` }
  }),
]
// Fix names with suffixes ("Lance Watson, Jr.", "Maceo Freeman, Jr.") so they read naturally.
leaders.forEach((l) => { if (l.last === 'Jr.') { const p = l.first.split(' '); l.last = `${p.pop()} Jr.`.replace(',', ''); l.first = p.join(' ') } })
export const REAL_LEADER_COUNT = leaders.length

function makePeople() {
  const households: Household[] = []
  const members: Member[] = []
  leaders.forEach((l, i) => {
    households.push({ id: `hh_l${i + 1}`, name: `${l.last} Household`, address: 'On file with the church office' })
    members.push({ id: `m_${i + 1}`, first: l.first, last: l.last, email: l.email, phone: '804.643.4769', householdId: `hh_l${i + 1}`, status: 'member', joinedAt: '', firstVisit: '', ministryIds: l.ministryIds, tags: l.tags, consent: { email: true, sms: false }, lastContact: daysFromNow(-between(0, 6)), address: 'On file with the church office', notes: '', volunteerInterests: [] })
  })
  households.push({ id: 'hh_office', name: 'Church Office', address: '4247 Creighton Road, Henrico, VA 23223' })
  households.push({ id: 'hh_web', name: 'Website guests', address: 'Submitted on the website' })
  const office = [['m_11', 'Finance', 'Office'], ['m_12', 'Office &', 'Communications'], ['m_13', 'Outreach', 'Team'], ['m_14', 'Executive', 'Office']]
  office.forEach(([id, first, last]) => members.push({ id, first, last, email: `${first.toLowerCase().replace(/\W/g, '')}@spbc.example`, phone: '804.643.4769', householdId: 'hh_office', status: 'member', joinedAt: '2015-01-01', firstVisit: '2015-01-01', ministryIds: id === 'm_13' ? [ministryIds.outreach, ministryIds.transport] : [], tags: ['Sample account'], consent: { email: true, sms: false }, lastContact: daysFromNow(0), address: '4247 Creighton Road, Henrico, VA 23223', notes: '', volunteerInterests: [] }))

  const servingMinistries = [ministryIds.outreach, ministryIds.transport, ministryIds.music, ministryIds.culinary, ministryIds.media, ministryIds.hospitality, ministryIds.prayer, ministryIds.men]
  const statuses: Member['status'][] = ['member', 'member', 'member', 'member', 'member', 'attendee', 'attendee', 'visitor', 'inactive']
  let hh = 0
  const total = 96
  for (let i = 0; i < total; i++) {
    const id = `m_${i + 15}`
    const belt = rand() < 0.38
    if (i === 0 || rand() < 0.6) {
      hh += 1
      households.push({ id: `hh_${hh}`, name: `${pick(lasts)} Household`, address: belt ? `${between(100, 7400)} ${pick(southside)}, Richmond, VA 2322${pick(['4', '4', '5', '5', '0'])}` : `${between(100, 6900)} ${pick(henrico)}, Henrico, VA 2322${pick(['3', '3', '3', '1', '1'])}` })
    }
    const h = households[households.length - 1]
    const last = h.name.replace(' Household', '')
    const first = firsts[i % firsts.length]
    const status = pick(statuses)
    const joined = status === 'visitor' ? '' : `${between(1985, 2026)}-${String(between(1, 12)).padStart(2, '0')}-${String(between(1, 28)).padStart(2, '0')}`
    const by = between(1940, 2012)
    const age = new Date().getFullYear() - by
    const stageIdx = lifeStages.findIndex((s) => age >= s.min && age <= s.max)
    const mins = status === 'inactive' || status === 'visitor' ? [] : Array.from(new Set([stageMinistry[Math.max(0, stageIdx)], ...(rand() < 0.4 ? [pick(servingMinistries)] : [])]))
    members.push({
      id, first, last, email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`, phone: `(804) 555-0${String(between(100, 199))}`,
      householdId: h.id, status, joinedAt: joined, firstVisit: status === 'visitor' ? daysFromNow(-between(1, 21)) : joined || daysFromNow(-400),
      ministryIds: mins, tags: [belt ? 'Belt Campus' : rand() < 0.15 ? 'Online' : 'Creighton Campus', ...(rand() < 0.2 ? ['New this year'] : [])],
      consent: { email: rand() < 0.8, sms: rand() < 0.7 }, lastContact: daysFromNow(-between(0, 150)),
      address: h.address, birthday: `${by}-${String(between(1, 12)).padStart(2, '0')}-${String(between(1, 28)).padStart(2, '0')}`,
      notes: '', volunteerInterests: rand() < 0.5 ? [pick(['Greeting', 'Media & production', 'Fresh food distribution', 'Transportation', 'imagiNATION classrooms', 'Choir', 'Culinary Arts', 'Prayer Partners'])] : [],
    })
  }
  for (let i = 0; i < 9; i++) {
    const m = members[members.length - 1 - i]
    m.status = 'visitor'; m.joinedAt = ''; m.firstVisit = daysFromNow(-(i * 2 + 1)); m.ministryIds = []; m.tags = ['First-time guest', i % 3 === 0 ? 'Belt Campus' : 'Creighton Campus']; m.lastContact = i < 4 ? '' : daysFromNow(-i)
  }
  const sample = members.find((m) => m.id === 'm_20')!
  Object.assign(sample, { first: 'Angela', last: 'Brooks', status: 'member', email: 'angela.brooks@example.com', ministryIds: [ministryIds.fusion, ministryIds.hospitality], tags: ['Sample person', 'Creighton Campus'], consent: { email: true, sms: true }, volunteerInterests: ['Fresh food distribution'], joinedAt: '2016-04-10', lastContact: daysFromNow(-3), birthday: `${new Date().getFullYear() - 44}-06-12`, notes: '' })
  // Two more sample members so the portal demo can be seen from different seasons of life.
  const young = members.find((m) => m.id === 'm_21')
  if (young) Object.assign(young, { first: 'Marcus', last: 'Hill', status: 'member', email: 'marcus.hill@example.com', ministryIds: [ministryIds.aspire, ministryIds.imagination], tags: ['Sample person', 'Belt Campus', 'Parent'], consent: { email: true, sms: true }, volunteerInterests: ['Trunk or Treat'], joinedAt: '2021-09-12', lastContact: daysFromNow(-10), birthday: `${new Date().getFullYear() - 34}-02-03`, notes: '' })
  const senior = members.find((m) => m.id === 'm_22')
  if (senior) Object.assign(senior, { first: 'Dorothy', last: 'Green', status: 'member', email: 'dorothy.green@example.com', ministryIds: [ministryIds.refiners, ministryIds.prayer], tags: ['Sample person', 'Creighton Campus', 'Rides'], consent: { email: true, sms: false }, volunteerInterests: ['Prayer team'], joinedAt: '1987-05-03', lastContact: daysFromNow(-6), birthday: `${new Date().getFullYear() - 76}-09-21`, notes: '' })
  return { households, members }
}

export function createSeedState(): DemoState {
  const { households, members } = makePeople()
  const L = { watson: 'm_1', rose: 'm_2', vernita: 'm_3', martina: 'm_4', juan: 'm_5', lancejr: 'm_6', michelle: 'm_7', lisa: 'm_8', maceo: 'm_9', roscoe: 'm_10', finance: 'm_11', office: 'm_12', outreach: 'm_13', exec: 'm_14' }

  // TODO: confirm with church — the actual Pushpay fund list. These sample funds mirror the ministries on the site.
  const funds = [
    { id: 'f_general', name: 'Tithes & Offerings', type: 'general' as const, description: 'Worship, pastoral care and ministry at both campuses.' },
    { id: 'f_outreach', name: 'Community Outreach', type: 'designated' as const, goal: 60000, description: 'Fresh food Fridays, Dignity on the Go showers, diaper pop-ups and health clinics.' },
    { id: 'f_possibility', name: 'City of Possibility', type: 'restricted' as const, goal: 500000, description: 'Planning and development of the 321-acre City of Possibility (sample fund).' },
    { id: 'f_emergency', name: 'Emergency Financial Assistance', type: 'designated' as const, description: 'Help with bills and emergencies, supported by the Saint Paul’s Community Foundation.' },
    { id: 'f_youth', name: 'imagiNATION & SMB', type: 'designated' as const, goal: 30000, description: 'Children’s and student ministry, mentoring and events.' },
    { id: 'f_media', name: 'Saint Paul’s Everywhere (media)', type: 'designated' as const, goal: 40000, description: 'Livestreams, replays and the SPBC app.' },
  ]

  const realLeaderIds = new Set(Object.values(L))
  const gifts: Gift[] = []
  const givers = members.filter((m) => (m.status === 'member' || m.status === 'attendee') && !realLeaderIds.has(m.id))
  for (let d = 0; d < 200; d += 1) {
    const date = daysFromNow(-d)
    const isSunday = new Date(date + 'T12:00:00').getDay() === 0
    const n = isSunday ? between(28, 46) : between(2, 7)
    for (let i = 0; i < n; i++) {
      const m = pick(givers)
      const roll = rand()
      const fundId = roll < 0.74 ? 'f_general' : roll < 0.83 ? 'f_outreach' : roll < 0.9 ? 'f_possibility' : roll < 0.94 ? 'f_youth' : roll < 0.97 ? 'f_media' : 'f_emergency'
      gifts.push({ id: `g_${gifts.length + 1}`, memberId: m.id, amount: pick([20, 25, 40, 50, 50, 75, 100, 100, 120, 150, 200, 250, 300, 500]), fundId, method: isSunday ? pick(['online', 'online', 'card', 'check', 'cash', 'text']) : pick(['online', 'online', 'online', 'text', 'ach']), date, status: d > 6 ? 'reconciled' : 'recorded', recurring: rand() < 0.27 })
    }
  }
  ;[7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 91, 98].forEach((d, i) => gifts.push({ id: `g_s_${i}`, memberId: 'm_20', amount: i % 4 === 3 ? 25 : 120, fundId: i % 4 === 3 ? 'f_outreach' : 'f_general', method: 'online', date: daysFromNow(-d), status: 'reconciled', recurring: true }))

  const ministries: Ministry[] = [
    ...lifeStages.map((s, i): Ministry => ({ id: stageMinistry[i], name: `${s.name} (${s.ages})`, leaderId: `m_${3 + i}`, description: s.blurb, annualBudget: [36000, 30000, 14000, 12000, 12000, 10000, 10000, 12000][i], color: s.color, meets: s.study ?? 'See the church calendar' })),
    { id: ministryIds.outreach, name: 'Community Outreach', leaderId: L.outreach, description: 'Fresh food Fridays with Feed More, Dignity on the Go mobile showers, diaper pop-ups, health fairs and help requests.', annualBudget: 60000, color: '#006C3A', meets: 'Fridays 4 PM (Creighton) · Wednesdays 10 AM (Belt)' },
    { id: ministryIds.transport, name: 'Transportation', leaderId: L.outreach, description: 'Rides to worship, Bible study and programs. 804.463.2429.', annualBudget: 24000, color: '#1F5F94', meets: 'Sunday routes and on request' },
    { id: ministryIds.music, name: 'Music Ministry', leaderId: L.exec, description: 'Choirs, musicians and the New Year’s Eve Choir; the Christmas production with orchestra.', annualBudget: 48000, color: '#8A5A12', meets: 'Rehearsals by choir' },
    { id: ministryIds.culinary, name: 'Culinary Arts', leaderId: L.exec, description: 'Fire on Fridays buffets, fellowship meals and events.', annualBudget: 30000, color: '#B5520A', meets: 'Buffets from 5 PM on Fire on Fridays' },
    { id: ministryIds.media, name: 'Media & Production', leaderId: L.office, description: 'MySPBC.tv, YouTube and Facebook livestreams, replays, the SPBC app and the e-bulletin.', annualBudget: 40000, color: '#17131C', meets: 'Every service' },
    { id: ministryIds.hospitality, name: 'Hospitality & Greeters', leaderId: L.office, description: 'First impressions at both campuses: parking, doors, guest cards and seating.', annualBudget: 6000, color: '#5B3A7A', meets: 'Sundays before each service' },
    { id: ministryIds.prayer, name: 'Prayer Team & Prayer Partners', leaderId: L.exec, description: 'Intercessors who pray for needs in the church and the world; Prayer Partners pray with people after every weekend service; 7:14 Prayer.', annualBudget: 3000, color: '#673391', meets: 'Wednesdays 7:14 AM by phone' },
    { id: ministryIds.men, name: 'Men’s Ministry', leaderId: L.exec, description: 'Brotherhood, fellowship nights and mentoring.', annualBudget: 6000, color: '#00492A', meets: 'Monthly' },
    { id: ministryIds.marriage, name: 'Marriage & Premarital', leaderId: L.exec, description: 'Before You Jump the Broom premarital series and marriage enrichment.', annualBudget: 4000, color: '#A8344F', meets: 'Wednesdays 6:30 PM (series)' },
  ]

  const rooms = [
    { id: 'r_csanct', name: 'Creighton Sanctuary', capacity: 3000, kind: 'sanctuary' as const, rentalRate: 0 },
    { id: 'r_commons', name: 'The Commons (Creighton)', capacity: 400, kind: 'hall' as const, rentalRate: 900 },
    { id: 'r_chapel', name: 'Creighton Chapel', capacity: 150, kind: 'classroom' as const, rentalRate: 300 },
    { id: 'r_atrium', name: 'Atrium (Creighton)', capacity: 300, kind: 'hall' as const, rentalRate: 0 },
    { id: 'r_ckitchen', name: 'Creighton Kitchen', capacity: 20, kind: 'kitchen' as const, rentalRate: 250 },
    { id: 'r_bsanct', name: 'Belt Sanctuary', capacity: 800, kind: 'sanctuary' as const, rentalRate: 0 },
    { id: 'r_bhall', name: 'Belt Fellowship Space', capacity: 200, kind: 'hall' as const, rentalRate: 400 },
    { id: 'r_clot', name: 'Creighton Grounds & Lots', capacity: 2000, kind: 'outdoor' as const, rentalRate: 0 },
    { id: 'r_blot', name: 'Belt Parking Lot', capacity: 400, kind: 'outdoor' as const, rentalRate: 0 },
    { id: 'r_van', name: 'Transportation Van', capacity: 14, kind: 'vehicle' as const, rentalRate: 0 },
  ]
  // TODO: confirm with church — room names and capacities (sample values sized for the campuses).

  // Staff-side events: every public event (published to the website) plus internal meetings.
  const roomFor = (c: string) => (c === 'belt' ? 'r_bsanct' : c === 'offsite' || c === 'virginia' || c === 'online' ? 'r_csanct' : 'r_csanct')
  const catFor = (k: string): ChurchEvent['category'] => (k === 'worship' || k === 'celebration' ? 'worship' : k === 'study' ? 'class' : k === 'family' ? 'youth' : k === 'community' || k === 'care' ? 'community' : 'conference')
  const today = new Date().toISOString().slice(0, 10)
  const events: ChurchEvent[] = publicEvents.map((e, i): ChurchEvent => {
    const past = (e.endDate ?? e.date) < today
    const s = e.sessions.find((x) => x.date >= today) ?? e.sessions[0]
    return {
      id: `e_${i + 1}`, title: e.title, ministryId: e.lifeStages?.[0] ? `min_${e.lifeStages[0]}` : e.kind === 'community' ? ministryIds.outreach : e.kind === 'study' ? ministryIds.fusion : ministryIds.music,
      date: s.date, start: s.start, end: s.end ?? s.start, roomId: e.slug === 'veterans-brunch' || e.slug === 'vaccination-clinic' ? 'r_commons' : e.slug === 'prayer-power-hour' ? 'r_chapel' : roomFor(e.campus), description: e.summary,
      stage: past ? 'reported' : e.date <= daysFromNow(14) ? 'staffed' : 'promoted', budget: 0, spent: 0, capacity: e.slug === 'movie-night' ? 450 : 1500, isPublic: true, category: catFor(e.kind),
      registrationOpen: !!e.actions?.some((a) => a.href.startsWith('/portal/events')), ownerId: L.exec, attendance: undefined,
    }
  })
  const extra: ChurchEvent[] = [
    { id: 'e_vu', title: 'Volunteer University (winter session)', ministryId: ministryIds.hospitality, date: daysFromNow(80), start: '09:00', end: '13:00', roomId: 'r_commons', description: 'Quarterly one-day equipping for everyone who serves. Proposed date.', stage: 'proposed', budget: 2500, spent: 0, capacity: 400, isPublic: true, category: 'class', registrationOpen: false, ownerId: L.office },
    { id: 'e_lsp', title: 'Life Stage Pastors huddle', ministryId: ministryIds.fusion, date: nextWeekday(1), start: '10:00', end: '11:30', roomId: 'r_chapel', description: 'Weekly huddle: care follow-ups, guests to call, upcoming events by stage.', stage: 'staffed', budget: 0, spent: 0, capacity: 14, isPublic: false, category: 'meeting', registrationOpen: false, ownerId: L.watson },
    { id: 'e_xmas', title: 'Spirit of Christmas: production rehearsals', ministryId: ministryIds.music, date: daysFromNow(30), start: '18:30', end: '21:00', roomId: 'r_csanct', description: 'Choir and orchestra rehearsals for December 12–13.', stage: 'approved', budget: 18000, spent: 4200, capacity: 250, isPublic: false, category: 'meeting', registrationOpen: false, ownerId: L.exec },
  ]
  const allEvents = [...events, ...extra]
  const fire = allEvents.find((e) => e.title === 'Fire on Fridays'); if (fire) { fire.budget = 12000; fire.spent = 3100 }
  const trunk = allEvents.find((e) => e.title.startsWith('Harvest')); if (trunk) { trunk.budget = 6500; trunk.spent = 4800 }
  const vets = allEvents.find((e) => e.title === 'Veterans Brunch'); if (vets) { vets.budget = 5000; vets.spent = 1200 }
  allEvents.filter((e) => e.stage === 'reported').forEach((e) => { e.attendance = between(120, 900) })

  const registrations: Registration[] = []
  allEvents.filter((e) => e.registrationOpen).forEach((e) => {
    const n = between(14, 40)
    for (let i = 0; i < n; i++) {
      const m = i % 3 === 0 ? undefined : pick(members.slice(14))
      registrations.push({ id: `rg_${registrations.length + 1}`, eventId: e.id, memberId: m?.id, name: m ? `${m.first} ${m.last}` : `${pick(firsts)} ${pick(lasts)}`, email: m?.email ?? 'guest@example.com', qty: between(1, 3), date: daysFromNow(-between(0, 20)) })
    }
  })
  const movie = allEvents.find((e) => e.title.startsWith('Pastor & People Movie'))
  if (movie) registrations.push({ id: 'rg_s_1', eventId: movie.id, memberId: 'm_20', name: 'Angela Brooks', email: 'angela.brooks@example.com', qty: 2, date: daysFromNow(-4) })
  if (vets) registrations.push({ id: 'rg_s_2', eventId: vets.id, memberId: 'm_20', name: 'Angela Brooks', email: 'angela.brooks@example.com', qty: 1, date: daysFromNow(-2) })

  const reservations: Reservation[] = [
    { id: 'rs_1', roomId: 'r_commons', requester: 'Eastern Henrico civic association (sample)', date: daysFromNow(11), start: '18:00', end: '20:00', status: 'requested', purpose: 'Community meeting', external: true, fee: 450, deposit: 150, paid: false },
    { id: 'rs_2', roomId: 'r_commons', requester: 'Veterans Brunch setup', date: daysFromNow(16), start: '08:00', end: '14:00', status: 'approved', purpose: 'Brunch, resource tables and comedian', external: false },
    { id: 'rs_3', roomId: 'r_bhall', requester: 'Dignity on the Go partner (sample)', date: nextWeekday(3), start: '09:00', end: '12:00', status: 'approved', purpose: 'Mobile shower staging and hygiene kits', external: true, fee: 0, deposit: 0, paid: true },
    { id: 'rs_4', roomId: 'r_van', requester: 'Transportation', date: nextSunday(0), start: '07:45', end: '13:30', status: 'approved', purpose: 'Sunday pickup routes (Creighton and Belt)', external: false },
    { id: 'rs_5', roomId: 'r_chapel', requester: 'Wedding (member couple, sample)', date: daysFromNow(27), start: '14:00', end: '17:00', status: 'requested', purpose: 'Ceremony; Before You Jump the Broom completed', external: false, fee: 0, deposit: 0, paid: true },
  ]

  const maintenance: Maintenance[] = [
    { id: 'mt_1', area: 'Creighton Sanctuary', title: 'Stage lighting fixtures for the Christmas production', priority: 'high', status: 'scheduled', vendor: 'Production vendor (sample)', reportedBy: 'Media & Production', date: daysFromNow(-4), cost: 3800 },
    { id: 'mt_2', area: 'The Commons', title: 'HVAC service before the Veterans Brunch', priority: 'normal', status: 'assigned', vendor: 'HVAC vendor (sample)', reportedBy: 'Executive Office', date: daysFromNow(-8), cost: 640 },
    { id: 'mt_3', area: 'Belt Parking Lot', title: 'Repaint accessible spaces and crosswalk', priority: 'normal', status: 'open', reportedBy: 'Hospitality', date: daysFromNow(-15) },
    { id: 'mt_4', area: 'Transportation Van', title: 'Brake inspection and tire rotation', priority: 'urgent', status: 'open', reportedBy: 'Transportation', date: daysFromNow(-2) },
    { id: 'mt_5', area: 'Creighton Kitchen', title: 'Hood and fire suppression inspection before Fire on Fridays', priority: 'high', status: 'scheduled', vendor: 'Fire protection vendor (sample)', reportedBy: 'Culinary Arts', date: daysFromNow(-1), cost: 325 },
    { id: 'mt_6', area: 'Creighton Grounds & Lots', title: 'Trunk or Treat: cones, lighting and lot layout', priority: 'normal', status: 'scheduled', reportedBy: 'imagiNATION', date: daysFromNow(-3) },
  ]

  const assets = [
    { id: 'a_1', name: 'Creighton sanctuary sound and broadcast system', category: 'Audio/Visual', location: 'Creighton Sanctuary', serviceDue: daysFromNow(70), value: 250000 },
    { id: 'a_2', name: 'Livestream encoders and cameras (MySPBC.tv)', category: 'Audio/Visual', location: 'Media control room', serviceDue: daysFromNow(120), value: 60000 },
    { id: 'a_3', name: 'Transportation van (14-passenger)', category: 'Vehicle', location: 'Creighton lot', serviceDue: daysFromNow(-2), insuranceRenewal: daysFromNow(38), value: 32000 },
    { id: 'a_4', name: 'Creighton kitchen equipment', category: 'Kitchen', location: 'Creighton Kitchen', serviceDue: daysFromNow(110), value: 45000 },
    { id: 'a_5', name: 'Property insurance (both campuses)', category: 'Insurance', location: 'Executive Office', serviceDue: daysFromNow(64), insuranceRenewal: daysFromNow(64), value: 0 },
    { id: 'a_6', name: 'Belt sanctuary sound system', category: 'Audio/Visual', location: 'Belt Sanctuary', serviceDue: daysFromNow(30), value: 40000 },
  ]

  const staff: Staff[] = [
    { id: 's_1', name: 'Rev. Dr. Lance D. Watson, Sr.', title: 'Senior Pastor', type: 'employee', ministryIds: [], bgCheck: 'n/a', trainings: [], hoursThisMonth: 0, email: 'senior.pastor@spbc.example', startDate: '1985-10-01' },
    ...lifeStages.map((s, i): Staff => ({ id: `s_${i + 2}`, name: s.pastor, title: `Life Stage Pastor · ${s.name}`, type: 'employee', ministryIds: [stageMinistry[i]], bgCheck: 'n/a', trainings: [], hoursThisMonth: 0, email: `${s.id}@spbc.example`, startDate: '' })),
    { id: 's_10', name: 'Sample imagiNATION volunteer A', title: 'Classroom volunteer (Creighton)', type: 'volunteer', ministryIds: [ministryIds.imagination], bgCheck: 'clear', bgCheckDate: '2026-02-20', trainings: ['Child Safety'], hoursThisMonth: 12, email: 'kids.a@example.com', startDate: '2024-09-01' },
    { id: 's_11', name: 'Sample imagiNATION volunteer B', title: 'Classroom volunteer (Belt)', type: 'volunteer', ministryIds: [ministryIds.imagination], bgCheck: 'pending', trainings: [], hoursThisMonth: 4, email: 'kids.b@example.com', startDate: daysFromNow(-14) },
    { id: 's_12', name: 'Sample driver', title: 'Van driver', type: 'volunteer', ministryIds: [ministryIds.transport], bgCheck: 'expired', bgCheckDate: '2024-03-01', trainings: ['Defensive Driving'], hoursThisMonth: 18, email: 'driver@example.com', startDate: '2019-05-12' },
    { id: 's_13', name: 'Sample outreach volunteer', title: 'Fresh food intake', type: 'volunteer', ministryIds: [ministryIds.outreach], bgCheck: 'n/a', trainings: ['Food Safety'], hoursThisMonth: 16, email: 'food@example.com', startDate: '2021-02-01' },
    { id: 's_14', name: 'Sample shower volunteer', title: 'Dignity on the Go host', type: 'volunteer', ministryIds: [ministryIds.outreach], bgCheck: 'n/a', trainings: ['Hospitality'], hoursThisMonth: 10, email: 'showers@example.com', startDate: '2025-06-01' },
    { id: 's_15', name: 'Sample greeter', title: 'Greeter', type: 'volunteer', ministryIds: [ministryIds.hospitality], bgCheck: 'n/a', trainings: [], hoursThisMonth: 8, email: 'greeter@example.com', startDate: '2018-03-01' },
    { id: 's_16', name: 'Sample media volunteer', title: 'Camera operator', type: 'volunteer', ministryIds: [ministryIds.media], bgCheck: 'n/a', trainings: [], hoursThisMonth: 14, email: 'camera@example.com', startDate: '2022-01-09' },
  ]

  const shifts: Shift[] = []
  const shiftRoles: Record<string, string[]> = { [ministryIds.hospitality]: ['Creighton front doors', 'Belt front doors'], [ministryIds.media]: ['Livestream director', 'Camera 2'], [ministryIds.transport]: ['Van driver'], [ministryIds.outreach]: ['Fresh food intake', 'Shower host'], [ministryIds.imagination]: ['Classroom lead (Creighton)', 'Classroom lead (Belt)'] }
  for (let w = 0; w < 4; w++) {
    Object.entries(shiftRoles).forEach(([min, roles]) => roles.forEach((role) => {
      const date = min === ministryIds.outreach ? (role.startsWith('Shower') ? nextWeekday(3, w) : nextWeekday(5, w)) : nextSunday(w)
      const filled = rand() < 0.65
      const s = staff.filter((x) => x.ministryIds.includes(min) && x.type === 'volunteer' && (x.bgCheck === 'clear' || x.bgCheck === 'n/a'))
      shifts.push({ id: `sh_${shifts.length + 1}`, ministryId: min, date, role, staffId: filled && s.length ? pick(s).id : undefined, status: filled && s.length ? (rand() < 0.6 ? 'confirmed' : 'filled') : 'open' })
    }))
  }

  const expenses: Expense[] = [
    { id: 'x_1', ministryId: ministryIds.imagination, vendor: 'Party supplier (sample)', amount: 1240, category: 'Events', status: 'approved', requestedById: L.vernita, date: daysFromNow(-6), note: 'Trunk or Treat games and candy backup for both campuses' },
    { id: 'x_2', ministryId: ministryIds.culinary, vendor: 'Food distributor (sample)', amount: 3100, category: 'Food', status: 'requested', requestedById: L.exec, date: daysFromNow(-1), note: 'Fire on Fridays buffet food, first two weeks' },
    { id: 'x_3', ministryId: ministryIds.music, vendor: 'Orchestra contractor (sample)', amount: 9500, category: 'Events', status: 'requested', requestedById: L.exec, date: daysFromNow(-2), note: 'The Spirit of Christmas orchestra deposit' },
    { id: 'x_4', ministryId: ministryIds.outreach, vendor: 'Hygiene supplies (sample)', amount: 780, category: 'Supplies', status: 'paid', requestedById: L.outreach, date: daysFromNow(-12), note: 'Towels and hygiene kits for Dignity on the Go' },
    { id: 'x_5', ministryId: ministryIds.transport, vendor: 'Auto service (sample)', amount: 610, category: 'Vehicle', status: 'approved', requestedById: L.outreach, date: daysFromNow(-3), note: 'Van brakes and tire rotation' },
    { id: 'x_6', ministryId: ministryIds.media, vendor: 'Streaming platform (sample)', amount: 1800, category: 'Software', status: 'paid', requestedById: L.office, date: daysFromNow(-30), note: 'Annual streaming service for MySPBC.tv' },
    { id: 'x_7', ministryId: ministryIds.refiners, vendor: 'Caterer (sample)', amount: 420, category: 'Fellowship', status: 'requested', requestedById: L.roscoe, date: daysFromNow(0), note: 'Refiners Bible study fellowship lunch (both campuses)' },
  ]

  const budgets: BudgetLine[] = []
  ministries.forEach((m) => {
    ;['Programs', 'Supplies', 'Events', 'Equipment'].forEach((c, i) => {
      const planned = Math.round((m.annualBudget / 12) * [0.5, 0.2, 0.2, 0.1][i])
      budgets.push({ id: `b_${budgets.length + 1}`, ministryId: m.id, category: c, planned, actual: Math.round(planned * (0.55 + rand() * 0.75)) })
    })
  })

  const care: CareRequest[] = [
    { id: 'c_1', kind: 'prayer', memberId: 'm_20', name: 'Angela Brooks', contact: 'angela.brooks@example.com', text: 'Please pray for my son as he starts a new job next week.', confidential: false, assigneeId: L.michelle, status: 'assigned', date: daysFromNow(-1), updates: [] },
    { id: 'c_2', kind: 'pastoral', memberId: 'm_31', name: 'Sample member', contact: '(804) 555-0144', text: 'Would like to speak with a pastor about a family matter. Evenings are best.', confidential: true, status: 'new', date: daysFromNow(0), updates: [] },
    { id: 'c_3', kind: 'assistance', name: 'Walk-in neighbor (Belt)', contact: '(804) 555-0177', text: 'Behind on the electric bill after losing hours at work. Shutoff notice dated next Friday.', confidential: true, assigneeId: L.outreach, status: 'in-progress', date: daysFromNow(-2), updates: [{ date: daysFromNow(-1), note: 'Emergency assistance request for $280 submitted to the Foundation. Awaiting Finance approval.' }] },
    { id: 'c_4', kind: 'prayer', memberId: 'm_44', name: 'Sample member', contact: 'sample@example.com', text: 'Praise report: surgery went well. Thank you, church family.', confidential: false, status: 'closed', date: daysFromNow(-6), updates: [{ date: daysFromNow(-5), note: 'Shared with Prime Time Bible study with permission.' }] },
    { id: 'c_5', kind: 'pastoral', memberId: 'm_52', name: 'Sample member', contact: 'sample2@example.com', text: 'Grief support after losing her mother last month.', confidential: true, assigneeId: L.lisa, status: 'in-progress', date: daysFromNow(-12), updates: [{ date: daysFromNow(-10), note: 'Encore pastor called; counselor appointment set.' }] },
  ]

  const services: ServiceRequest[] = [
    { id: 'sv_1', program: 'food', name: 'Neighbor (Varina)', contact: '(804) 555-0161', text: 'Family of five, need groceries this week.', status: 'fulfilled', coordinatorId: L.outreach, date: daysFromNow(-3), householdSize: 5, outcome: 'Fresh food provided Friday' },
    { id: 'sv_2', program: 'emergency', name: 'Neighbor (Southside)', contact: 'neighbor@example.com', text: 'Shower and clean clothes; staying with friends.', status: 'fulfilled', coordinatorId: L.outreach, date: daysFromNow(-4), householdSize: 1, outcome: 'Dignity on the Go shower and hygiene kit; referred for housing' },
    { id: 'sv_3', program: 'employment', name: 'Neighbor (reentry)', contact: '(804) 555-0188', text: 'Recently home and looking for work.', status: 'in-progress', coordinatorId: L.outreach, date: daysFromNow(-6) },
    { id: 'sv_4', program: 'transportation', name: 'Refiners member', contact: '(804) 555-0122', text: 'Ride to Wednesday 11 AM Refiners Bible study at Creighton.', status: 'assigned', coordinatorId: L.outreach, date: daysFromNow(-1) },
    { id: 'sv_5', program: 'transportation', name: 'Senior neighbor', contact: '(804) 555-0131', text: 'Ride to Sunday worship at Belt from Broad Rock.', status: 'new', date: daysFromNow(0) },
    { id: 'sv_6', program: 'senior', name: 'Prime Time member', contact: '(804) 555-0133', text: 'Wellness check requested; lives alone.', status: 'new', date: daysFromNow(0) },
    { id: 'sv_7', program: 'emergency', name: 'Family (Belt area)', contact: 'family@example.com', text: 'Diapers (size 4) and formula.', status: 'in-progress', coordinatorId: L.outreach, date: daysFromNow(-2), householdSize: 4 },
    { id: 'sv_8', program: 'food', name: 'Neighbor (Highland Springs)', contact: '(804) 555-0109', text: 'First visit to Friday distribution; senior on a fixed income.', status: 'fulfilled', coordinatorId: L.outreach, date: daysFromNow(-10), householdSize: 1, outcome: 'Fresh food provided; added to reminder list' },
  ]

  const announcements: Announcement[] = [
    { id: 'an_1', title: 'Trunk or Treat this Saturday', body: 'Free Harvest Festival at both campuses, 1 to 3 PM. Bring canned goods for the pantry. Trunk volunteers, register in the app.', channels: ['bulletin', 'website', 'sms'], status: 'approved', date: daysFromNow(2), audience: 'All members and community list', authorId: L.office },
    { id: 'an_2', title: 'Fire on Fridays starts November 6', body: 'Prayer, praise and preaching every Friday in November at 7 PM, Creighton only. Buffet from 5 PM: preorder in the app.', channels: ['bulletin', 'website', 'email'], status: 'draft', date: daysFromNow(5), audience: 'All members', authorId: L.office },
    { id: 'an_3', title: 'Veterans Brunch: register', body: 'Saturday, November 7, 11:30 AM in The Commons. Free for veterans of every age.', channels: ['website', 'bulletin'], status: 'scheduled', date: daysFromNow(6), audience: 'All members and community list', authorId: L.office },
    { id: 'an_4', title: 'Generations United: We Are One', body: 'Celebrate 117 years on Sunday, November 15. Guest preacher Dr. Walter Malone Jr. Creighton 9 AM · Belt 12 PM.', channels: ['bulletin', 'website'], status: 'approved', date: daysFromNow(10), audience: 'All members', authorId: L.watson },
  ]
  const campaigns = [
    { id: 'cp_1', name: 'Weekly GPS guide (email)', channel: 'email' as const, segment: 'Guide subscribers (sample)', recipients: 2140, status: 'sent' as const, sentAt: daysFromNow(-3), opens: 1180, clicks: 402 },
    { id: 'cp_2', name: '7:14 Prayer reminder (text)', channel: 'sms' as const, segment: 'Prayer line subscribers (sample, consented)', recipients: 860, status: 'approved' as const },
    { id: 'cp_3', name: 'Fire on Fridays invitation', channel: 'email' as const, segment: 'All contacts with email consent (sample)', recipients: 5200, status: 'draft' as const },
    { id: 'cp_4', name: 'First-time guest welcome (automated)', channel: 'email' as const, segment: 'First-time guests, last 30 days', recipients: 9, status: 'sent' as const, sentAt: daysFromNow(-1), opens: 7, clicks: 4 },
  ]
  const documents = [
    { id: 'd_1', title: 'Facility Use & Rental Policy (sample)', category: 'policy' as const, updated: daysFromNow(-40), ownerId: L.exec, size: '210 KB' },
    { id: 'd_2', title: 'Life Stage Pastors huddle notes, October', category: 'minutes' as const, updated: daysFromNow(-7), ownerId: L.office, size: '84 KB' },
    { id: 'd_3', title: 'Volunteer Application & Background Check Consent', category: 'form' as const, updated: daysFromNow(-120), ownerId: L.exec, size: '118 KB' },
    { id: 'd_4', title: 'imagiNATION Child Safety & Check-in Policy', category: 'policy' as const, updated: daysFromNow(-50), ownerId: L.vernita, size: '96 KB' },
    { id: 'd_5', title: 'Emergency Financial Assistance Guidelines (Foundation)', category: 'policy' as const, updated: daysFromNow(-210), ownerId: L.finance, size: '62 KB' },
    { id: 'd_6', title: 'Nia Form 990-EZ (FY2024)', category: 'report' as const, updated: daysFromNow(-320), ownerId: L.finance, size: '1.2 MB' },
    { id: 'd_7', title: 'City of Possibility pattern book (rezoning application)', category: 'report' as const, updated: daysFromNow(-400), ownerId: L.exec, size: '18 MB' },
    { id: 'd_8', title: 'Certificate of Liability Insurance (both campuses)', category: 'agreement' as const, updated: daysFromNow(-70), ownerId: L.exec, size: '140 KB' },
  ]
  const meetings = [
    { id: 'mg_1', title: 'Life Stage Pastors huddle', date: nextWeekday(1), attendees: ['Dr. Lance D. Watson, Sr.', ...lifeStages.map((s) => s.pastor)], agenda: ['First-time guests from Sunday by life stage', 'Trunk or Treat volunteers (imagiNATION, SMB)', '117th Anniversary: roles by stage', 'Care follow-ups'], notes: '', actions: [{ text: 'Assign guest calls by life stage', ownerId: L.office, done: false }, { text: 'Confirm anniversary ushers by stage', ownerId: L.exec, done: false }] },
    { id: 'mg_2', title: 'Christmas production planning', date: daysFromNow(-5), attendees: ['Executive Office', 'Music Ministry', 'Media & Production'], agenda: ['Orchestra deposit', 'Lighting', 'Guest parking for two nights'], notes: 'Two nights, 7 PM. Overflow parking plan needed.', actions: [{ text: 'Get lighting quotes', ownerId: L.office, done: true }, { text: 'Draft parking plan', ownerId: L.exec, done: false }] },
  ]

  const partners = [
    { id: 'p_1', name: 'Feed More', type: 'nonprofit' as const, contact: 'Agency relations', status: 'active' as const, notes: 'Partner for the Community Fresh Food Distribution (Fridays 4 PM, Creighton).' },
    { id: 'p_2', name: 'Urban Baby Beginnings', type: 'nonprofit' as const, contact: '833.RVA.BABY', status: 'active' as const, notes: 'Partner for community diaper pop-ups (families register by diaper size).' },
    { id: 'p_3', name: 'Delta Sigma Theta Sorority, Inc., Henrico County Alumnae Chapter', type: 'nonprofit' as const, contact: 'Chapter leadership', status: 'active' as const, notes: 'Co-presented the 2026 Family Health Fair.' },
    { id: 'p_4', name: 'Clark Nexsen', type: 'vendor' as const, contact: 'Project team', status: 'active' as const, notes: 'Design partner on the City of Possibility renderings and rezoning (press, 2025).' },
    { id: 'p_5', name: 'Henrico County Planning', type: 'agency' as const, contact: 'Planning staff', status: 'active' as const, notes: 'City of Possibility rezoning. TODO: confirm current status.' },
    { id: 'p_6', name: 'Victory Theater on Midlothian', type: 'vendor' as const, contact: 'Group sales', status: 'active' as const, notes: 'Pastor & People Movie Experience, November 14.' },
    { id: 'p_7', name: 'Henrico and Richmond businesses (NAP prospects)', type: 'sponsor' as const, contact: 'To be assigned', status: 'prospect' as const, notes: 'Prospects for NAP-credited sponsorships through Nia (up to 65% Virginia tax credit).' },
  ]
  const businesses = [
    { id: 'bz_1', name: 'Sample member business: catering', ownerMemberId: 'm_33', category: 'Catering', phone: '(804) 555-0150', website: '', approved: true },
    { id: 'bz_2', name: 'Sample member business: barbershop', ownerMemberId: 'm_37', category: 'Grooming', phone: '(804) 555-0151', website: '', approved: true },
    { id: 'bz_3', name: 'Sample member business: tax preparation', ownerMemberId: 'm_42', category: 'Professional services', phone: '(804) 555-0152', website: '', approved: false },
  ]
  const grants = [
    { id: 'gr_1', name: 'Nonprofit Security Grant: Creighton & Belt', funder: 'FEMA via VDEM', amount: 400000, deadline: '2027-07-09', status: 'identified' as const, ownerId: L.exec, opportunityId: 'op_nsgp', entity: 'church' as const },
    { id: 'gr_2', name: 'Section 5310 accessible van (through Nia)', funder: 'Virginia DRPT', amount: 85000, deadline: '2027-02-01', status: 'identified' as const, ownerId: L.outreach, opportunityId: 'op_5310', entity: 'center' as const },
    { id: 'gr_3', name: 'NAP tax-credit sponsorships (Nia)', funder: 'Virginia DSS', amount: 75000, deadline: '2027-05-03', status: 'applying' as const, ownerId: L.exec, opportunityId: 'op_nap', entity: 'center' as const },
    { id: 'gr_4', name: 'Solar canopies at Creighton (elective pay)', funder: 'IRS', amount: 250000, deadline: '2027-12-31', status: 'identified' as const, ownerId: L.exec, opportunityId: 'op_solar', entity: 'church' as const },
  ]
  const programs = [
    { id: 'pg_1', name: 'Community Fresh Food Distribution (Fridays)', kind: 'financial' as const, enrolled: 0, completed: 0, nextCohort: nextWeekday(5) },
    { id: 'pg_2', name: 'Dignity on the Go: Mobile Showers (Wednesdays)', kind: 'financial' as const, enrolled: 0, completed: 0, nextCohort: nextWeekday(3) },
    { id: 'pg_3', name: 'Sons & Daughters of the King · Kisura & Lions of Judah (youth mentoring)', kind: 'youth' as const, enrolled: 34, completed: 0, nextCohort: daysFromNow(21) },
    { id: 'pg_4', name: 'Before You Jump the Broom (premarital)', kind: 'education' as const, enrolled: 22, completed: 0, nextCohort: '2027-02-03' },
    { id: 'pg_5', name: 'Volunteer University', kind: 'education' as const, enrolled: 0, completed: 0, nextCohort: daysFromNow(80) },
  ]

  const drafts: AgentDraft[] = [
    { id: 'dr_1', agentId: 'office', title: 'This week’s e-bulletin', kind: 'Bulletin', module: 'office', reviewerRole: 'secretary', status: 'pending', createdAt: daysFromNow(0), body: 'THE SAINT PAUL’S BAPTIST CHURCH\nA church for people on the GROW.\nCreighton 9:00 AM & Online · Belt 11:30 AM\n\nTHIS WEEK\n- Wednesday: 7:14 Prayer (855.518.2394, select 1) · Dignity on the Go, 10 AM, Belt\n- Thursday: THE BRIDGE: Joy Is My Superpower, 11 AM or 7 PM online\n- Friday: Fresh Food Distribution, 4 PM, Creighton\n- Saturday: Harvest Festival: Trunk or Treat, 1 to 3 PM, both campuses\n\nCOMING UP\n- Fire on Fridays begins November 6 (Creighton only, 7 PM)\n- Veterans Brunch, November 7 (register)\n- 117th Church Anniversary, November 15: Generations United: We Are One\n\nGIVE\nGive online or in the SPBC app. Set up recurring giving in about a minute.' },
    { id: 'dr_2', agentId: 'finance', title: 'Weekly giving summary', kind: 'Report', module: 'finance', reviewerRole: 'finance', status: 'pending', createdAt: daysFromNow(0), body: 'Giving summary for the week ending Sunday (sample data).\n\nTithes & Offerings: about three quarters of gifts\nRecurring share: about one in four gifts\n\nFlags for review:\n- Christmas orchestra deposit ($9,500) pending\n- Fire on Fridays food order ($3,100) exceeds the Culinary Arts monthly line\n- 6 first-time online givers this month: send a thank-you note' },
    { id: 'dr_3', agentId: 'member', title: 'Welcome notes for 9 first-time guests', kind: 'Letters', module: 'members', reviewerRole: 'admin', status: 'pending', createdAt: daysFromNow(0), body: 'Dear {first name},\n\nThank you for worshiping with us at The Saint Paul’s Baptist Church. We are a church for people on the GROW, and we would love to help you find your place.\n\nEvery season of life has its own pastor and Bible study here, from imagiNATION for children to Refiners for our 70+ saints. Reply with your life stage and we’ll connect you, or call 804.643.4769 (GROW).\n\nSee you Sunday: Creighton at 9 AM, Belt at 11:30 AM, or online at MySPBC.tv.\n\nThe Saint Paul’s family' },
    { id: 'dr_4', agentId: 'event', title: 'Trunk or Treat logistics checklist', kind: 'Checklist', module: 'events', reviewerRole: 'admin', status: 'pending', createdAt: daysFromNow(-1), body: 'Harvest Festival: Trunk or Treat (both campuses)\n\nOpen items:\n- 14 trunk volunteers still needed at Belt (Rock event 294)\n- Candy donation boxes in both Atriums\n- Canned goods collection bins and Outreach team at each lot\n- Lot layout and lighting at Creighton (work order open)\n- Text reminder to the community list needs approval' },
    { id: 'dr_5', agentId: 'outreach', title: 'Fire on Fridays social post', kind: 'Social post', module: 'comms', reviewerRole: 'secretary', status: 'pending', createdAt: daysFromNow(-1), body: 'Fire on Fridays is back! 🔥\nEvery Friday in November, 7 PM, Creighton Campus only.\nNov 6 Bishop Rudolph McKissick, Jr. · Nov 13 Dr. Jennifer L. Carner · Nov 20 Dr. Ralph West · Nov 27 Allison Henderson Brooks\nBuffet from 5 PM: preorder in the SPBC app.\n#PeopleOnTheGROW #SaintPaulsEverywhere' },
    { id: 'dr_6', agentId: 'facilities', title: 'Work order: van brakes (urgent)', kind: 'Work order', module: 'facilities', reviewerRole: 'admin', status: 'pending', createdAt: daysFromNow(-1), body: 'Vehicle: Transportation van (14-passenger)\nIssue: Brake noise reported by Transportation\nAction: Remove from service until inspected. Sample quote: $610.\nImpact: Sunday routes and Refiners rides need a backup plan this week.' },
    { id: 'dr_7', agentId: 'grants', title: 'Funding brief: what to start this winter', kind: 'Funding brief', module: 'grants', reviewerRole: 'admin', status: 'pending', createdAt: daysFromNow(0), body: 'Grant Advisor weekly brief\n\n1. Section 5310 accessible van (through Nia): window December 1 to February 1. Start logging every ride now.\n2. Nonprofit Security Grant: request vulnerability assessments for Creighton and Belt this winter; the window is early July.\n3. Solar at Creighton with IRS elective pay: solar must be in service by December 31, 2027. Get proposals now.\n\nReadiness blockers: SAM.gov registration for the church and for Nia.\n\nOutside the box: announce recurring giving from the pulpit in November and add “Does your employer match?” to the e-bulletin.' },
    { id: 'dr_8', agentId: 'member', title: 'Members with no contact in 90+ days, by life stage', kind: 'List', module: 'members', reviewerRole: 'admin', status: 'pending', createdAt: daysFromNow(0), body: 'Active members have no recorded contact in more than 90 days. Suggested: route each to their Life Stage Pastor for a check-in call this week. The list is in Members under "Needs follow-up".' },
  ]

  const approvals: Approval[] = [
    { id: 'ap_1', kind: 'expense', title: 'Fire on Fridays buffet food (weeks 1–2)', requester: 'Culinary Arts', amount: 3100, status: 'pending', createdAt: daysFromNow(-1), relatedId: 'x_2', relatedModule: 'finance' },
    { id: 'ap_2', kind: 'expense', title: 'The Spirit of Christmas orchestra deposit', requester: 'Music Ministry', amount: 9500, status: 'pending', createdAt: daysFromNow(-2), relatedId: 'x_3', relatedModule: 'finance' },
    { id: 'ap_3', kind: 'expense', title: 'Refiners fellowship lunch', requester: 'Rev. Roscoe Jones', amount: 420, status: 'pending', createdAt: daysFromNow(0), relatedId: 'x_7', relatedModule: 'finance' },
    { id: 'ap_4', kind: 'event', title: 'Volunteer University (winter session)', requester: 'Office & Communications', amount: 2500, status: 'pending', createdAt: daysFromNow(-1), relatedId: 'e_vu', relatedModule: 'events' },
    { id: 'ap_5', kind: 'reservation', title: 'The Commons: civic association meeting', requester: 'External (sample)', amount: 450, status: 'pending', createdAt: daysFromNow(-2), relatedId: 'rs_1', relatedModule: 'facilities' },
    { id: 'ap_6', kind: 'reservation', title: 'Creighton Chapel: wedding', requester: 'Member couple (sample)', status: 'pending', createdAt: daysFromNow(-1), relatedId: 'rs_5', relatedModule: 'facilities' },
    { id: 'ap_7', kind: 'communication', title: 'Fire on Fridays email invitation', requester: 'Office & Communications', status: 'pending', createdAt: daysFromNow(0), relatedId: 'an_2', relatedModule: 'comms' },
    { id: 'ap_8', kind: 'hire', title: 'imagiNATION volunteer (background check pending)', requester: 'imagiNATION', status: 'pending', createdAt: daysFromNow(-4), relatedId: 's_11', relatedModule: 'people' },
  ]

  const tasks: Task[] = [
    { id: 't_1', title: 'Call 9 first-time guests from Sunday (by life stage)', assigneeId: L.office, due: daysFromNow(2), status: 'todo', module: 'members', priority: 'high' },
    { id: 't_2', title: 'Reconcile Sunday Pushpay batch with the bank', assigneeId: L.finance, due: daysFromNow(1), status: 'doing', module: 'finance', priority: 'high' },
    { id: 't_3', title: 'Start SAM.gov registration for the church and Nia', assigneeId: L.exec, due: daysFromNow(7), status: 'todo', module: 'grants', priority: 'high' },
    { id: 't_4', title: 'Get van brake repair scheduled', assigneeId: L.outreach, due: daysFromNow(1), status: 'doing', module: 'facilities', priority: 'high' },
    { id: 't_5', title: 'Renew the van driver’s background check', assigneeId: L.exec, due: daysFromNow(5), status: 'todo', module: 'people', priority: 'high' },
    { id: 't_6', title: 'Request security assessments for Creighton and Belt', assigneeId: L.exec, due: daysFromNow(21), status: 'todo', module: 'grants', priority: 'normal' },
    { id: 't_7', title: 'Confirm Trunk or Treat volunteers at Belt', assigneeId: L.vernita, due: daysFromNow(3), status: 'doing', module: 'events', priority: 'high' },
    { id: 't_8', title: 'Log Friday fresh food counts', assigneeId: L.outreach, due: daysFromNow(3), status: 'todo', module: 'outreach', priority: 'normal' },
    { id: 't_9', title: 'Post Fire on Fridays preorder link in the e-bulletin', assigneeId: L.office, due: daysFromNow(-1), status: 'done', module: 'comms', priority: 'normal' },
  ]

  // Real message titles found on YouTube (@myspbc). Views are not tracked in this demo.
  const sermons: Sermon[] = [
    { id: 'sm_1', title: 'Unlocking the Legacy', speaker: 'Rev. Dr. Lance D. Watson, Sr.', date: '2026-10-11', series: '41st Pastor & People Anniversary', scripture: '', duration: '', description: 'Celebrating 41 years of Pastor & People at both campuses.', views: 0 },
    { id: 'sm_2', title: 'God Isn’t Finished Yet', speaker: 'Rev. Lance Watson, Jr.', date: '2026-04-12', series: 'I Doubt It', scripture: '', duration: '', description: 'From the “I Doubt It” message series.', views: 0 },
    { id: 'sm_3', title: 'Don’t Look Back', speaker: 'Rev. Dr. Lance D. Watson, Sr.', date: '2026-01-11', series: 'Sunday Worship', scripture: '', duration: '', description: 'Feeling stuck? A message on moving forward.', views: 0 },
  ]

  const attendance: Attendance[] = []
  for (let w = 1; w <= 26; w++) {
    const d = new Date(); d.setDate(d.getDate() - (d.getDay() + 7 * w))
    const date = d.toISOString().slice(0, 10)
    attendance.push({ id: `at_c_${w}`, date, service: 'Creighton 9:00 AM', count: between(2300, 2900), firstTime: between(8, 26) })
    attendance.push({ id: `at_b_${w}`, date, service: 'Belt 11:30 AM', count: between(520, 760), firstTime: between(2, 10) })
    attendance.push({ id: `at_o_${w}`, date, service: 'Online (live)', count: between(1800, 3400), firstTime: between(10, 40) })
  }

  const pantry: PantryDay[] = []
  for (let w = 1; w <= 16; w++) {
    const households = between(120, 210)
    const individuals = Math.round(households * (2.3 + rand() * 0.6))
    pantry.push({ id: `pd_${w}`, date: pastWeekday(5, w), day: 'Friday', households, individuals, seniors: Math.round(individuals * (0.22 + rand() * 0.1)), children: Math.round(individuals * (0.28 + rand() * 0.1)), pounds: Math.round(households * (24 + rand() * 8)), volunteers: between(18, 34), newHouseholds: between(4, 18) })
  }
  pantry.sort((a, b) => b.date.localeCompare(a.date))

  const showers: ShowerDay[] = []
  for (let w = 1; w <= 16; w++) {
    const guests = between(14, 32)
    showers.push({ id: `sw_${w}`, date: pastWeekday(3, w), guests, showers: guests - between(0, 3), kits: guests + between(0, 6), volunteers: between(5, 10), note: pick(['Steady morning', 'New guests from Belt Blvd', 'Rain: lower turnout', 'Haircuts offered by a volunteer barber', 'Partner nurse on site']) })
  }
  showers.sort((a, b) => b.date.localeCompare(a.date))

  const audit = [
    { id: 'au_1', at: `${daysFromNow(0)} 07:14`, who: 'Grant Advisor', action: 'Drafted funding brief', target: 'What to start this winter' },
    { id: 'au_2', at: `${daysFromNow(0)} 07:12`, who: 'Facilities Agent', action: 'Opened work order', target: 'Van brakes (urgent)' },
    { id: 'au_3', at: `${daysFromNow(0)} 07:10`, who: 'Finance Agent', action: 'Drafted report', target: 'Weekly giving summary' },
    { id: 'au_4', at: `${daysFromNow(0)} 07:09`, who: 'Member Agent', action: 'Drafted notes', target: '9 first-time guests' },
    { id: 'au_5', at: `${daysFromNow(-1)} 16:40`, who: 'Office & Communications', action: 'Approved announcement', target: 'Trunk or Treat this Saturday' },
    { id: 'au_6', at: `${daysFromNow(-3)} 17:05`, who: 'Outreach Team', action: 'Logged fresh food day', target: 'Friday distribution' },
  ]

  return {
    version: 1,
    entered: false,
    role: 'pastor',
    accountId: 'acc_watson',
    currentMemberId: 'm_1',
    church: {
      name: 'The Saint Paul’s Baptist Church', shortName: 'Saint Paul’s', tagline: 'A church for people on the GROW.',
      pastor: 'Rev. Dr. Lance D. Watson, Sr.', pastorTitle: 'Senior Pastor', address: '4247 Creighton Road', city: 'Henrico, VA 23223', phone: '804.643.4769', email: 'Outreach@myspbc.org',
      services: [{ day: 'Sunday', time: '9:00 AM', label: 'Creighton & Online' }, { day: 'Sunday', time: '11:30 AM', label: 'Belt' }, { day: 'Thursday', time: '11 AM / 7 PM', label: 'THE BRIDGE (online)' }],
      founded: '1909', denomination: 'Baptist', website: 'myspbc.org',
    },
    settings: {
      tourDone: false, agentsEnabled: true, mfa: true, guideOn: true,
      integrations: [
        { id: 'pushpay', name: 'Pushpay (online & recurring giving)', status: 'planned' }, { id: 'rock', name: 'Rock RMS (grow.myspbc.org): people, groups, events, prayer', status: 'planned' }, { id: 'm365', name: 'Microsoft 365 staff sign-in', status: 'planned' },
        { id: 'youtube', name: 'YouTube @myspbc', status: 'connected' }, { id: 'subsplash', name: 'Subsplash (7:14 Prayer calls)', status: 'available' }, { id: 'ccb', name: 'Church Community Builder forms', status: 'available' },
        { id: 'twilio', name: 'Text messaging (7:14 reminders)', status: 'available' }, { id: 'checkr', name: 'Background checks', status: 'available' }, { id: 'sam', name: 'SAM.gov / Grants.gov tracking', status: 'planned' },
      ],
      tenants: [
        { id: 'tn_1', name: 'The Saint Paul’s Baptist Church (Creighton & Belt)', plan: 'ChurchConnect Partner', members: members.length, status: 'Demo' },
        { id: 'tn_2', name: 'Nia CDC of Greater Richmond (501(c)(3))', plan: 'Linked nonprofit workspace', members: 0, status: 'Demo' },
      ],
    },
    members, households, funds, gifts, budgets, expenses, ministries, events: allEvents, registrations, rooms, reservations, maintenance, assets, staff, shifts, care, services,
    announcements, campaigns, documents, meetings, partners, businesses, grants, programs, drafts, approvals, tasks, sermons, attendance, audit,
    opportunities: opportunities.map((o) => ({ ...o })), readiness: readiness.map((r) => ({ ...r })), pantry, showers,
  }
}
