import { useState } from 'react'
import { Bot, Check, X, Pause, Play, ShieldCheck, Sparkles, FileText } from 'lucide-react'
import { useDemo } from '@/data/store'
import { pendingDrafts, giftsInMonth, sum, newVisitorsNoContact, upcomingEvents, openShifts, openMaintenance, can } from '@/data/selectors'
import { money, relDays, todayIso } from '@/data/dates'
import type { AgentDraft } from '@/data/types'
import { uid } from '@/data/ids'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Toggle } from '@/components/Field'
import { Drawer } from '@/components/Drawer'
import { PageHeader, Kpi, Panel } from '../layout/shared'
import { agents } from '@/config/platform'
import { useActions } from '../actions'

export function Agents() {
  const { state, set, upsert, log } = useDemo()
  useDocumentMeta('AI Agents | Saint Paul’s Everywhere')
  const { decideDraft, who } = useActions()
  const drafts = pendingDrafts(state)
  const [view, setView] = useState<AgentDraft | null>(null)
  const [body, setBody] = useState('')
  const enabled = state.settings.agentsEnabled
  const r = state.role
  const lastSunday = state.attendance.slice(0, 2)

  const monday = [
    { t: 'Giving and attendance summary', d: `${money(sum(giftsInMonth(state).map((g) => g.amount)))} this month · ${lastSunday.map((a) => `${a.service}: ${a.count}`).join(', ')} last Sunday`, ready: true },
    { t: 'New visitor follow-up assignments', d: `${newVisitorsNoContact(state).length} first-time visitors assigned to the welcome team`, ready: true },
    { t: 'Upcoming ministry events', d: `${upcomingEvents(state).length} events on the calendar, ${upcomingEvents(state).filter((e) => e.stage === 'proposed').length} awaiting approval`, ready: true },
    { t: 'Outstanding volunteer needs', d: `${openShifts(state).length} open shifts across ministries`, ready: true },
    { t: 'Unresolved maintenance requests', d: `${openMaintenance(state).length} open, ${openMaintenance(state).filter((m) => m.priority === 'urgent').length} urgent`, ready: true },
    { t: 'Draft weekly newsletter', d: drafts.some((d) => d.agentId === 'outreach') ? 'Draft ready for Office & Communications' : 'Approved and sent', ready: drafts.some((d) => d.agentId === 'outreach') },
  ]

  function runAgents() {
    const fresh: AgentDraft[] = [
      { id: uid('dr'), agentId: 'office', title: 'Life Stage Pastors huddle summary', kind: 'Report', module: 'office', reviewerRole: 'secretary', status: 'pending', createdAt: todayIso(), body: 'Summary of agenda items and proposed action items for leadership review (sample).\n\n1. Guests from Sunday: route each first-time guest to their Life Stage Pastor for a call this week.\n2. 117th Church Anniversary: confirm greeters and ushers by life stage at both campuses.\n3. Fresh food Fridays: volunteer coverage is thin in December; ask Men\'s Ministry and Encore to help.\n4. Background checks: 1 expired (van driver), 1 pending (imagiNATION volunteer); renewals requested.' },
      { id: uid('dr'), agentId: 'grants', title: 'Grant Advisor: new matches this week', kind: 'Funding brief', module: 'grants', reviewerRole: 'admin', status: 'pending', createdAt: todayIso(), body: (() => { const top = [...state.opportunities].filter((o) => !o.dismissed && (!o.nextDeadline || o.nextDeadline >= todayIso())).sort((a, b) => b.fit - a.fit).slice(0, 3); const open = state.readiness.filter((x) => !x.done); return `Top matches by fit score:\n${top.map((o, i) => `${i + 1}. ${o.name} (${o.funder}). Fit ${o.fit}. ${o.nextDeadline ? `Next deadline ${o.nextDeadline}.` : o.window + '.'} Next: ${o.nextSteps[0] ?? 'Review requirements.'}`).join('\n')}\n\nReadiness: ${open.length} items still open. First priority: ${open[0]?.label ?? 'none'}.\n\nOpen the Grant Advisor for the full list, funding stacks and a draft letter of inquiry.` })() },
      { id: uid('dr'), agentId: 'member', title: 'Members approaching 1-year anniversary', kind: 'List', module: 'members', reviewerRole: 'admin', status: 'pending', createdAt: todayIso(), body: `${state.members.filter((m) => m.tags.includes('New this year')).length} members joined this year. Suggested: anniversary note from the pastor and an invitation to serve.` },
      { id: uid('dr'), agentId: 'finance', title: 'Budget variance flags', kind: 'Report', module: 'finance', reviewerRole: 'finance', status: 'pending', createdAt: todayIso(), body: state.budgets.filter((b) => b.actual > b.planned).map((b) => `${state.ministries.find((m) => m.id === b.ministryId)?.name} · ${b.category}: ${money(b.actual)} vs ${money(b.planned)} planned`).join('\n') || 'No lines over budget this month.' },
    ]
    fresh.forEach((d) => upsert('drafts', d))
    log('AI agent workforce', 'Prepared drafts', `${fresh.length} new items`)
  }

  return (
    <>
      <PageHeader eyebrow="Module 5" title="AI Agent Workforce" text="Seven agents, including the Grant Advisor, handle structured administrative work and hand every consequential action to a person. Nothing is sent, paid or published without approval." actions={<><Button variant="outline" icon={enabled ? <Pause size={16} /> : <Play size={16} />} onClick={() => { set('settings', { ...state.settings, agentsEnabled: !enabled }); log(who, enabled ? 'Paused agents' : 'Resumed agents', 'All') }} disabled={!can.manageSettings(r) && r !== 'pastor'}>{enabled ? 'Pause agents' : 'Resume agents'}</Button><Button icon={<Sparkles size={16} />} onClick={runAgents} disabled={!enabled}>Run Monday package now</Button></>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Kpi label="Drafts awaiting review" value={drafts.length} icon={Bot} tone="midnight" />
        <Kpi label="Approved this month" value={state.drafts.filter((d) => d.status === 'approved').length} sub={`${state.drafts.filter((d) => d.status === 'rejected').length} rejected`} icon={Check} />
        <Kpi label="Agents active" value={enabled ? 6 : 0} sub={enabled ? 'Human review required' : 'Paused by leadership'} icon={ShieldCheck} />
        <Kpi label="Est. hours prepared this week" value={Math.round(state.drafts.length * 1.4)} sub="Based on draft count × avg task time" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <Panel title="Monday Morning Package" subtitle={`Assembled after Sunday's services · ${todayIso()}`}>
          <ol className="grid gap-2">
            {monday.map((m, i) => <li key={m.t} className="flex items-start gap-3 rounded-xl border border-line bg-linen px-3 py-2.5"><span className="font-mono text-xs text-gold w-6 pt-0.5">{String(i + 1).padStart(2, '0')}</span><FileText size={16} className="text-slate mt-0.5 shrink-0" /><span className="flex-1 min-w-0"><span className="block text-sm font-medium">{m.t}</span><span className="block text-xs text-slate">{m.d}</span></span><span className={`font-mono text-[13px] uppercase tracking-wider shrink-0 ${m.ready ? 'text-success' : 'text-slate'}`}>{m.ready ? 'Ready' : 'Done'}</span></li>)}
          </ol>
          <p className="text-xs text-slate mt-3">An authorized administrator reviews and approves communications, financial changes and other consequential actions before anything executes.</p>
        </Panel>
        <Panel title="Drafts for review" subtitle={`${drafts.length} waiting`} to="/admin/action-center?tab=drafts">
          <ul className="divide-y divide-line">
            {drafts.map((d) => <li key={d.id} className="py-2.5 flex items-center gap-3 text-sm"><Bot size={16} className="text-gold shrink-0" /><span className="flex-1 min-w-0"><span className="block font-medium truncate">{d.title}</span><span className="block text-xs text-slate">{agents.find((a) => a.id === d.agentId)?.name} · {d.kind} · {relDays(d.createdAt)}</span></span><Button size="sm" variant="outline" onClick={() => { setView(d); setBody(d.body) }}>Review</Button></li>)}
            {drafts.length === 0 && <li className="py-6 text-sm text-slate text-center">All drafts reviewed. Run the Monday package to generate new ones.</li>}
          </ul>
        </Panel>
      </div>

      <h2 className="font-semibold mt-8 mb-3">The digital workforce</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((a) => {
          const mine = state.drafts.filter((d) => d.agentId === a.id)
          return (
            <article key={a.id} className="card p-4 flex flex-col">
              <div className="flex items-center gap-3"><div className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ${enabled ? 'bg-gold-50 text-gold' : 'bg-linen text-slate'}`}><Bot size={20} /></div><div><h3 className="font-semibold">{a.name}</h3><p className="text-xs text-slate">{a.scope}</p></div><Badge tone={enabled ? 'success' : 'neutral'} className="ml-auto">{enabled ? 'Active' : 'Paused'}</Badge></div>
              <ul className="mt-3 text-sm space-y-1 flex-1">{a.does.map((d) => <li key={d} className="flex gap-2 text-slate"><span className="text-gold">&#8226;</span> {d}</li>)}</ul>
              <div className="mt-3 pt-3 border-t border-line flex items-center justify-between text-xs text-slate"><span>{mine.filter((d) => d.status === 'pending').length} pending · {mine.filter((d) => d.status === 'approved').length} approved</span><span className="inline-flex items-center gap-1"><ShieldCheck size={12} className="text-success" /> {a.approves}</span></div>
            </article>
          )
        })}
      </div>

      <Panel className="mt-6" title="Guardrails" subtitle="How agents are scoped in ChurchConnect">
        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          <Toggle checked={enabled} onChange={(v) => { set('settings', { ...state.settings, agentsEnabled: v }); log(who, v ? 'Resumed agents' : 'Paused agents', 'All') }} label="Agents enabled" description="Leadership can pause all agents at any time." />
          <ul className="space-y-1.5 text-slate">
            <li className="flex gap-2"><Check size={14} className="text-success mt-0.5 shrink-0" /> Agents receive only the data their task needs; confidential pastoral records are excluded by default.</li>
            <li className="flex gap-2"><Check size={14} className="text-success mt-0.5 shrink-0" /> Every draft is logged in the audit trail with the agent, reviewer and decision.</li>
            <li className="flex gap-2"><Check size={14} className="text-success mt-0.5 shrink-0" /> Agents never send, pay, publish or change member records on their own.</li>
          </ul>
        </div>
      </Panel>

      <Drawer open={!!view} onClose={() => setView(null)} title={view?.title ?? ''} subtitle={view ? `${agents.find((x) => x.id === view.agentId)?.name} · ${view.kind} · reviewer: ${agents.find((x) => x.id === view.agentId)?.approves}` : ''} wide footer={view && <><Button variant="outline" icon={<X size={14} />} onClick={() => { decideDraft(view, 'rejected'); setView(null) }}>Reject</Button><Button icon={<Check size={14} />} onClick={() => { decideDraft(view, 'approved', body); setView(null) }}>Approve{body !== view.body ? ' with edits' : ''}</Button></>}>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} className="w-full min-h-[380px] rounded-lg border border-line bg-paper p-3 text-sm font-mono leading-relaxed focus:border-royal focus:outline-none focus:ring-2 focus:ring-royal/20" aria-label="Draft body" />
      </Drawer>
    </>
  )
}
