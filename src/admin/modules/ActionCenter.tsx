import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Check, X, Bot, ClipboardList, Inbox } from 'lucide-react'
import { useDemo } from '@/data/store'
import { pendingApprovals, pendingDrafts, openTasks, can, personName } from '@/data/selectors'
import { money, fmtShort, relDays } from '@/data/dates'
import type { Approval, AgentDraft, Role } from '@/data/types'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Tabs } from '@/components/Tabs'
import { Drawer } from '@/components/Drawer'
import { EmptyState } from '@/components/EmptyState'
import { PageHeader, Kpi } from '../layout/shared'
import { useActions } from '../actions'
import { agents } from '@/config/platform'

type Tab = 'approvals' | 'drafts' | 'tasks'

function canDecide(a: Approval, r: Role) {
  if (a.kind === 'expense') return can.approveFinance(r)
  if (a.kind === 'communication') return can.approveComms(r)
  return can.approveOps(r)
}

export function ActionCenter() {
  const { state } = useDemo()
  useDocumentMeta('Action Center | Saint Paul’s Everywhere')
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'approvals'
  const { decideApproval, decideDraft, completeTask } = useActions()
  const approvals = pendingApprovals(state)
  const drafts = pendingDrafts(state)
  const tasks = openTasks(state).sort((a, b) => a.due.localeCompare(b.due))
  const [view, setView] = useState<AgentDraft | null>(null)
  const [body, setBody] = useState('')
  const r = state.role

  return (
    <>
      <PageHeader eyebrow="Workflow" title="Action Center" text="Everything waiting on a human decision. AI agents draft and route; people approve." />
      <div className="grid gap-3 sm:grid-cols-3">
        <Kpi label="Approvals" value={approvals.length} sub={`${approvals.filter((a) => canDecide(a, r)).length} you can decide`} icon={Inbox} tone="midnight" />
        <Kpi label="Agent drafts" value={drafts.length} sub={`${drafts.filter((d) => d.reviewerRole === r || r === 'admin' || r === 'pastor').length} routed to you`} icon={Bot} />
        <Kpi label="Open tasks" value={tasks.length} sub={`${tasks.filter((t) => t.due < new Date().toISOString().slice(0, 10)).length} overdue`} icon={ClipboardList} />
      </div>
      <Tabs className="mt-6" value={tab} onChange={(t) => setParams({ tab: t })} items={[{ id: 'approvals', label: 'Approvals', count: approvals.length }, { id: 'drafts', label: 'Agent drafts', count: drafts.length }, { id: 'tasks', label: 'Tasks', count: tasks.length }]} />

      {tab === 'approvals' && (
        <div className="mt-4 grid gap-3">
          {approvals.length === 0 && <EmptyState icon={Check} title="Inbox zero" text="No approvals are waiting. New requests from ministries, the website and the agents land here." />}
          {approvals.map((a) => {
            const ok = canDecide(a, r)
            return (
              <article key={a.id} className="card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><Badge tone="gold" className="capitalize">{a.kind}</Badge><Badge className="capitalize">{a.relatedModule}</Badge><span className="stamp">{relDays(a.createdAt)}</span></div>
                  <p className="font-semibold mt-1.5">{a.title}</p>
                  <p className="text-sm text-slate">Requested by {a.requester}{a.amount ? ` · ${money(a.amount)}` : ''}{a.amount && a.amount > 2500 ? ' · Board approval threshold' : ''}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {ok ? <><Button size="sm" variant="outline" icon={<X size={14} />} onClick={() => decideApproval(a, 'rejected')}>Reject</Button><Button size="sm" icon={<Check size={14} />} onClick={() => decideApproval(a, 'approved')}>Approve</Button></> : <span className="text-xs text-slate">Requires {a.kind === 'expense' ? 'Finance Office' : a.kind === 'communication' ? 'Office & Communications' : 'Executive Administrator'}</span>}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {tab === 'drafts' && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {drafts.length === 0 && <div className="md:col-span-2"><EmptyState icon={Bot} title="No drafts waiting" text="The agents prepare new drafts after each Sunday and whenever requests arrive." /></div>}
          {drafts.map((d) => {
            const ag = agents.find((x) => x.id === d.agentId)!
            return (
              <article key={d.id} className="card p-4 flex flex-col">
                <div className="flex items-center gap-2"><div className="h-8 w-8 shrink-0 rounded-lg bg-gold-50 text-gold flex items-center justify-center"><Bot size={16} /></div><div className="min-w-0"><p className="text-xs text-slate">{ag.name} · {d.kind}</p><p className="font-semibold truncate">{d.title}</p></div></div>
                <p className="text-sm text-slate mt-3 line-clamp-3 whitespace-pre-line flex-1">{d.body}</p>
                <div className="mt-3 flex items-center justify-between gap-2"><span className="text-xs text-slate">Reviewer: {ag.approves}</span><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => { setView(d); setBody(d.body) }}>Review</Button><Button size="sm" onClick={() => decideDraft(d, 'approved')} icon={<Check size={14} />}>Approve</Button></div></div>
              </article>
            )
          })}
        </div>
      )}

      {tab === 'tasks' && (
        <div className="mt-4 card divide-y divide-line">
          {tasks.map((t) => (
            <div key={t.id} className="p-3 flex items-center gap-3">
              <button type="button" onClick={() => completeTask(t.id)} className="h-6 w-6 rounded-md border-2 border-line hover:border-gold flex items-center justify-center shrink-0" aria-label={`Complete ${t.title}`} />
              <div className="flex-1 min-w-0"><p className="font-medium text-sm">{t.title}</p><p className="text-xs text-slate">{personName(state, t.assigneeId)} · {t.module} · due {fmtShort(t.due)}</p></div>
              <Badge tone={t.priority === 'high' ? 'danger' : t.priority === 'normal' ? 'neutral' : 'neutral'} className="capitalize">{t.priority}</Badge>
              <Badge tone={t.status === 'doing' ? 'royal' : 'neutral'} className="capitalize">{t.status}</Badge>
            </div>
          ))}
          {tasks.length === 0 && <div className="p-6"><EmptyState icon={ClipboardList} title="All caught up" text="No open tasks." compact /></div>}
        </div>
      )}

      <Drawer open={!!view} onClose={() => setView(null)} title={view?.title ?? ''} subtitle={view ? `${agents.find((x) => x.id === view.agentId)?.name} · ${view.kind}` : ''} wide footer={view && <><Button variant="outline" icon={<X size={14} />} onClick={() => { decideDraft(view, 'rejected'); setView(null) }}>Reject</Button><Button icon={<Check size={14} />} onClick={() => { decideDraft(view, 'approved', body); setView(null) }}>Approve{body !== view.body ? ' with edits' : ''}</Button></>}>
        <p className="text-xs text-slate mb-2">Edit the draft before approving. The agent never sends, pays or publishes; approval hands the content to the right module.</p>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} className="w-full min-h-[360px] rounded-lg border border-line bg-paper p-3 text-sm font-mono leading-relaxed focus:border-royal focus:outline-none focus:ring-2 focus:ring-royal/20" aria-label="Draft body" />
      </Drawer>
    </>
  )
}
