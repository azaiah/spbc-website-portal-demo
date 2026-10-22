import { Link } from 'react-router-dom'
import { Users, Landmark, Inbox, CalendarDays, TrendingUp, UserPlus, Bot, Wrench, HandHeart, AlertTriangle, ArrowRight } from 'lucide-react'
import { useDemo } from '@/data/store'
import { activeMembers, visitors, newVisitorsNoContact, giftsInMonth, sum, monthlyGiving, pendingApprovals, pendingDrafts, upcomingEvents, openMaintenance, openShifts, openCare, openServices, needsFollowUp, can, roleLabel } from '@/data/selectors'
import { money, monthLabel, fmtShort, fmtTime } from '@/data/dates'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { BarChart, Sparkline } from '@/components/charts/BarChart'
import { Badge } from '@/components/Badge'
import { PageHeader, Kpi, Panel, Progress } from '../layout/shared'
import { roleMeta } from '../nav'

export function Dashboard() {
  const { state } = useDemo()
  useDocumentMeta('Executive Dashboard | Saint Paul’s Everywhere')
  const r = state.role
  const thisMonth = sum(giftsInMonth(state).map((g) => g.amount))
  const trend = monthlyGiving(state, 6)
  const lastMonth = trend[trend.length - 2]?.total ?? 0
  const delta = lastMonth ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : 0
  const attendance = [...state.attendance].sort((a, b) => a.date.localeCompare(b.date)).filter((a) => a.service === '9:45 AM').map((a) => a.count)
  const avgAtt = Math.round(sum(attendance.slice(-4)) / 4)
  const approvals = pendingApprovals(state)
  const drafts = pendingDrafts(state)
  const events = upcomingEvents(state).slice(0, 5)
  const reconcile = state.gifts.filter((g) => g.status === 'recorded').length
  const ministriesOverBudget = state.ministries.map((m) => ({ m, lines: state.budgets.filter((b) => b.ministryId === m.id) })).map((x) => ({ m: x.m, planned: sum(x.lines.map((l) => l.planned)), actual: sum(x.lines.map((l) => l.actual)) })).sort((a, b) => b.actual / b.planned - a.actual / a.planned)
  const attention = [
    { icon: UserPlus, t: `${newVisitorsNoContact(state).length} first-time visitors with no follow-up`, to: '/admin/members?filter=visitor', tone: 'gold' as const },
    { icon: Inbox, t: `${approvals.length} approvals waiting`, to: '/admin/action-center', tone: 'royal' as const },
    { icon: Bot, t: `${drafts.length} agent drafts ready for review`, to: '/admin/agents', tone: 'success' as const },
    { icon: Wrench, t: `${openMaintenance(state).filter((m) => m.priority === 'urgent' || m.priority === 'high').length} urgent or high-priority maintenance items`, to: '/admin/facilities?tab=maintenance', tone: 'danger' as const },
    { icon: HandHeart, t: `${openCare(state).length} open care requests, ${openServices(state).length} open community requests`, to: '/admin/members?tab=care', tone: 'warning' as const },
    { icon: AlertTriangle, t: `${state.staff.filter((s) => s.bgCheck === 'expired' || s.bgCheck === 'pending').length} background checks pending or expired`, to: '/admin/people?tab=compliance', tone: 'neutral' as const },
  ]
  const greeting = r === 'pastor' ? "Pastor's Executive Dashboard" : `${roleMeta[r].label} dashboard`

  return (
    <>
      <PageHeader eyebrow={`${state.church.name} · ${roleLabel[r]} view`} title={greeting} text="Church-wide activity and operational priorities on one screen, without asking every department for a report." />
      <div data-tour="dash-numbers" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Active members" value={activeMembers(state).length.toLocaleString()} sub={`${visitors(state).length} visitors in pipeline`} icon={Users} tone="midnight" to="/admin/members" />
        {can.seeGivingSummary(r) ? <Kpi label="Contributions this month" value={money(thisMonth)} sub={<span className={delta >= 0 ? 'text-success' : 'text-danger'}>{delta >= 0 ? '+' : ''}{delta}% vs last month</span>} icon={Landmark} to="/admin/finance" /> : <Kpi label="Avg Sunday attendance" value={avgAtt} sub="Last 4 Sundays" icon={TrendingUp} />}
        <Kpi label="Open requests" value={approvals.length + drafts.length} sub={`${approvals.length} approvals · ${drafts.length} drafts`} icon={Inbox} to="/admin/action-center" />
        <Kpi label="Upcoming events" value={upcomingEvents(state).length} sub={`${upcomingEvents(state).filter((e) => e.date <= new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10)).length} this week`} icon={CalendarDays} to="/admin/events" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel tour="dash-attention" title="What needs my attention" subtitle="Operational exceptions across all modules" className="lg:col-span-1">
          <ul className="divide-y divide-line">
            {attention.map((a) => <li key={a.t}><Link to={a.to} className="flex items-center gap-3 py-2.5 text-sm hover:text-royal"><a.icon size={16} className="text-gold shrink-0" /><span className="flex-1">{a.t}</span><ArrowRight size={14} className="text-slate" /></Link></li>)}
          </ul>
        </Panel>
        {can.seeGivingSummary(r) ? (
          <Panel title="Giving trend" subtitle="All funds, last 6 months" to="/admin/finance">
            <BarChart data={trend.map((t) => ({ label: monthLabel(t.key), value: t.total }))} format={(n) => money(n)} height={140} />
            <div className="mt-3 flex items-center justify-between text-xs text-slate"><span>{reconcile} gifts awaiting reconciliation</span><Progress value={state.gifts.length - reconcile} max={state.gifts.length} className="w-24" color="bg-success" /></div>
          </Panel>
        ) : (
          <Panel title="Attendance" subtitle="9:45 AM worship, last 26 Sundays" to="/admin/reports">
            <Sparkline values={attendance} width={320} height={120} color="#4B2A7B" />
            <p className="text-sm mt-2">Average {avgAtt} &middot; High {Math.max(...attendance)} &middot; Low {Math.min(...attendance)}</p>
          </Panel>
        )}
        <Panel title="Are we growing?" subtitle="Visitors, new members, participation" to="/admin/reports">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-linen p-3"><dt className="text-xs text-slate">First-time visitors (30d)</dt><dd className="font-display text-2xl font-semibold">{visitors(state).length}</dd></div>
            <div className="rounded-lg bg-linen p-3"><dt className="text-xs text-slate">Avg Sunday attendance</dt><dd className="font-display text-2xl font-semibold">{avgAtt}</dd></div>
            <div className="rounded-lg bg-linen p-3"><dt className="text-xs text-slate">In a ministry</dt><dd className="font-display text-2xl font-semibold">{Math.round((activeMembers(state).filter((m) => m.ministryIds.length).length / activeMembers(state).length) * 100)}%</dd></div>
            <div className="rounded-lg bg-linen p-3"><dt className="text-xs text-slate">Needs follow-up (90d)</dt><dd className="font-display text-2xl font-semibold">{needsFollowUp(state).length}</dd></div>
          </dl>
          <div className="mt-3"><Sparkline values={attendance} width={300} height={36} /></div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Action Center" subtitle="Pending approvals routed to your role" to="/admin/action-center">
          <ul className="divide-y divide-line">
            {approvals.slice(0, 5).map((a) => <li key={a.id} className="py-2.5 flex items-center justify-between gap-3 text-sm"><span className="min-w-0"><span className="block font-medium truncate">{a.title}</span><span className="block text-xs text-slate">{a.requester}{a.amount ? ` · ${money(a.amount)}` : ''}</span></span><Badge tone="gold" className="capitalize">{a.kind}</Badge></li>)}
          </ul>
        </Panel>
        <Panel title="Which ministries need support?" subtitle="Month budget used, highest first" to="/admin/ministries">
          <ul className="space-y-2.5">
            {ministriesOverBudget.slice(0, 5).map((x) => <li key={x.m.id} className="text-sm"><div className="flex justify-between"><span className="font-medium">{x.m.name}</span><span className="font-mono text-xs">{money(x.actual)} / {money(x.planned)}</span></div><Progress value={x.actual} max={x.planned} className="mt-1" color={x.actual > x.planned ? 'bg-danger' : 'bg-royal'} /></li>)}
          </ul>
        </Panel>
        <Panel title="Coming up" subtitle="Next five events" to="/admin/events">
          <ul className="divide-y divide-line">
            {events.map((e) => <li key={e.id} className="py-2.5 flex items-center gap-3 text-sm"><span className="h-9 w-9 rounded-lg bg-midnight text-white flex flex-col items-center justify-center shrink-0"><span className="font-mono text-[13px] uppercase">{fmtShort(e.date).split(' ')[0]}</span><span className="font-semibold text-sm leading-none">{e.date.slice(8, 10)}</span></span><span className="min-w-0 flex-1"><span className="block font-medium truncate">{e.title}</span><span className="block text-xs text-slate">{fmtTime(e.start)} · {state.rooms.find((x) => x.id === e.roomId)?.name}</span></span><Badge className="capitalize">{e.stage}</Badge></li>)}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Panel title="What impact are we making?" subtitle="Community services, outcomes, volunteer hours" to="/admin/community">
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="rounded-lg bg-linen p-3"><dt className="text-xs text-slate">Service requests (30d)</dt><dd className="font-display text-2xl font-semibold">{state.services.length}</dd></div>
            <div className="rounded-lg bg-linen p-3"><dt className="text-xs text-slate">Fulfilled or referred</dt><dd className="font-display text-2xl font-semibold">{state.services.filter((s) => s.status === 'fulfilled' || s.status === 'referred').length}</dd></div>
            <div className="rounded-lg bg-linen p-3"><dt className="text-xs text-slate">Volunteer hours (month)</dt><dd className="font-display text-2xl font-semibold">{sum(state.staff.filter((s) => s.type === 'volunteer').map((s) => s.hoursThisMonth))}</dd></div>
            <div className="rounded-lg bg-linen p-3"><dt className="text-xs text-slate">Open volunteer shifts</dt><dd className="font-display text-2xl font-semibold">{openShifts(state).length}</dd></div>
          </dl>
        </Panel>
        <Panel title="Monday Morning Package" subtitle={state.settings.agentsEnabled ? `${drafts.length} items prepared by the AI agent workforce` : 'AI agents are paused in Settings'} to="/admin/agents">
          <ul className="space-y-1.5 text-sm">
            {drafts.slice(0, 5).map((d) => <li key={d.id} className="flex items-center justify-between gap-2 rounded-lg bg-linen px-3 py-2"><span className="truncate">{d.title}</span><span className="font-mono text-[13px] uppercase tracking-wider text-success shrink-0">Ready</span></li>)}
          </ul>
        </Panel>
      </div>
    </>
  )
}
