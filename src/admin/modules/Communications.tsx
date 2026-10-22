import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Megaphone, Mail, MessageSquare, Users, Check, Send, Plus, Bot, ShieldCheck } from 'lucide-react'
import { useDemo } from '@/data/store'
import { personName, visitors, activeMembers, can } from '@/data/selectors'
import { fmtShort, todayIso } from '@/data/dates'
import type { Campaign } from '@/data/types'
import { uid } from '@/data/ids'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Input, Select, Textarea } from '@/components/Field'
import { Tabs } from '@/components/Tabs'
import { Modal } from '@/components/Modal'
import { PageHeader, Kpi, Panel, Progress } from '../layout/shared'

type Tab = 'campaigns' | 'segments' | 'consent'

export function Communications() {
  const { state, patch, upsert, log } = useDemo()
  useDocumentMeta('Communications | Saint Paul’s Everywhere')
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'campaigns'
  const who = personName(state, state.currentMemberId)
  const r = state.role
  const [adding, setAdding] = useState(false)
  const emailOk = state.members.filter((m) => m.consent.email).length
  const smsOk = state.members.filter((m) => m.consent.sms).length
  const sent = state.campaigns.filter((c) => c.status === 'sent' && c.opens)
  const openRate = sent.length ? Math.round((sent.reduce((s, c) => s + (c.opens ?? 0), 0) / sent.reduce((s, c) => s + c.recipients, 0)) * 100) : 0

  const segments = [
    { name: 'All contacts with email consent', n: emailOk, how: 'consent.email = true' },
    { name: 'All contacts with SMS consent', n: smsOk, how: 'consent.sms = true' },
    { name: 'First-time visitors, last 30 days', n: visitors(state).length, how: 'status = visitor' },
    { name: 'Members with volunteer interests', n: activeMembers(state).filter((m) => m.volunteerInterests.length).length, how: 'volunteerInterests not empty' },
    { name: 'Members not in a ministry', n: activeMembers(state).filter((m) => !m.ministryIds.length).length, how: 'ministryIds empty' },
    { name: 'Registered for the Fall Youth Field Trip', n: state.registrations.filter((x) => x.eventId === 'e_7').length, how: 'registration.eventId = e_7' },
    { name: 'Needs follow-up (90+ days)', n: activeMembers(state).filter((m) => !m.lastContact || new Date(m.lastContact) < new Date(Date.now() - 90 * 864e5)).length, how: 'lastContact older than 90d' },
  ]

  function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const fd = new FormData(e.currentTarget)
    const seg = segments.find((s) => s.name === String(fd.get('segment')))
    const c: Campaign = { id: uid('cp'), name: String(fd.get('name')), channel: String(fd.get('channel')) as Campaign['channel'], segment: seg?.name ?? 'All members', recipients: seg?.n ?? emailOk, status: 'draft' }
    upsert('campaigns', c)
    upsert('drafts', { id: uid('dr'), agentId: 'outreach', title: `Copy for: ${c.name}`, kind: 'Campaign', module: 'comms', reviewerRole: 'secretary', status: 'pending', createdAt: todayIso(), body: `Subject: ${c.name}\n\n${String(fd.get('brief') || 'Draft copy for review.')}\n\n${state.church.name} · ${state.church.address}\nReply STOP to unsubscribe.` })
    log(who, 'Created campaign', c.name); setAdding(false)
  }

  return (
    <>
      <PageHeader eyebrow="Module 10" title="Communications & Digital Marketing" text="Newsletters, text campaigns, website announcements and segmented outreach. AI prepares content; staff approve before anything is distributed." actions={<Button icon={<Plus size={16} />} onClick={() => setAdding(true)}>New campaign</Button>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Kpi label="Campaigns" value={state.campaigns.length} sub={`${state.campaigns.filter((c) => c.status !== 'sent').length} in progress`} icon={Megaphone} tone="midnight" />
        <Kpi label="Email consent" value={emailOk} sub={`of ${state.members.length} contacts`} icon={Mail} />
        <Kpi label="SMS consent" value={smsOk} sub={`of ${state.members.length} contacts`} icon={MessageSquare} />
        <Kpi label="Average open rate" value={`${openRate}%`} sub="Sent email campaigns" icon={Users} />
      </div>
      <Tabs className="mt-6" value={tab} onChange={(t) => setParams({ tab: t })} items={[{ id: 'campaigns', label: 'Campaigns' }, { id: 'segments', label: 'Segments' }, { id: 'consent', label: 'Consent' }]} />

      {tab === 'campaigns' && (
        <div className="mt-4 grid gap-3">
          {[...state.campaigns].sort((a, b) => ['draft', 'approved', 'sent'].indexOf(a.status) - ['draft', 'approved', 'sent'].indexOf(b.status)).map((c) => (
            <article key={c.id} className="card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2"><Badge tone={c.status === 'sent' ? 'success' : c.status === 'approved' ? 'royal' : 'gold'} className="capitalize">{c.status}</Badge><Badge className="uppercase">{c.channel}</Badge><span className="stamp">{c.recipients} recipients · {c.segment}</span></div>
                <p className="font-semibold mt-1.5">{c.name}</p>
                {c.status === 'sent' && c.opens !== undefined && <div className="mt-2 grid grid-cols-2 gap-3 max-w-sm text-xs"><div><div className="flex justify-between"><span>Opens</span><span>{c.opens} ({Math.round((c.opens / c.recipients) * 100)}%)</span></div><Progress value={c.opens} max={c.recipients} className="mt-1" color="bg-royal" /></div><div><div className="flex justify-between"><span>Clicks</span><span>{c.clicks} ({Math.round(((c.clicks ?? 0) / c.recipients) * 100)}%)</span></div><Progress value={c.clicks ?? 0} max={c.recipients} className="mt-1" /></div></div>}
                {c.status === 'sent' && c.sentAt && <p className="text-xs text-slate mt-1">Sent {fmtShort(c.sentAt)}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                {c.status === 'draft' && can.approveComms(r) && <Button size="sm" variant="outline" icon={<Check size={14} />} onClick={() => { patch('campaigns', c.id, { status: 'approved' }); log(who, 'Approved campaign', c.name) }}>Approve</Button>}
                {c.status === 'approved' && can.approveComms(r) && <Button size="sm" icon={<Send size={14} />} onClick={() => { patch('campaigns', c.id, { status: 'sent', sentAt: todayIso(), opens: 0, clicks: 0 }); log(who, 'Sent campaign', `${c.name} to ${c.recipients}`) }}>Send</Button>}
              </div>
            </article>
          ))}
          <p className="text-xs text-slate flex items-center gap-1.5"><Bot size={12} /> The Outreach Agent drafts copy for every new campaign; it appears in the Action Center for the Office & Communications.</p>
        </div>
      )}

      {tab === 'segments' && (
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {segments.map((s) => <Panel key={s.name} title={s.name} subtitle={<span className="font-mono">{s.how}</span>}><p className="font-display text-3xl font-semibold">{s.n}</p><p className="text-xs text-slate">contacts match right now · recalculated live from the CRM</p></Panel>)}
        </div>
      )}

      {tab === 'consent' && (
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          <Panel title="Consent at a glance" subtitle="Held centrally and enforced on every send">
            <div className="space-y-3 text-sm"><div><div className="flex justify-between"><span>Email</span><span>{emailOk} of {state.members.length}</span></div><Progress value={emailOk} max={state.members.length} className="mt-1" color="bg-royal" /></div><div><div className="flex justify-between"><span>SMS</span><span>{smsOk} of {state.members.length}</span></div><Progress value={smsOk} max={state.members.length} className="mt-1" /></div></div>
            <ul className="mt-4 text-xs text-slate space-y-1.5"><li className="flex gap-2"><ShieldCheck size={13} className="text-success shrink-0 mt-0.5" /> Members change preferences in the portal; changes apply instantly.</li><li className="flex gap-2"><ShieldCheck size={13} className="text-success shrink-0 mt-0.5" /> Every SMS includes STOP; unsubscribes are recorded against the member.</li><li className="flex gap-2"><ShieldCheck size={13} className="text-success shrink-0 mt-0.5" /> Segments only ever include contacts with consent for that channel.</li></ul>
          </Panel>
          <div className="card divide-y divide-line max-h-[480px] overflow-y-auto">
            {state.members.slice(0, 40).map((m) => <div key={m.id} className="p-2.5 flex items-center gap-3 text-sm"><span className="flex-1 truncate">{m.first} {m.last}</span><Badge tone={m.consent.email ? 'success' : 'neutral'}>Email {m.consent.email ? 'yes' : 'no'}</Badge><Badge tone={m.consent.sms ? 'success' : 'neutral'}>SMS {m.consent.sms ? 'yes' : 'no'}</Badge></div>)}
          </div>
        </div>
      )}

      <Modal open={adding} onClose={() => setAdding(false)} title="New campaign" size="sm">
        <form onSubmit={add} className="grid gap-3">
          <Input name="name" label="Campaign name" required /><Select name="channel" label="Channel"><option value="email">Email</option><option value="sms">SMS</option></Select>
          <Select name="segment" label="Segment">{segments.map((s) => <option key={s.name}>{s.name}</option>)}</Select>
          <Textarea name="brief" label="Brief for the Outreach Agent" placeholder="Invite neighbors to the Thanksgiving dinner; mention volunteer sign-ups." />
          <div className="flex justify-end gap-2 pt-2"><Button variant="ghost" onClick={() => setAdding(false)}>Cancel</Button><Button type="submit">Create and draft</Button></div>
        </form>
      </Modal>
    </>
  )
}
