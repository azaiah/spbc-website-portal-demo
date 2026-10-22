import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Warehouse, Wrench, Package, Check, X, Plus, DollarSign, AlertTriangle, Bot } from 'lucide-react'
import { useDemo } from '@/data/store'
import { roomById, personName, openMaintenance, sum, can } from '@/data/selectors'
import { fmtShort, fmtTime, money, daysUntil, relDays, todayIso } from '@/data/dates'
import type { Maintenance, Reservation } from '@/data/types'
import { uid } from '@/data/ids'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Input, Select, Textarea } from '@/components/Field'
import { Tabs } from '@/components/Tabs'
import { Modal } from '@/components/Modal'
import { PageHeader, Kpi } from '../layout/shared'

type Tab = 'rooms' | 'reservations' | 'maintenance' | 'assets'
const prioTone = { low: 'neutral', normal: 'royal', high: 'warning', urgent: 'danger' } as const

export function Facilities() {
  const { state, patch, upsert, log } = useDemo()
  useDocumentMeta('Facilities | Saint Paul’s Everywhere')
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'rooms'
  const who = personName(state, state.currentMemberId)
  const r = state.role
  const pending = state.reservations.filter((x) => x.status === 'requested')
  const rentals = state.reservations.filter((x) => x.external && x.status === 'approved')
  const dueSoon = state.assets.filter((a) => daysUntil(a.serviceDue) <= 30 || (a.insuranceRenewal && daysUntil(a.insuranceRenewal) <= 45))
  const week = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d.toISOString().slice(0, 10) })

  return (
    <>
      <PageHeader eyebrow="Module 6" title="Facilities & Asset Management" text="Rooms, reservations, rentals, maintenance work orders and assets in one place. Church facilities become managed community assets." />
      <div className="grid gap-3 sm:grid-cols-4">
        <Kpi label="Reservation requests" value={pending.length} icon={Warehouse} tone="midnight" to="/admin/facilities?tab=reservations" />
        <Kpi label="Open maintenance" value={openMaintenance(state).length} sub={`${openMaintenance(state).filter((m) => m.priority === 'urgent').length} urgent`} icon={Wrench} to="/admin/facilities?tab=maintenance" />
        <Kpi label="Rental revenue (approved)" value={money(sum(rentals.map((x) => x.fee ?? 0)))} sub={`${rentals.length} external bookings`} icon={DollarSign} />
        <Kpi label="Service or renewal due" value={dueSoon.length} sub="Within 30 to 45 days" icon={Package} to="/admin/facilities?tab=assets" />
      </div>
      <Tabs className="mt-6" value={tab} onChange={(t) => setParams({ tab: t })} items={[{ id: 'rooms', label: 'Rooms this week' }, { id: 'reservations', label: 'Reservations', count: pending.length }, { id: 'maintenance', label: 'Maintenance', count: openMaintenance(state).length }, { id: 'assets', label: 'Assets', count: dueSoon.length }]} />

      {tab === 'rooms' && (
        <div className="mt-4 card overflow-x-auto">
          <table className="w-full text-xs min-w-[720px]">
            <thead className="bg-linen"><tr><th className="text-left px-3 py-2 stamp">Room</th>{week.map((d) => <th key={d} className="px-2 py-2 stamp text-center">{fmtShort(d)}</th>)}</tr></thead>
            <tbody>
              {state.rooms.map((room) => (
                <tr key={room.id} className="border-t border-line">
                  <td className="px-3 py-2"><p className="font-medium text-sm">{room.name}</p><p className="text-slate">cap. {room.capacity}{room.rentalRate ? ` · ${money(room.rentalRate)}/event` : ''}</p></td>
                  {week.map((d) => {
                    const items = [...state.events.filter((e) => e.roomId === room.id && e.date === d).map((e) => ({ id: e.id, label: e.title, time: e.start, kind: 'event' as const })), ...state.reservations.filter((x) => x.roomId === room.id && x.date === d && !x.eventId).map((x) => ({ id: x.id, label: x.requester, time: x.start, kind: x.status }))]
                    return <td key={d} className="px-1.5 py-1.5 align-top">{items.map((it) => <div key={it.id} className={`rounded px-1.5 py-1 mb-1 truncate ${it.kind === 'event' ? 'bg-royal-50 text-royal' : it.kind === 'approved' ? 'bg-[#E6F3EC] text-success' : 'bg-gold-50 text-gold'}`} title={it.label}>{fmtTime(it.time)} {it.label}</div>)}</td>
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'reservations' && <Reservations />}
      {tab === 'maintenance' && <MaintenanceList />}
      {tab === 'assets' && (
        <div className="mt-4 card divide-y divide-line">
          {state.assets.map((a) => { const sd = daysUntil(a.serviceDue); const ir = a.insuranceRenewal ? daysUntil(a.insuranceRenewal) : null; return (
            <div key={a.id} className="p-3 flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
              <div className="flex-1 min-w-0"><p className="font-medium">{a.name}</p><p className="text-xs text-slate">{a.category} · {a.location}{a.value ? ` · ${money(a.value)}` : ''}</p></div>
              <div className="flex flex-wrap gap-2"><Badge tone={sd < 0 ? 'danger' : sd <= 30 ? 'warning' : 'neutral'}>Service {sd < 0 ? `overdue ${-sd}d` : `in ${sd}d`}</Badge>{ir !== null && <Badge tone={ir <= 45 ? 'warning' : 'neutral'}>Insurance renews in {ir}d</Badge>}</div>
            </div>
          ) })}
          <p className="p-3 text-xs text-slate flex items-center gap-1.5"><Bot size={12} /> The Facilities Agent creates reminders 45 days before renewals and 30 days before service dates.</p>
        </div>
      )}
    </>
  )

  function Reservations() {
    const [adding, setAdding] = useState(false)
    const list = [...state.reservations].sort((a, b) => (a.status === 'requested' ? -1 : 1) - (b.status === 'requested' ? -1 : 1) || a.date.localeCompare(b.date))
    function decide(x: Reservation, s: Reservation['status']) { patch('reservations', x.id, { status: s }); const ap = state.approvals.find((a) => a.relatedId === x.id); if (ap) patch('approvals', ap.id, { status: s === 'approved' ? 'approved' : 'rejected' }); log(who, `Reservation ${s}`, `${x.requester} · ${roomById(state, x.roomId)?.name}`) }
    function add(e: FormEvent<HTMLFormElement>) {
      e.preventDefault(); const fd = new FormData(e.currentTarget); const room = roomById(state, String(fd.get('room')))!
      const x: Reservation = { id: uid('rs'), roomId: room.id, requester: String(fd.get('requester')), date: String(fd.get('date')), start: String(fd.get('start')), end: String(fd.get('end')), status: 'requested', purpose: String(fd.get('purpose')), external: fd.get('external') === 'on', fee: fd.get('external') === 'on' ? room.rentalRate : 0, deposit: fd.get('external') === 'on' ? Math.round(room.rentalRate * 0.3) : 0, paid: false }
      upsert('reservations', x); upsert('approvals', { id: uid('ap'), kind: 'reservation', title: `${room.name}: ${x.requester}`, requester: x.external ? 'External' : 'Internal', amount: x.fee, status: 'pending', createdAt: todayIso(), relatedId: x.id, relatedModule: 'facilities' })
      log(who, 'Reservation requested', `${x.requester} · ${room.name}`); setAdding(false)
    }
    return (
      <div className="mt-4">
        <div className="flex justify-end mb-3"><Button size="sm" icon={<Plus size={14} />} onClick={() => setAdding(true)}>New reservation</Button></div>
        <div className="grid gap-3">
          {list.map((x) => { const conflict = state.events.find((e) => e.roomId === x.roomId && e.date === x.date && e.start < x.end && x.start < e.end && e.id !== x.eventId); return (
            <article key={x.id} className="card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2"><Badge tone={x.status === 'requested' ? 'gold' : x.status === 'approved' ? 'success' : 'danger'} className="capitalize">{x.status}</Badge><Badge>{roomById(state, x.roomId)?.name}</Badge>{x.external && <Badge tone="royal">Rental</Badge>}{conflict && x.status === 'requested' && <Badge tone="danger"><AlertTriangle size={11} /> Conflicts with {conflict.title}</Badge>}</div>
                <p className="font-semibold mt-1.5">{x.requester}</p>
                <p className="text-sm text-slate">{x.purpose} · {fmtShort(x.date)}, {fmtTime(x.start)} to {fmtTime(x.end)}{x.fee ? ` · ${money(x.fee)} fee, ${money(x.deposit ?? 0)} deposit ${x.paid ? '(paid)' : '(unpaid)'}` : ''}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {x.status === 'requested' && can.approveOps(r) && <><Button size="sm" variant="outline" icon={<X size={14} />} onClick={() => decide(x, 'declined')}>Decline</Button><Button size="sm" icon={<Check size={14} />} onClick={() => decide(x, 'approved')}>Approve</Button></>}
                {x.status === 'approved' && x.external && !x.paid && <Button size="sm" variant="outline" icon={<DollarSign size={14} />} onClick={() => { patch('reservations', x.id, { paid: true }); upsert('gifts', { id: uid('g'), donorName: x.requester, amount: (x.fee ?? 0) + (x.deposit ?? 0), fundId: 'f_building', method: 'card', date: todayIso(), status: 'recorded' }); log(who, 'Rental invoice paid', x.requester) }}>Record payment</Button>}
              </div>
            </article>
          ) })}
        </div>
        <Modal open={adding} onClose={() => setAdding(false)} title="Reserve a room" size="sm">
          <form onSubmit={add} className="grid gap-3">
            <Input name="requester" label="Requester" required /><Select name="room" label="Room">{state.rooms.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</Select>
            <Input name="date" type="date" label="Date" required /><div className="grid grid-cols-2 gap-3"><Input name="start" type="time" label="Start" defaultValue="18:00" /><Input name="end" type="time" label="End" defaultValue="20:00" /></div>
            <Textarea name="purpose" label="Purpose" /><label className="text-sm inline-flex items-center gap-2"><input type="checkbox" name="external" className="accent-[#4B2A7B]" /> External rental (fee and deposit apply)</label>
            <div className="flex justify-end gap-2 pt-2"><Button variant="ghost" onClick={() => setAdding(false)}>Cancel</Button><Button type="submit">Submit</Button></div>
          </form>
        </Modal>
      </div>
    )
  }

  function MaintenanceList() {
    const [adding, setAdding] = useState(false)
    const list = [...state.maintenance].sort((a, b) => (a.status === 'done' ? 1 : 0) - (b.status === 'done' ? 1 : 0) || ['urgent', 'high', 'normal', 'low'].indexOf(a.priority) - ['urgent', 'high', 'normal', 'low'].indexOf(b.priority))
    function add(e: FormEvent<HTMLFormElement>) {
      e.preventDefault(); const fd = new FormData(e.currentTarget)
      const m: Maintenance = { id: uid('mt'), area: String(fd.get('area')), title: String(fd.get('title')), priority: String(fd.get('priority')) as Maintenance['priority'], status: 'open', reportedBy: who, date: todayIso() }
      upsert('maintenance', m)
      upsert('drafts', { id: uid('dr'), agentId: 'facilities', title: `Work order: ${m.title}`, kind: 'Work order', module: 'facilities', reviewerRole: 'admin', status: 'pending', createdAt: todayIso(), body: `Area: ${m.area}\nPriority: ${m.priority}\nReported by: ${who}\n\nSuggested vendor: ${m.area.toLowerCase().includes('hvac') || m.title.toLowerCase().includes('hvac') ? 'James River Mechanical' : m.title.toLowerCase().includes('roof') ? 'Commonwealth Roofing' : 'Maurice Freeman (facilities contractor)'}\nNext step: confirm scope and request a quote.` })
      log(who, 'Reported maintenance', m.title); setAdding(false)
    }
    const next: Record<Maintenance['status'], Maintenance['status'] | null> = { open: 'assigned', assigned: 'scheduled', scheduled: 'done', done: null }
    return (
      <div className="mt-4">
        <div className="flex justify-end mb-3"><Button size="sm" icon={<Plus size={14} />} onClick={() => setAdding(true)}>Report an issue</Button></div>
        <div className="grid gap-3">
          {list.map((m) => (
            <article key={m.id} className="card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2"><Badge tone={prioTone[m.priority]} className="capitalize">{m.priority}</Badge><Badge tone={m.status === 'done' ? 'success' : 'neutral'} className="capitalize">{m.status}</Badge><span className="stamp">{m.area} · {relDays(m.date)}</span></div>
                <p className="font-semibold mt-1.5">{m.title}</p>
                <p className="text-sm text-slate">Reported by {m.reportedBy}{m.vendor ? ` · Vendor: ${m.vendor}` : ''}{m.cost ? ` · ${money(m.cost)}` : ''}{m.cost && m.cost > 2500 ? ' · Board approval threshold' : ''}</p>
              </div>
              {next[m.status] && can.approveOps(r) && <Button size="sm" variant="outline" onClick={() => { patch('maintenance', m.id, { status: next[m.status]!, ...(next[m.status] === 'assigned' && !m.vendor ? { vendor: 'Maurice Freeman' } : {}) }); log(who, `Maintenance ${next[m.status]}`, m.title) }}>Mark {next[m.status]}</Button>}
            </article>
          ))}
        </div>
        <Modal open={adding} onClose={() => setAdding(false)} title="Report a maintenance issue" size="sm">
          <form onSubmit={add} className="grid gap-3">
            <Input name="title" label="What needs attention?" required /><Select name="area" label="Area">{state.rooms.map((x) => <option key={x.id}>{x.name}</option>)}<option>Parking lot</option><option>Exterior</option></Select>
            <Select name="priority" label="Priority" defaultValue="normal"><option>low</option><option>normal</option><option>high</option><option>urgent</option></Select>
            <p className="text-xs text-slate">The Facilities Agent opens a work-order draft with a suggested vendor for the Executive Administrator to approve.</p>
            <div className="flex justify-end gap-2 pt-2"><Button variant="ghost" onClick={() => setAdding(false)}>Cancel</Button><Button type="submit">Submit</Button></div>
          </form>
        </Modal>
      </div>
    )
  }
}
