import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Users, CalendarDays, Wallet, Plus, Lock, Bot } from 'lucide-react'
import { useDemo } from '@/data/store'
import { accountById } from '@/config/accounts'
import { sum, fullName, memberById, personName, upcomingEvents, can } from '@/data/selectors'
import { money, fmtShort, fmtLong, todayIso } from '@/data/dates'
import type { ChurchEvent } from '@/data/types'
import { uid } from '@/data/ids'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Input, Select, Textarea } from '@/components/Field'
import { Modal } from '@/components/Modal'
import { PageHeader, Kpi, Panel, Progress } from '../layout/shared'

export function Ministries() {
  const { state, upsert, log } = useDemo()
  useDocumentMeta('Ministries | Saint Paul’s Everywhere')
  const [params, setParams] = useSearchParams()
  const r = state.role
  // Ministry leaders and volunteers see only the ministries on their own account.
  const mine = accountById(state.accountId)?.ministryIds ?? []
  const scoped = (r === 'ministry' || r === 'volunteer') && mine.length ? state.ministries.filter((m) => mine.includes(m.id)) : state.ministries
  const sel = params.get('m') ?? scoped[0]?.id
  const m = scoped.find((x) => x.id === sel) ?? scoped[0]
  const [requesting, setRequesting] = useState(false)
  const who = personName(state, state.currentMemberId)
  const members = state.members.filter((x) => x.ministryIds.includes(m.id))
  const lines = state.budgets.filter((b) => b.ministryId === m.id)
  const events = state.events.filter((e) => e.ministryId === m.id).sort((a, b) => a.date.localeCompare(b.date))
  const shifts = state.shifts.filter((s) => s.ministryId === m.id)
  const expenses = state.expenses.filter((x) => x.ministryId === m.id)
  const volunteers = state.staff.filter((s) => s.ministryIds.includes(m.id))

  function request(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const fd = new FormData(e.currentTarget)
    const ev: ChurchEvent = { id: uid('e'), title: String(fd.get('title')), ministryId: m.id, date: String(fd.get('date')), start: String(fd.get('start')), end: String(fd.get('end')), roomId: String(fd.get('room')), description: String(fd.get('description')), stage: 'proposed', budget: Number(fd.get('budget')) || 0, spent: 0, capacity: state.rooms.find((x) => x.id === String(fd.get('room')))?.capacity ?? 50, isPublic: true, category: 'community', registrationOpen: false, ownerId: state.currentMemberId }
    upsert('events', ev)
    upsert('approvals', { id: uid('ap'), kind: 'event', title: `${ev.title} (proposal)`, requester: m.name, amount: ev.budget, status: 'pending', createdAt: todayIso(), relatedId: ev.id, relatedModule: 'events' })
    const conflict = state.events.find((x) => x.roomId === ev.roomId && x.date === ev.date && x.start < ev.end && ev.start < x.end)
    upsert('drafts', { id: uid('dr'), agentId: 'event', title: `Calendar check: ${ev.title}`, kind: 'Checklist', module: 'events', reviewerRole: 'admin', status: 'pending', createdAt: todayIso(), body: conflict ? `CONFLICT: ${state.rooms.find((x) => x.id === ev.roomId)?.name} is already booked for "${conflict.title}" on ${ev.date} ${conflict.start}-${conflict.end}. Suggest another room or time before approval.` : `${state.rooms.find((x) => x.id === ev.roomId)?.name} is available on ${ev.date} ${ev.start}-${ev.end}. On approval: reserve room, publish registration page, draft announcement.` })
    log(who, 'Submitted event request', ev.title); setRequesting(false)
  }

  return (
    <>
      <PageHeader eyebrow="Module 4" title="Ministry & Department Management" text={r === 'ministry' || r === 'volunteer' ? `Your ministry workspace. You see ${scoped.length > 1 ? 'your ministries' : m.name} only.` : 'Each ministry has its own workspace. Leadership sees them all; leaders see only their own.'} actions={<Button icon={<Plus size={16} />} onClick={() => setRequesting(true)}>Request an event</Button>} />
      {scoped.length > 1 && (
        <div className="flex flex-wrap gap-1.5 mb-5">{scoped.map((x) => <button key={x.id} type="button" onClick={() => setParams({ m: x.id })} className={`rounded-full px-3 py-1.5 text-xs font-medium border inline-flex items-center gap-1.5 ${m.id === x.id ? 'bg-midnight text-white border-midnight' : 'border-line bg-paper hover:border-slate'}`}><span className="h-2 w-2 shrink-0 rounded-full" style={{ background: x.color }} />{x.name}</button>)}</div>
      )}
      <div className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4" style={{ borderTop: `4px solid ${m.color}` }}>
        <div className="flex-1"><h2 className="font-display text-2xl font-semibold">{m.name}</h2><p className="text-slate text-sm mt-1">{m.description}</p><p className="stamp mt-2">{m.meets} · Led by {fullName(memberById(state, m.leaderId))} · Annual budget {money(m.annualBudget)}</p></div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <Kpi label="Participants" value={members.length} icon={Users} tone="midnight" />
        <Kpi label="Volunteers on roster" value={volunteers.length} sub={`${shifts.filter((s) => s.status === 'open').length} open shifts`} />
        <Kpi label="Upcoming events" value={events.filter((e) => e.date >= todayIso()).length} icon={CalendarDays} />
        {can.seeGivingSummary(r) || r === 'ministry' ? <Kpi label="Month budget used" value={`${Math.round((sum(lines.map((l) => l.actual)) / sum(lines.map((l) => l.planned))) * 100)}%`} sub={`${money(sum(lines.map((l) => l.actual)))} of ${money(sum(lines.map((l) => l.planned)))}`} icon={Wallet} /> : <Kpi label="Budget" value={<Lock size={20} />} sub="Restricted" />}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Calendar" subtitle="Events owned by this ministry">
          <ul className="divide-y divide-line text-sm">{events.map((e) => <li key={e.id} className="py-2 flex items-center justify-between gap-2"><span className="min-w-0"><span className="block font-medium truncate">{e.title}</span><span className="block text-xs text-slate">{fmtLong(e.date)}</span></span><Badge className="capitalize">{e.stage}</Badge></li>)}{events.length === 0 && <li className="py-3 text-slate">No events yet.</li>}</ul>
        </Panel>
        <Panel title="Budget lines" subtitle="Planned vs actual, this month">
          <ul className="space-y-2.5">{lines.map((l) => <li key={l.id} className="text-sm"><div className="flex justify-between"><span>{l.category}</span><span className={`font-mono text-xs ${l.actual > l.planned ? 'text-danger' : ''}`}>{money(l.actual)} / {money(l.planned)}</span></div><Progress value={l.actual} max={l.planned} className="mt-1" color={l.actual > l.planned ? 'bg-danger' : 'bg-royal'} /></li>)}</ul>
          {expenses.length > 0 && <><p className="stamp mt-4 mb-1">Expense requests</p><ul className="text-xs space-y-1">{expenses.map((x) => <li key={x.id} className="flex justify-between"><span>{x.vendor}</span><span className="capitalize">{money(x.amount)} · {x.status}</span></li>)}</ul></>}
        </Panel>
        <Panel title="Volunteer schedule" subtitle="Next four Sundays">
          <ul className="divide-y divide-line text-sm">{shifts.map((s) => <li key={s.id} className="py-2 flex items-center justify-between gap-2"><span>{s.role} <span className="text-slate text-xs">· {fmtShort(s.date)}</span></span>{s.staffId ? <span className="text-xs">{personName(state, s.staffId)}</span> : <Badge tone="gold">Open</Badge>}</li>)}{shifts.length === 0 && <li className="py-3 text-slate">No shifts scheduled. Schedules are managed in People & Volunteers.</li>}</ul>
        </Panel>
        <Panel title="Participants" subtitle={`${members.length} members and attendees`} className="lg:col-span-2">
          <ul className="grid sm:grid-cols-2 gap-1 text-sm">{members.slice(0, 16).map((x) => <li key={x.id} className="flex items-center gap-2 py-1"><span className="h-7 w-7 shrink-0 rounded-full bg-linen flex items-center justify-center text-[13px] font-semibold">{x.first[0]}{x.last[0]}</span><span className="flex-1 truncate">{fullName(x)}</span>{r !== 'volunteer' && <span className="text-xs text-slate">{x.phone}</span>}</li>)}</ul>
          {members.length > 16 && <p className="text-xs text-slate mt-2">and {members.length - 16} more</p>}
          {r === 'volunteer' && <p className="text-xs text-slate mt-2 flex items-center gap-1"><Lock size={11} /> Volunteers see names only; contact details are limited.</p>}
        </Panel>
        <Panel title="Monthly activity report" subtitle="Prepared by the Office Agent, reviewed by the leader">
          <ul className="text-sm space-y-1.5">
            <li className="flex justify-between"><span className="text-slate">Events held</span><span>{events.filter((e) => e.stage === 'completed' || e.stage === 'reported').length}</span></li>
            <li className="flex justify-between"><span className="text-slate">Total attendance</span><span>{sum(events.map((e) => e.attendance ?? 0))}</span></li>
            <li className="flex justify-between"><span className="text-slate">Volunteer hours</span><span>{sum(volunteers.map((v) => v.hoursThisMonth))}</span></li>
            <li className="flex justify-between"><span className="text-slate">Spent vs budget</span><span>{money(sum(lines.map((l) => l.actual)))} / {money(sum(lines.map((l) => l.planned)))}</span></li>
          </ul>
          <p className="text-xs text-slate mt-3 flex items-center gap-1.5"><Bot size={12} /> Consolidated across ministries for the pastor and executive administrator.</p>
        </Panel>
      </div>

      <Modal open={requesting} onClose={() => setRequesting(false)} title={`Event request from ${m.name}`}>
        <form onSubmit={request} className="grid gap-3 sm:grid-cols-2">
          <Input className="sm:col-span-2" name="title" label="Event title" required />
          <Input name="date" type="date" label="Date" required defaultValue={upcomingEvents(state)[0]?.date} />
          <Select name="room" label="Room">{state.rooms.filter((x) => x.kind !== 'vehicle').map((x) => <option key={x.id} value={x.id}>{x.name} (cap. {x.capacity})</option>)}</Select>
          <Input name="start" type="time" label="Start" defaultValue="18:00" /><Input name="end" type="time" label="End" defaultValue="20:00" />
          <Input name="budget" type="number" min={0} label="Requested budget" defaultValue={0} />
          <div className="hidden sm:block" />
          <Textarea className="sm:col-span-2" name="description" label="Description" />
          <p className="sm:col-span-2 text-xs text-slate">On submit: the Event Agent checks the calendar for conflicts and an approval is routed to the Executive Administrator. On approval the room is reserved, the registration page is published and announcements are drafted.</p>
          <div className="sm:col-span-2 flex justify-end gap-2"><Button variant="ghost" onClick={() => setRequesting(false)}>Cancel</Button><Button type="submit">Submit request</Button></div>
        </form>
      </Modal>
    </>
  )
}
