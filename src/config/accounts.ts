import type { Role } from '@/data/types'

/**
 * Demo sign-in accounts for Saint Paul's Everywhere.
 * Leaders are the people The Saint Paul's Baptist Church lists publicly (myspbc.org), with the titles the church uses.
 * No personal data about them is invented beyond their public role: no giving history, no care notes.
 * Emails are demo addresses on a non-routable domain. Office roles and the member are clearly labeled samples.
 * Member ids: m_1 Dr. Watson · m_2 First Lady · m_3..m_10 Life Stage Pastors (in life-stage order) · m_11..m_14 sample office accounts.
 */
export type DemoAccount = {
  id: string
  memberId: string
  name: string
  title: string
  role: Role
  /** Ministries this person leads or serves in; scopes Ministry Leader and Volunteer views. */
  ministryIds: string[]
  email: string
  /** Where this account lands after sign-in. */
  home: string
  group: 'Pastoral leadership' | 'Church administration' | 'Life Stage Pastors' | 'Ministry leaders' | 'Volunteers' | 'Members' | 'Support'
  sample?: boolean
  blurb: string
}

export const demoAccounts: DemoAccount[] = [
  { id: 'acc_watson', memberId: 'm_1', name: 'Rev. Dr. Lance D. Watson, Sr.', title: 'Senior Pastor', role: 'pastor', ministryIds: [], email: 'senior.pastor@spbc.example', home: '/admin', group: 'Pastoral leadership', blurb: 'Both campuses at a glance: people, giving health, approvals and the City of Possibility.' },
  { id: 'acc_admin', memberId: 'm_14', name: 'Executive Office', title: 'Executive Administrator (sample account)', role: 'admin', ministryIds: [], email: 'executive.office@spbc.example', home: '/admin/action-center', group: 'Church administration', sample: true, blurb: 'Operations across Creighton and Belt, approvals, facilities, staff and grant readiness.' },
  { id: 'acc_finance', memberId: 'm_11', name: 'Finance Office', title: 'Finance (sample account)', role: 'finance', ministryIds: [], email: 'finance@spbc.example', home: '/admin/finance', group: 'Church administration', sample: true, blurb: 'Pushpay giving, reconciliation, budgets, expenses and statements.' },
  { id: 'acc_office', memberId: 'm_12', name: 'Office & Communications', title: 'Communications (sample account)', role: 'secretary', ministryIds: [], email: 'communications@spbc.example', home: '/admin/office', group: 'Church administration', sample: true, blurb: 'E-bulletin, GPS guides, announcements, the events calendar and incoming requests.' },
  { id: 'acc_vernita', memberId: 'm_3', name: 'Min. Vernita Williams', title: 'Life Stage Pastor · imagiNATION', role: 'ministry', ministryIds: ['min_imagination'], email: 'imagination@spbc.example', home: '/admin/ministries', group: 'Life Stage Pastors', blurb: 'Children’s Bible study at both campuses, volunteers, Trunk or Treat.' },
  { id: 'acc_martina', memberId: 'm_4', name: 'Min. Martina Jones', title: 'Life Stage Pastor · SMB', role: 'ministry', ministryIds: ['min_smb'], email: 'smb@spbc.example', home: '/admin/ministries', group: 'Life Stage Pastors', blurb: 'Students 11 to 19, mentoring programs and youth events.' },
  { id: 'acc_juan', memberId: 'm_5', name: 'Rev. Juan Shackelford', title: 'Life Stage Pastor · Dreamchasers', role: 'ministry', ministryIds: ['min_dreamchasers'], email: 'dreamchasers@spbc.example', home: '/admin/ministries', group: 'Life Stage Pastors', blurb: 'Young adults 20 to 29, online Bible study and Freeform Fridays.' },
  { id: 'acc_lancejr', memberId: 'm_6', name: 'Rev. Lance Watson, Jr.', title: 'Life Stage Pastor · ASPIRE', role: 'ministry', ministryIds: ['min_aspire'], email: 'aspire@spbc.example', home: '/admin/ministries', group: 'Life Stage Pastors', blurb: 'Adults 30 to 39: groups, events and care follow-up.' },
  { id: 'acc_michelle', memberId: 'm_7', name: 'Rev. Michelle Townsend', title: 'Life Stage Pastor · Fusion', role: 'ministry', ministryIds: ['min_fusion'], email: 'fusion@spbc.example', home: '/admin/ministries', group: 'Life Stage Pastors', blurb: 'Adults 40 to 49 and the Tuesday Bible study at Creighton.' },
  { id: 'acc_lisa', memberId: 'm_8', name: 'Dr. Lisa Johnson', title: 'Life Stage Pastor · Encore', role: 'ministry', ministryIds: ['min_encore'], email: 'encore@spbc.example', home: '/admin/ministries', group: 'Life Stage Pastors', blurb: 'Adults 50 to 59 and the Wednesday Bible study at Creighton.' },
  { id: 'acc_maceo', memberId: 'm_9', name: 'Dr. Maceo Freeman, Jr.', title: 'Life Stage Pastor · Prime Time', role: 'ministry', ministryIds: ['min_primetime'], email: 'primetime@spbc.example', home: '/admin/ministries', group: 'Life Stage Pastors', blurb: 'Adults 60 to 69 and the Wednesday online Bible study.' },
  { id: 'acc_roscoe', memberId: 'm_10', name: 'Rev. Roscoe Jones', title: 'Life Stage Pastor · Refiners', role: 'ministry', ministryIds: ['min_refiners', 'min_transport'], email: 'refiners@spbc.example', home: '/admin/ministries', group: 'Life Stage Pastors', blurb: 'Our 70+ saints, daytime Bible studies at both campuses and rides.' },
  { id: 'acc_outreach', memberId: 'm_13', name: 'Outreach Team', title: 'Outreach coordinator (sample account)', role: 'ministry', ministryIds: ['min_outreach', 'min_transport'], email: 'outreach@spbc.example', home: '/admin/outreach', group: 'Ministry leaders', sample: true, blurb: 'Fresh food Fridays, Dignity on the Go showers, rides and help requests.' },
  { id: 'acc_member', memberId: 'm_20', name: 'Angela Brooks', title: 'Member (sample person)', role: 'member', ministryIds: [], email: 'angela.brooks@example.com', home: '/portal', group: 'Members', sample: true, blurb: 'Saint Paul’s Everywhere: your life stage, events, giving, groups and prayer requests.' },
  { id: 'acc_member_young', memberId: 'm_21', name: 'Marcus Hill', title: 'Member, young parent (sample person)', role: 'member', ministryIds: [], email: 'marcus.hill@example.com', home: '/portal', group: 'Members', sample: true, blurb: 'ASPIRE (30s) at the Belt Campus with kids in imagiNATION.' },
  { id: 'acc_member_senior', memberId: 'm_22', name: 'Dorothy Green', title: 'Member since 1987 (sample person)', role: 'member', ministryIds: [], email: 'dorothy.green@example.com', home: '/portal', group: 'Members', sample: true, blurb: 'Refiners (70+) at Creighton, uses church rides and the prayer line.' },
  { id: 'acc_support', memberId: 'm_11', name: 'DataIsData Support', title: 'Platform support (limited)', role: 'support', ministryIds: [], email: 'support@dataisdata.example', home: '/admin/settings', group: 'Support', blurb: 'Technical settings only, under an authorized support arrangement.' },
]

export const accountById = (id?: string) => demoAccounts.find((a) => a.id === id)
export const defaultAccountForRole = (role: Role) => demoAccounts.find((a) => a.role === role) ?? demoAccounts[0]
