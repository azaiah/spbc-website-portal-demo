import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CalendarDays, Users, Wallet, ArrowRight, Check, Download, Globe } from 'lucide-react'
import { useDemo } from '@/data/store'
import { registrationsFor, roomById, ministryById, personName, upcomingEvents } from '@/data/selectors'
import { fmtLong, fmtTime, fmtShort, money, todayIso } from '@/data/dates'
import type { ChurchEvent, EventStage } from '@/data/types'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Button, LinkButton } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Drawer } from '@/components/Drawer'
import { Tabs } from '@/components/Tabs'
import { PageHeader, Kpi, Row, Progress } from '../layout/shared'
import { useActions } from '../actions'

export const stages: { id: EventStage; label: string; who: string }[] = [
  { id: 'proposed', label: 'Proposed', who: 'Ministry submits' },
  { id: 'approved', label: 'Approved', who: 'Leadership approves event and budget' },
  { id: 'reserved', label: 'Reserved', who: 'Facility and equipment confirmed' },
  { id: 'published', label: 'Published', who: 'Website registration page live' },
  { id: 'promoted', label: 'Promoted', who: 'Communications approved and sent' },
  { id: 'staffed', label: 'Staffed', who: 'Volunteers and vendors assigned' },
  { id: 'completed', label: 'Completed', who: 'Attendance and expenses recorded' },
  { id: 'reported', label: 'Reported', who: 'AI impact report reviewed' },
]

export function Events() {
  const { state } = useDemo()
  useDocumentMeta('Events | Saint Paul’s Everywhere')
  const [params, setParams] = useSearchParams()
  const openId = params.get('open')
  const view = (params.get('view') as 'board' | 'list') || 'board'
  const { advanceEvent } = useActions()
  const open = state.events.find((e) => e.id === openId)
  const events = [...state.events].sort((a, b) => a.date.localeCompare(b.date))
  const regsTotal = state.registrations.reduce((s, r) => s + r.qty, 0)

  return (
    <>
      <PageHeader eyebrow="Module 8" title="Events & Program Management" text="Every event moves through eight stages from proposal to impact report, with a clear owner, a tracked budget and measured outcomes." actions={<LinkButton to="/admin/ministries" variant="outline">Request an event</LinkButton>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Kpi label="Upcoming events" value={upcomingEvents(state).length} icon={CalendarDays} tone="midnight" />
        <Kpi label="Registrations" value={regsTotal} sub="Seats reserved across open events" icon={Users} />
        <Kpi label="Awaiting approval" value={events.filter((e) => e.stage === 'proposed').length} to="/admin/action-center" />
        <Kpi label="Event budget this season" value={money(events.reduce((s, e) => s + e.budget, 0))} sub={`${money(events.reduce((s, e) => s + e.spent, 0))} spent`} icon={Wallet} />
      </div>
      <Tabs className="mt-6" value={view} onChange={(v) => setParams({ view: v })} items={[{ id: 'board', label: 'Lifecycle board' }, { id: 'list', label: 'List' }]} />

      {view === 'board' ? (
        <div className="mt-4 overflow-x-auto pb-2 -mx-3 px-3">
          <div className="grid grid-flow-col auto-cols-[260px] gap-3 min-w-max">
            {stages.map((s, i) => {
              const list = events.filter((e) => e.stage === s.id)
              return (
                <div key={s.id} className="card p-3 flex flex-col">
                  <div className="flex items-center justify-between px-1"><p className="font-semibold text-sm"><span className="font-mono text-xs text-gold mr-1.5">{i + 1}</span>{s.label}</p><Badge>{list.length}</Badge></div>
                  <p className="text-[13px] text-slate px-1 mt-0.5">{s.who}</p>
                  <ul className="mt-2 space-y-2 flex-1">
                    {list.map((e) => (
                      <li key={e.id} className="rounded-lg border border-line p-2.5 hover:border-slate">
                        <button type="button" className="text-left w-full" onClick={() => setParams({ view, open: e.id })}><div className="h-1 rounded-full mb-2" style={{ background: ministryById(state, e.ministryId)?.color }} /><p className="font-medium text-sm leading-snug">{e.title}</p><p className="text-xs text-slate mt-0.5">{fmtShort(e.date)} · {ministryById(state, e.ministryId)?.name}</p></button>
                        {i < stages.length - 1 && <Button size="sm" variant="ghost" className="mt-1 w-full justify-between" onClick={() => advanceEvent(e.id)}>Advance <ArrowRight size={14} /></Button>}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="mt-4 card divide-y divide-line">
          {events.map((e) => <button key={e.id} type="button" onClick={() => setParams({ view, open: e.id })} className="w-full text-left p-3 flex items-center gap-3 hover:bg-royal-50/50"><span className="h-10 w-10 rounded-lg bg-midnight text-white flex flex-col items-center justify-center shrink-0"><span className="font-mono text-[13px] uppercase">{fmtShort(e.date).split(' ')[0]}</span><span className="font-semibold text-sm leading-none">{e.date.slice(8, 10)}</span></span><span className="flex-1 min-w-0"><span className="block font-medium truncate">{e.title}</span><span className="block text-xs text-slate">{ministryById(state, e.ministryId)?.name} · {roomById(state, e.roomId)?.name} · {fmtTime(e.start)}</span></span><Badge className="capitalize hidden sm:inline-flex">{e.stage}</Badge>{e.registrationOpen && <Badge tone="gold" className="hidden md:inline-flex">{registrationsFor(state, e.id).reduce((s, r) => s + r.qty, 0)}/{e.capacity}</Badge>}</button>)}
        </div>
      )}

      <Drawer open={!!open} onClose={() => setParams({ view })} title={open?.title ?? ''} subtitle={open && `${ministryById(state, open.ministryId)?.name} · ${fmtLong(open.date)}`} wide>
        {open && <EventDetail e={open} onAdvance={() => advanceEvent(open.id)} />}
      </Drawer>
    </>
  )
}

function EventDetail({ e, onAdvance }: { e: ChurchEvent; onAdvance: () => void }) {
  const { state, patch, log } = useDemo()
  const regs = registrationsFor(state, e.id)
  const seats = regs.reduce((s, r) => s + r.qty, 0)
  const idx = stages.findIndex((s) => s.id === e.stage)
  const [attendance, setAttendance] = useState(e.attendance ?? 0)
  const drafts = state.drafts.filter((d) => d.module === 'events' && d.title.includes(e.title))
  function exportRegs() { const lines = ['Name,Email,Seats,Registered', ...regs.map((r) => `"${r.name}",${r.email},${r.qty},${r.date}`)]; const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' })); a.download = `${e.title.replace(/\W+/g, '-')}-registrations.csv`; a.click() }
  return (
    <div className="space-y-6">
      <ol className="relative pipe grid grid-cols-8 gap-1">
        {stages.map((s, i) => <li key={s.id} className="relative flex flex-col items-center text-center"><span className={`h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-[13px] font-mono border-2 ${i <= idx ? 'bg-gold border-gold text-white' : 'bg-paper border-line text-slate'}`}>{i < idx ? <Check size={12} /> : i + 1}</span><span className={`mt-1 text-[13px] leading-tight ${i === idx ? 'font-semibold' : 'text-slate'}`}>{s.label}</span></li>)}
      </ol>
      <div className="rounded-xl bg-linen p-3 text-sm flex items-center justify-between gap-3"><span><span className="font-semibold">Current stage: {stages[idx].label}.</span> <span className="text-slate">{stages[idx].who}.</span></span>{idx < stages.length - 1 && <Button size="sm" onClick={onAdvance} icon={<ArrowRight size={14} />}>Advance to {stages[idx + 1].label}</Button>}</div>
      <p className="text-sm">{e.description}</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <dl>
          <Row label="Owner">{personName(state, e.ownerId)}</Row>
          <Row label="When">{fmtLong(e.date)}, {fmtTime(e.start)} to {fmtTime(e.end)}</Row>
          <Row label="Where">{roomById(state, e.roomId)?.name} (cap. {e.capacity})</Row>
          <Row label="Public">{e.isPublic ? <span className="inline-flex items-center gap-1"><Globe size={12} /> Listed on website</span> : 'Internal'}</Row>
          <Row label="Registration">{e.registrationOpen ? 'Open' : 'Not required'}</Row>
        </dl>
        <div>
          <p className="stamp mb-1">Budget</p>
          <p className="text-sm">{money(e.spent)} spent of {money(e.budget)}</p>
          <Progress value={e.spent} max={e.budget || 1} className="mt-1" color={e.spent > e.budget ? 'bg-danger' : 'bg-royal'} />
          {e.registrationOpen && <><p className="stamp mt-4 mb-1">Registrations</p><p className="text-sm">{seats} of {e.capacity} seats · {regs.length} registrations</p><Progress value={seats} max={e.capacity} className="mt-1" /><Button size="sm" variant="outline" className="mt-2" icon={<Download size={14} />} onClick={exportRegs}>Export list</Button></>}
          {(e.stage === 'completed' || e.stage === 'reported' || e.stage === 'staffed') && <div className="mt-4"><label className="text-sm font-medium block mb-1" htmlFor="att">Attendance</label><div className="flex gap-2"><input id="att" type="number" value={attendance} onChange={(ev) => setAttendance(Number(ev.target.value))} className="w-28 rounded-lg border border-line px-3 py-2 text-sm" /><Button size="sm" variant="outline" onClick={() => { patch('events', e.id, { attendance }); log(personName(state, state.currentMemberId), 'Recorded attendance', `${e.title}: ${attendance}`) }}>Save</Button></div></div>}
        </div>
      </div>
      {regs.length > 0 && <div><p className="stamp mb-2">Recent registrations</p><ul className="text-sm divide-y divide-line">{regs.slice(0, 8).map((r) => <li key={r.id} className="py-1.5 flex justify-between"><span>{r.name} <span className="text-slate text-xs">{r.email}</span></span><span className="text-xs">{r.qty} · {fmtShort(r.date)}</span></li>)}</ul></div>}
      {drafts.length > 0 && <div><p className="stamp mb-2">Agent drafts for this event</p><ul className="text-sm space-y-1">{drafts.map((d) => <li key={d.id} className="rounded-lg bg-linen p-2.5"><span className="font-medium">{d.title}</span> · <span className="capitalize">{d.status}</span><p className="text-xs text-slate mt-1 line-clamp-2 whitespace-pre-line">{d.body}</p></li>)}</ul></div>}
      <p className="text-xs text-slate">Created {fmtShort(e.date <= todayIso() ? e.date : todayIso())} · Website listing: {e.isPublic ? `/events` : 'none'}</p>
    </div>
  )
}
