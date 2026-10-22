import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { HandHeart, Lock, Check, ArrowRight, Users } from 'lucide-react'
import { useDemo } from '@/data/store'
import { personName, openServices, sum } from '@/data/selectors'
import { relDays } from '@/data/dates'
import type { ServiceRequest, ServiceProgram } from '@/data/types'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Input } from '@/components/Field'
import { Tabs } from '@/components/Tabs'
import { Modal } from '@/components/Modal'
import { PageHeader, Kpi, Panel, Progress } from '../layout/shared'

type Tab = 'requests' | 'programs' | 'impact'
const programLabel: Record<ServiceProgram, string> = { food: 'Food pantry', housing: 'Housing referrals', employment: 'Employment', transportation: 'Transportation', senior: 'Senior support', emergency: 'Emergency help' }
const statusTone = { new: 'gold', assigned: 'royal', 'in-progress': 'neutral', fulfilled: 'success', referred: 'success' } as const

export function Community() {
  const { state, patch, log } = useDemo()
  useDocumentMeta('Community Outreach & Social Services | Saint Paul’s Everywhere')
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'requests'
  const who = personName(state, state.currentMemberId)
  const r = state.role
  const canSeeNames = r !== 'pastor' && r !== 'volunteer'
  const [closing, setClosing] = useState<ServiceRequest | null>(null)
  const [outcome, setOutcome] = useState('')
  const list = [...state.services].sort((a, b) => ['new', 'assigned', 'in-progress', 'fulfilled', 'referred'].indexOf(a.status) - ['new', 'assigned', 'in-progress', 'fulfilled', 'referred'].indexOf(b.status) || b.date.localeCompare(a.date))
  const people = sum(state.services.map((s) => s.householdSize ?? 1))
  const programs: ServiceProgram[] = ['food', 'housing', 'employment', 'transportation', 'senior', 'emergency']
  const coordinatorFor: Record<ServiceProgram, string> = { food: 'm_7', housing: 'm_3', employment: 'm_14', transportation: 'm_6', senior: 'm_4', emergency: 'm_4' }

  return (
    <>
      <PageHeader eyebrow="Module 9" title="Community Outreach & Social Services" text="The church as an organized community service provider: confidential intake, coordinator routing, service delivery and aggregated impact without exposing personal detail." />
      <div className="grid gap-3 sm:grid-cols-4">
        <Kpi label="Open requests" value={openServices(state).length} sub={`${state.services.filter((s) => s.status === 'new').length} unassigned`} icon={HandHeart} tone="midnight" />
        <Kpi label="Fulfilled or referred" value={state.services.filter((s) => s.status === 'fulfilled' || s.status === 'referred').length} sub="Last 30 days" icon={Check} />
        <Kpi label="People reached" value={people} sub="Household members across requests" icon={Users} />
        <Kpi label="Programs active" value={programs.length} sub="Plus partner referrals" to="/admin/community?tab=programs" />
      </div>
      <Tabs className="mt-6" value={tab} onChange={(t) => setParams({ tab: t })} items={[{ id: 'requests', label: 'Service requests', count: openServices(state).length }, { id: 'programs', label: 'Programs' }, { id: 'impact', label: 'Impact' }]} />

      {tab === 'requests' && (
        <div className="mt-4">
          {!canSeeNames && <p className="text-xs text-slate mb-3 flex items-center gap-1.5"><Lock size={12} /> Your role sees requests without identifying details. Coordinators see names and contact information.</p>}
          <div className="grid gap-3">
            {list.map((s) => (
              <article key={s.id} className="card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><Badge tone="royal">{programLabel[s.program]}</Badge><Badge tone={statusTone[s.status]} className="capitalize">{s.status.replace('-', ' ')}</Badge><Badge><Lock size={11} /> Confidential</Badge><span className="stamp">{relDays(s.date)}{s.householdSize ? ` · household of ${s.householdSize}` : ''}</span></div>
                  <p className="font-semibold mt-1.5">{canSeeNames ? s.name : `Request ${s.id.slice(-4).toUpperCase()}`}{canSeeNames && <span className="text-slate font-normal text-sm"> · {s.contact}</span>}</p>
                  {canSeeNames && <p className="text-sm mt-0.5">{s.text}</p>}
                  <p className="text-xs text-slate mt-1">{s.coordinatorId ? `Coordinator: ${personName(state, s.coordinatorId)}` : 'Awaiting coordinator'}{s.outcome ? ` · Outcome: ${s.outcome}` : ''}</p>
                </div>
                {canSeeNames && (
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {s.status === 'new' && <Button size="sm" variant="outline" onClick={() => { patch('services', s.id, { status: 'assigned', coordinatorId: coordinatorFor[s.program] }); log(who, 'Assigned service request', programLabel[s.program]) }}>Assign to {personName(state, coordinatorFor[s.program]).split(' ')[0]}</Button>}
                    {s.status === 'assigned' && <Button size="sm" variant="outline" onClick={() => { patch('services', s.id, { status: 'in-progress' }); log(who, 'Started service request', programLabel[s.program]) }}>Start</Button>}
                    {(s.status === 'assigned' || s.status === 'in-progress') && <Button size="sm" icon={<Check size={14} />} onClick={() => { setClosing(s); setOutcome('') }}>Record outcome</Button>}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      )}

      {tab === 'programs' && (
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => { const reqs = state.services.filter((s) => s.program === p); const done = reqs.filter((s) => s.status === 'fulfilled' || s.status === 'referred').length; return (
            <Panel key={p} title={programLabel[p]} subtitle={`Coordinator: ${personName(state, coordinatorFor[p])}`}>
              <div className="grid grid-cols-3 gap-2 text-center text-sm"><div className="rounded-lg bg-linen p-2"><p className="text-[13px] text-slate">Requests</p><p className="font-display text-xl font-semibold">{reqs.length}</p></div><div className="rounded-lg bg-linen p-2"><p className="text-[13px] text-slate">Resolved</p><p className="font-display text-xl font-semibold">{done}</p></div><div className="rounded-lg bg-linen p-2"><p className="text-[13px] text-slate">Open</p><p className="font-display text-xl font-semibold">{reqs.length - done}</p></div></div>
              <Progress value={done} max={reqs.length || 1} className="mt-3" color="bg-success" />
              <p className="text-xs text-slate mt-2">Partners: {p === 'food' ? 'Feed More' : p === 'housing' ? 'HOME of VA, Richmond DSS' : p === 'employment' ? 'Office of Community Wealth Building, Amazon RIC2' : p === 'transportation' ? 'Senior Connections grant' : p === 'senior' ? 'Senior Connections, Bon Secours' : 'Benevolence Fund'}</p>
            </Panel>
          ) })}
        </div>
      )}

      {tab === 'impact' && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Panel title="Impact summary" subtitle="Aggregated for leadership and funders. No names, no case detail.">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[['Requests received', state.services.length], ['Households served', state.services.filter((s) => s.status === 'fulfilled' || s.status === 'referred').length], ['People in those households', people], ['Referrals to partners', state.services.filter((s) => s.status === 'referred').length], ['Volunteer hours (outreach)', sum(state.staff.filter((s) => s.ministryIds.includes('min_outreach') || s.ministryIds.includes('min_transport')).map((s) => s.hoursThisMonth))], ['Benevolence disbursed', '$340']].map(([k, v]) => <div key={String(k)} className="rounded-lg bg-linen p-3"><dt className="text-xs text-slate">{k}</dt><dd className="font-display text-2xl font-semibold">{v}</dd></div>)}
            </dl>
          </Panel>
          <Panel title="Requests by program" subtitle="Last 30 days">
            <ul className="space-y-2.5">{programs.map((p) => { const n = state.services.filter((s) => s.program === p).length; return <li key={p} className="text-sm"><div className="flex justify-between"><span>{programLabel[p]}</span><span className="font-mono">{n}</span></div><Progress value={n} max={Math.max(...programs.map((x) => state.services.filter((s) => s.program === x).length), 1)} className="mt-1" color="bg-royal" /></li> })}</ul>
            <p className="text-xs text-slate mt-3 flex items-center gap-1.5">This summary feeds the Robins Foundation grant report <ArrowRight size={12} /> Partnerships module.</p>
          </Panel>
        </div>
      )}

      <Modal open={!!closing} onClose={() => setClosing(null)} title="Record outcome" size="sm" footer={<><Button variant="ghost" onClick={() => setClosing(null)}>Cancel</Button><Button variant="outline" onClick={() => { if (closing) { patch('services', closing.id, { status: 'referred', outcome: outcome || 'Referred to partner' }); log(who, 'Referred service request', programLabel[closing.program]); setClosing(null) } }}>Referred</Button><Button onClick={() => { if (closing) { patch('services', closing.id, { status: 'fulfilled', outcome: outcome || 'Fulfilled' }); log(who, 'Fulfilled service request', programLabel[closing.program]); setClosing(null) } }}>Fulfilled</Button></>}>
        <Input label="What happened?" value={outcome} onChange={(e) => setOutcome(e.target.value)} placeholder="Pantry box provided Saturday; follow-up in two weeks" />
      </Modal>
    </>
  )
}
