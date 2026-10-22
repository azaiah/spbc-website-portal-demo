export type Role = 'pastor' | 'admin' | 'finance' | 'secretary' | 'ministry' | 'volunteer' | 'member' | 'support'

export type MemberStatus = 'visitor' | 'attendee' | 'member' | 'inactive'
export type Member = {
  id: string; first: string; last: string; email: string; phone: string; householdId: string
  status: MemberStatus; joinedAt: string; firstVisit: string; ministryIds: string[]; tags: string[]
  consent: { email: boolean; sms: boolean }; lastContact: string; careAssigneeId?: string
  address: string; birthday?: string; notes: string; volunteerInterests: string[]
}
export type Household = { id: string; name: string; address: string }

export type FundType = 'general' | 'restricted' | 'designated'
export type Fund = { id: string; name: string; type: FundType; goal?: number; description: string }
export type Gift = { id: string; memberId?: string; donorName?: string; amount: number; fundId: string; method: 'online' | 'card' | 'ach' | 'check' | 'cash' | 'text'; date: string; status: 'recorded' | 'reconciled'; recurring?: boolean }
export type BudgetLine = { id: string; ministryId: string; category: string; planned: number; actual: number }
export type Expense = { id: string; ministryId: string; vendor: string; amount: number; category: string; status: 'requested' | 'approved' | 'paid' | 'rejected'; requestedById: string; date: string; note: string }

export type Ministry = { id: string; name: string; leaderId: string; description: string; annualBudget: number; color: string; meets: string }

export type EventStage = 'proposed' | 'approved' | 'reserved' | 'published' | 'promoted' | 'staffed' | 'completed' | 'reported'
export type ChurchEvent = {
  id: string; title: string; ministryId: string; date: string; start: string; end: string; roomId: string; description: string
  stage: EventStage; budget: number; spent: number; capacity: number; isPublic: boolean; category: 'worship' | 'class' | 'community' | 'youth' | 'conference' | 'meeting' | 'outreach'
  registrationOpen: boolean; attendance?: number; ownerId: string
}
export type Registration = { id: string; eventId: string; memberId?: string; name: string; email: string; qty: number; date: string }

export type Room = { id: string; name: string; capacity: number; kind: 'sanctuary' | 'hall' | 'classroom' | 'kitchen' | 'office' | 'outdoor' | 'vehicle'; rentalRate: number }
export type Reservation = { id: string; roomId: string; eventId?: string; requester: string; date: string; start: string; end: string; status: 'requested' | 'approved' | 'declined'; purpose: string; external: boolean; fee?: number; deposit?: number; paid?: boolean }
export type Maintenance = { id: string; area: string; title: string; priority: 'low' | 'normal' | 'high' | 'urgent'; status: 'open' | 'assigned' | 'scheduled' | 'done'; vendor?: string; reportedBy: string; date: string; cost?: number }
export type Asset = { id: string; name: string; category: string; location: string; serviceDue: string; insuranceRenewal?: string; value: number }

export type Staff = { id: string; name: string; title: string; type: 'employee' | 'part-time' | 'contractor' | 'volunteer'; ministryIds: string[]; bgCheck: 'clear' | 'pending' | 'expired' | 'n/a'; bgCheckDate?: string; trainings: string[]; hoursThisMonth: number; email: string; startDate: string }
export type Shift = { id: string; ministryId: string; date: string; role: string; staffId?: string; status: 'open' | 'filled' | 'confirmed' }

export type CareRequest = { id: string; kind: 'prayer' | 'pastoral' | 'assistance'; memberId?: string; name: string; contact: string; text: string; confidential: boolean; assigneeId?: string; status: 'new' | 'assigned' | 'in-progress' | 'closed'; date: string; updates: { date: string; note: string }[] }
export type ServiceProgram = 'food' | 'housing' | 'employment' | 'transportation' | 'senior' | 'emergency'
export type ServiceRequest = { id: string; program: ServiceProgram; name: string; contact: string; text: string; status: 'new' | 'assigned' | 'in-progress' | 'fulfilled' | 'referred'; coordinatorId?: string; date: string; householdSize?: number; outcome?: string }

export type Announcement = { id: string; title: string; body: string; channels: ('bulletin' | 'website' | 'email' | 'sms')[]; status: 'draft' | 'approved' | 'scheduled' | 'sent'; date: string; audience: string; authorId: string }
export type Campaign = { id: string; name: string; channel: 'email' | 'sms'; segment: string; recipients: number; status: 'draft' | 'approved' | 'sent'; sentAt?: string; opens?: number; clicks?: number }
export type Document = { id: string; title: string; category: 'policy' | 'minutes' | 'form' | 'agreement' | 'letter' | 'report'; updated: string; ownerId: string; size: string }
export type Meeting = { id: string; title: string; date: string; attendees: string[]; agenda: string[]; notes: string; actions: { text: string; ownerId: string; done: boolean }[] }

export type Partner = { id: string; name: string; type: 'employer' | 'sponsor' | 'nonprofit' | 'agency' | 'vendor'; contact: string; status: 'prospect' | 'active' | 'paused'; notes: string }
export type Business = { id: string; name: string; ownerMemberId: string; category: string; phone: string; website: string; approved: boolean }
export type Grant = { id: string; name: string; funder: string; amount: number; deadline: string; status: 'identified' | 'applying' | 'submitted' | 'awarded' | 'declined' | 'reporting'; ownerId: string; opportunityId?: string; entity?: FundingEntity }
export type Program = { id: string; name: string; partnerId?: string; kind: 'workforce' | 'education' | 'youth' | 'financial'; enrolled: number; completed: number; placed?: number; nextCohort: string }

export type AgentId = 'office' | 'finance' | 'member' | 'event' | 'outreach' | 'facilities' | 'grants'
export type AgentDraft = { id: string; agentId: AgentId; title: string; kind: string; body: string; status: 'pending' | 'approved' | 'rejected'; createdAt: string; module: string; reviewerRole: Role }
export type Approval = { id: string; kind: 'expense' | 'event' | 'reservation' | 'communication' | 'document' | 'hire'; title: string; requester: string; amount?: number; status: 'pending' | 'approved' | 'rejected'; createdAt: string; relatedId?: string; relatedModule: string }
export type Task = { id: string; title: string; assigneeId: string; due: string; status: 'todo' | 'doing' | 'done'; module: string; priority: 'low' | 'normal' | 'high' }

/** Funding: which legal entity applies. Church = the congregation; Center = Nia Community Development Corporation of Greater Richmond (501(c)(3), EIN 54-1736110). */
export type FundingEntity = 'church' | 'center' | 'either'
export type OpportunityCategory = 'security' | 'energy' | 'youth' | 'food' | 'violence' | 'recovery' | 'housing' | 'transport' | 'capacity' | 'facility' | 'tax-credit' | 'earned' | 'giving' | 'education'
export type Opportunity = {
  id: string; name: string; funder: string; category: OpportunityCategory
  level: 'federal' | 'state' | 'city' | 'foundation' | 'corporate' | 'creative'
  entity: FundingEntity; amount: string; amountValue: number; window: string; nextDeadline?: string
  status: 'open' | 'upcoming' | 'rolling' | 'recurring' | 'idea'
  fit: number; whyFit: string; requirements: string[]; nextSteps: string[]; programs: string[]
  source?: string; verified: boolean; outsideBox?: boolean; saved?: boolean; dismissed?: boolean
}
export type ReadinessItem = { id: string; label: string; detail: string; entity: FundingEntity; done: boolean; unlocks: string }
/** Community Fresh Food Distribution day (Fridays at Creighton; diaper pop-ups ride along). */
export type PantryDay = { id: string; date: string; day: 'Friday' | 'Wednesday' | 'Saturday'; households: number; individuals: number; seniors: number; children: number; pounds: number; volunteers: number; newHouseholds: number }
/** Dignity on the Go mobile showers (Wednesdays at Belt). */
export type ShowerDay = { id: string; date: string; guests: number; showers: number; kits: number; volunteers: number; note: string }

export type Sermon = { id: string; title: string; speaker: string; date: string; series: string; scripture: string; duration: string; description: string; views: number }
export type Attendance = { id: string; date: string; service: string; count: number; firstTime: number }
export type AuditEntry = { id: string; at: string; who: string; action: string; target: string }

export type Church = {
  name: string; shortName: string; tagline: string; pastor: string; pastorTitle: string; address: string; city: string; phone: string; email: string
  services: { day: string; time: string; label: string }[]; founded: string; denomination: string; website: string
}

export type Settings = {
  tourDone: boolean; agentsEnabled: boolean; mfa: boolean; guideOn: boolean
  integrations: { id: string; name: string; status: 'connected' | 'available' | 'planned' }[]
  tenants: { id: string; name: string; plan: string; members: number; status: string }[]
}

export type DemoState = {
  version: number
  entered: boolean
  role: Role
  /** Demo account currently signed in (see config/accounts.ts) */
  accountId: string
  currentMemberId: string
  church: Church
  settings: Settings
  members: Member[]; households: Household[]
  funds: Fund[]; gifts: Gift[]; budgets: BudgetLine[]; expenses: Expense[]
  ministries: Ministry[]
  events: ChurchEvent[]; registrations: Registration[]
  rooms: Room[]; reservations: Reservation[]; maintenance: Maintenance[]; assets: Asset[]
  staff: Staff[]; shifts: Shift[]
  care: CareRequest[]; services: ServiceRequest[]
  announcements: Announcement[]; campaigns: Campaign[]; documents: Document[]; meetings: Meeting[]
  partners: Partner[]; businesses: Business[]; grants: Grant[]; programs: Program[]
  drafts: AgentDraft[]; approvals: Approval[]; tasks: Task[]
  sermons: Sermon[]; attendance: Attendance[]; audit: AuditEntry[]
  opportunities: Opportunity[]; readiness: ReadinessItem[]; pantry: PantryDay[]; showers: ShowerDay[]
}
