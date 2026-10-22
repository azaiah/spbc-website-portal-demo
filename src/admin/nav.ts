import { LayoutDashboard, Inbox, Users, Landmark, Building2, Church, Bot, Warehouse, HeartHandshake, CalendarDays, HandHeart, Megaphone, Handshake, BarChart3, Settings, HelpCircle, ShoppingBasket, Compass, type LucideIcon } from 'lucide-react'
import type { Role } from '@/data/types'

export type NavItem = { to: string; label: string; icon: LucideIcon; group: 'main' | 'people' | 'ops' | 'growth' | 'more'; roles: Role[] | 'all' }
const staff: Role[] = ['pastor', 'admin', 'finance', 'secretary', 'support']

export const navItems: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, group: 'main', roles: 'all' },
  { to: '/admin/action-center', label: 'Action Center', icon: Inbox, group: 'main', roles: [...staff, 'ministry'] },
  { to: '/admin/members', label: 'Members', icon: Users, group: 'people', roles: [...staff, 'ministry'] },
  { to: '/admin/finance', label: 'Finance', icon: Landmark, group: 'people', roles: ['pastor', 'admin', 'finance', 'support'] },
  { to: '/admin/office', label: 'Office', icon: Building2, group: 'people', roles: staff },
  { to: '/admin/ministries', label: 'Life Stages & Ministries', icon: Church, group: 'people', roles: [...staff, 'ministry', 'volunteer'] },
  { to: '/admin/agents', label: 'AI Agents', icon: Bot, group: 'ops', roles: staff },
  { to: '/admin/events', label: 'Events', icon: CalendarDays, group: 'ops', roles: [...staff, 'ministry', 'volunteer'] },
  { to: '/admin/facilities', label: 'Facilities', icon: Warehouse, group: 'ops', roles: [...staff, 'ministry'] },
  { to: '/admin/people', label: 'People & Volunteers', icon: HeartHandshake, group: 'ops', roles: [...staff, 'ministry', 'volunteer'] },
  { to: '/admin/outreach', label: 'Outreach', icon: ShoppingBasket, group: 'growth', roles: [...staff, 'ministry'] },
  { to: '/admin/grants', label: 'Grant Advisor', icon: Compass, group: 'growth', roles: ['pastor', 'admin', 'finance', 'support'] },
  { to: '/admin/community', label: 'Community', icon: HandHeart, group: 'growth', roles: [...staff, 'ministry'] },
  { to: '/admin/communications', label: 'Communications', icon: Megaphone, group: 'growth', roles: staff },
  { to: '/admin/partners', label: 'Partnerships', icon: Handshake, group: 'growth', roles: ['pastor', 'admin', 'support'] },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3, group: 'growth', roles: ['pastor', 'admin', 'finance', 'support'] },
  { to: '/admin/settings', label: 'Settings', icon: Settings, group: 'more', roles: ['admin', 'support', 'pastor'] },
  { to: '/admin/help', label: 'Help', icon: HelpCircle, group: 'more', roles: 'all' },
]

export function navForRole(r: Role) { return navItems.filter((n) => n.roles === 'all' || n.roles.includes(r)) }
export const groupLabels: Record<NavItem['group'], string> = { main: '', people: 'Church business', ops: 'Operations', growth: 'Community and growth', more: 'More' }

export const roleMeta: Record<Role, { label: string; description: string; home: string }> = {
  pastor: { label: 'Pastor', description: 'Executive summaries, approved leadership reports, ministry oversight', home: '/admin' },
  admin: { label: 'Executive Administrator', description: 'Operations across both campuses, staff workflows, facilities, approvals, grant readiness', home: '/admin/action-center' },
  finance: { label: 'Finance Office', description: 'Giving records, accounting, budgets, expenses', home: '/admin/finance' },
  secretary: { label: 'Office & Communications', description: 'Scheduling, member communications, office requests', home: '/admin/office' },
  ministry: { label: 'Ministry Leader', description: 'Assigned ministry records, volunteers, events, outreach days', home: '/admin/ministries' },
  volunteer: { label: 'Volunteer', description: 'Assigned schedules, tasks, limited contact information', home: '/admin/people' },
  member: { label: 'Member', description: 'Own profile, giving history, registrations (opens the member portal)', home: '/portal' },
  support: { label: 'DataIsData Support', description: 'Limited technical access under an authorized support arrangement', home: '/admin/settings' },
}
export const demoRoles: Role[] = ['pastor', 'admin', 'finance', 'secretary', 'ministry', 'volunteer', 'support']
