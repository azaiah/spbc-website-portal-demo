import type { DemoState, Member, Role } from './types'
import { daysUntil, monthKey, todayIso } from './dates'

export const fullName = (m?: Member) => (m ? `${m.first} ${m.last}` : 'Unknown')
export const memberById = (s: DemoState, id?: string) => s.members.find((m) => m.id === id)
export const ministryById = (s: DemoState, id?: string) => s.ministries.find((m) => m.id === id)
export const roomById = (s: DemoState, id?: string) => s.rooms.find((r) => r.id === id)
export const fundById = (s: DemoState, id?: string) => s.funds.find((f) => f.id === id)
export const staffById = (s: DemoState, id?: string) => s.staff.find((x) => x.id === id)
export const personName = (s: DemoState, id?: string) => memberById(s, id) ? fullName(memberById(s, id)) : staffById(s, id)?.name ?? 'Unassigned'

export function giftsInMonth(s: DemoState, key = monthKey(todayIso())) { return s.gifts.filter((g) => monthKey(g.date) === key) }
export const sum = (ns: number[]) => ns.reduce((a, b) => a + b, 0)

export function monthlyGiving(s: DemoState, months = 6) {
  const out: { key: string; total: number }[] = []
  const d = new Date()
  for (let i = months - 1; i >= 0; i--) {
    const dt = new Date(d.getFullYear(), d.getMonth() - i, 1)
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
    out.push({ key, total: sum(giftsInMonth(s, key).map((g) => g.amount)) })
  }
  return out
}

export function givingByFund(s: DemoState, days = 30) {
  const since = new Date(); since.setDate(since.getDate() - days)
  const sinceIso = since.toISOString().slice(0, 10)
  return s.funds.map((f) => ({ fund: f, total: sum(s.gifts.filter((g) => g.fundId === f.id && g.date >= sinceIso).map((g) => g.amount)) }))
}

export const activeMembers = (s: DemoState) => s.members.filter((m) => m.status === 'member' || m.status === 'attendee')
export const visitors = (s: DemoState) => s.members.filter((m) => m.status === 'visitor')
export const needsFollowUp = (s: DemoState) => s.members.filter((m) => (m.status === 'member' || m.status === 'attendee') && (!m.lastContact || daysUntil(m.lastContact) < -90))
export const newVisitorsNoContact = (s: DemoState) => visitors(s).filter((m) => !m.lastContact)

export const upcomingEvents = (s: DemoState, publicOnly = false) => s.events.filter((e) => e.date >= todayIso() && (!publicOnly || e.isPublic)).sort((a, b) => a.date.localeCompare(b.date))
export const registrationsFor = (s: DemoState, eventId: string) => s.registrations.filter((r) => r.eventId === eventId)
export const pendingApprovals = (s: DemoState) => s.approvals.filter((a) => a.status === 'pending')
export const pendingDrafts = (s: DemoState) => s.drafts.filter((d) => d.status === 'pending')
export const openTasks = (s: DemoState) => s.tasks.filter((t) => t.status !== 'done')
export const openMaintenance = (s: DemoState) => s.maintenance.filter((m) => m.status !== 'done')
export const openShifts = (s: DemoState) => s.shifts.filter((x) => x.status === 'open')
export const openCare = (s: DemoState) => s.care.filter((c) => c.status !== 'closed')
export const openServices = (s: DemoState) => s.services.filter((c) => c.status !== 'fulfilled' && c.status !== 'referred')

export const roleLabel: Record<Role, string> = { pastor: 'Senior Pastor', admin: 'Executive Administrator', finance: 'Finance Office', secretary: 'Office & Communications', ministry: 'Life Stage Pastor / Ministry Leader', volunteer: 'Volunteer', member: 'Member', support: 'DataIsData Support' }

/** Which roles may see giving detail, confidential care, etc. */
export const can = {
  seeGivingDetail: (r: Role) => r === 'finance' || r === 'admin' || r === 'support',
  seeGivingSummary: (r: Role) => r === 'pastor' || r === 'finance' || r === 'admin' || r === 'support',
  seeConfidentialCare: (r: Role) => r === 'pastor' || r === 'admin',
  approveFinance: (r: Role) => r === 'finance' || r === 'admin' || r === 'pastor',
  approveOps: (r: Role) => r === 'admin' || r === 'pastor',
  approveComms: (r: Role) => r === 'secretary' || r === 'admin' || r === 'pastor',
  manageSettings: (r: Role) => r === 'admin' || r === 'support',
}
