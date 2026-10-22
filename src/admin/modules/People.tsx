import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Users, ShieldCheck, Clock, CalendarCheck, Plus, Check, Lock, AlertTriangle } from 'lucide-react'
import { useDemo } from '@/data/store'
import { personName, openShifts, sum, can } from '@/data/selectors'
import { fmtShort, fmtLong, fmtDate, todayIso } from '@/data/dates'
import type { Staff, Shift } from '@/data/types'
import { uid } from '@/data/ids'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Input, Select } from '@/components/Field'
import { Tabs } from '@/components/Tabs'
import { Modal } from '@/components/Modal'
import { PageHeader, Kpi, Panel } from '../layout/shared'

type Tab = 'directory' | 'schedule' | 'compliance' | 'hours'
const bgTone = { clear: 'success', pending: 'warning', expired: 'danger', 'n/a': 'neutral' } as const
const checklist = ['Application received', 'Background check consent signed', 'Background check cleared', 'Safeguarding training complete', 'Ministry leader orientation', 'Added to schedule']

export function People() {
  const { state, patch, upsert, log } = useDemo()
  useDocumentMeta('People & Volunteers | Saint Paul’s Everywhere')
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'directory'
  const who = personName(state, state.currentMemberId)
  const r = state.role
  const [adding, setAdding] = useState(false)
  const flagged = state.staff.filter((s) => s.bgCheck === 'pending' || s.bgCheck === 'expired')
  const volunteers = state.staff.filter((s) => s.type === 'volunteer')
  const visible = r === 'volunteer' ? state.staff.filter((s) => s.type === 'volunteer') : state.staff

  function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const fd = new FormData(e.currentTarget)
    const s: Staff = { id: uid('s'), name: String(fd.get('name')), title: String(fd.get('title')), type: String(fd.get('type')) as Staff['type'], ministryIds: [String(fd.get('ministry'))], bgCheck: 'pending', trainings: [], hoursThisMonth: 0, email: String(fd.get('email') ?? ''), startDate: todayIso() }
    upsert('staff', s)
    upsert('approvals', { id: uid('ap'), kind: 'hire', title: `${s.title}: ${s.name} (background check pending)`, requester: state.ministries.find((m) => m.id === s.ministryIds[0])?.name ?? 'Ministry', status: 'pending', createdAt: todayIso(), relatedId: s.id, relatedModule: 'people' })
    log(who, 'Added person to roster', s.name); setAdding(false)
  }

  return (
    <>
      <PageHeader eyebrow="Module 7" title="Human Resources & Volunteer Management" text="Paid staff, part-time workers, contractors and volunteers, with background checks, trainings, schedules and hours in one controlled place." actions={<Button icon={<Plus size={16} />} onClick={() => setAdding(true)} disabled={r === 'volunteer'}>Add to roster</Button>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Kpi label="On roster" value={state.staff.length} sub={`${volunteers.length} volunteers · ${state.staff.filter((s) => s.type !== 'volunteer').length} staff and contractors`} icon={Users} tone="midnight" />
        <Kpi label="Open shifts" value={openShifts(state).length} sub="Next four Sundays" icon={CalendarCheck} to="/admin/people?tab=schedule" />
        <Kpi label="Background checks flagged" value={flagged.length} sub={`${flagged.filter((s) => s.bgCheck === 'expired').length} expired`} icon={ShieldCheck} to="/admin/people?tab=compliance" />
        <Kpi label="Volunteer hours (month)" value={sum(volunteers.map((v) => v.hoursThisMonth))} icon={Clock} to="/admin/people?tab=hours" />
      </div>
      <Tabs className="mt-6" value={tab} onChange={(t) => setParams({ tab: t })} items={[{ id: 'directory', label: 'Directory' }, { id: 'schedule', label: 'Schedule', count: openShifts(state).length }, { id: 'compliance', label: 'Compliance', count: flagged.length }, { id: 'hours', label: 'Hours' }]} />

      {tab === 'directory' && (
        <div className="mt-4 card divide-y divide-line">
          {visible.map((s) => (
            <div key={s.id} className="p-3 flex items-center gap-3 text-sm">
              <span className="h-9 w-9 rounded-full bg-midnight text-gold-light flex items-center justify-center text-xs font-semibold shrink-0">{s.name.split(' ').filter((w) => !w.includes('.')).map((w) => w[0]).slice(0, 2).join('')}</span>
              <span className="flex-1 min-w-0"><span className="block font-medium truncate">{s.name}</span><span className="block text-xs text-slate truncate">{s.title} · {s.ministryIds.map((id) => state.ministries.find((m) => m.id === id)?.name).join(', ') || 'Church-wide'}{r !== 'volunteer' && s.email ? ` · ${s.email}` : ''}</span></span>
              <Badge className="capitalize hidden sm:inline-flex">{s.type}</Badge>
              <Badge tone={bgTone[s.bgCheck]} className="capitalize">{s.bgCheck === 'n/a' ? 'No check needed' : `Check ${s.bgCheck}`}</Badge>
            </div>
          ))}
          {r === 'volunteer' && <p className="p-3 text-xs text-slate flex items-center gap-1.5"><Lock size={12} /> Volunteers see fellow volunteers only, without contact details.</p>}
        </div>
      )}

      {tab === 'schedule' && <Schedule />}

      {tab === 'compliance' && (
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className="grid gap-3">
            {state.staff.filter((s) => s.bgCheck !== 'n/a').sort((a, b) => ['expired', 'pending', 'clear'].indexOf(a.bgCheck) - ['expired', 'pending', 'clear'].indexOf(b.bgCheck)).map((s) => (
              <article key={s.id} className="card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><Badge tone={bgTone[s.bgCheck]} className="capitalize">{s.bgCheck}</Badge>{s.bgCheck === 'expired' && <Badge tone="danger"><AlertTriangle size={11} /> Remove from youth-facing shifts</Badge>}<span className="stamp">{s.bgCheckDate ? `Checked ${fmtDate(s.bgCheckDate)}` : 'Not yet checked'}</span></div>
                  <p className="font-semibold mt-1.5">{s.name} <span className="text-slate font-normal text-sm">· {s.title}</span></p>
                  <p className="text-xs text-slate">Trainings: {s.trainings.join(', ') || 'none recorded'}</p>
                </div>
                {s.bgCheck !== 'clear' && can.approveOps(r) && <Button size="sm" icon={<Check size={14} />} onClick={() => { patch('staff', s.id, { bgCheck: 'clear', bgCheckDate: todayIso() }); const ap = state.approvals.find((a) => a.relatedId === s.id); if (ap) patch('approvals', ap.id, { status: 'approved' }); log(who, 'Background check cleared', s.name) }}>Mark cleared</Button>}
                {s.bgCheck === 'clear' && !s.trainings.includes('Safeguarding') && can.approveOps(r) && <Button size="sm" variant="outline" onClick={() => { patch('staff', s.id, { trainings: [...s.trainings, 'Safeguarding'] }); log(who, 'Recorded training', `${s.name}: Safeguarding`) }}>Record safeguarding training</Button>}
              </article>
            ))}
          </div>
          <Panel title="Onboarding checklist" subtitle="Required before any youth- or senior-facing assignment">
            <ol className="space-y-2 text-sm">{checklist.map((c, i) => <li key={c} className="flex items-center gap-2"><span className="h-6 w-6 shrink-0 rounded-full bg-linen text-slate font-mono text-xs flex items-center justify-center">{i + 1}</span>{c}</li>)}</ol>
            <p className="text-xs text-slate mt-4">Background checks run through Checkr in the connected platform (about 3 business days). Payroll hours sync to Gusto for employees.</p>
          </Panel>
        </div>
      )}

      {tab === 'hours' && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Panel title="Volunteer hours this month" subtitle={`${sum(volunteers.map((v) => v.hoursThisMonth))} hours across ${volunteers.length} volunteers`}>
            <ul className="space-y-2 text-sm">{volunteers.sort((a, b) => b.hoursThisMonth - a.hoursThisMonth).map((v) => <li key={v.id}><div className="flex justify-between"><span>{v.name}</span><span className="font-mono">{v.hoursThisMonth} h</span></div><div className="mt-1 h-1.5 rounded-full bg-linen overflow-hidden"><div className="h-full bg-gold" style={{ width: `${(v.hoursThisMonth / Math.max(...volunteers.map((x) => x.hoursThisMonth))) * 100}%` }} /></div></li>)}</ul>
          </Panel>
          <Panel title="Staff and contractor hours" subtitle="Feeds payroll and contractor invoices">
            <ul className="divide-y divide-line text-sm">{state.staff.filter((s) => s.type !== 'volunteer').map((s) => <li key={s.id} className="py-2 flex justify-between"><span>{s.name} <span className="text-slate text-xs">· {s.type}</span></span><span className="font-mono">{s.hoursThisMonth} h</span></li>)}</ul>
            <p className="text-xs text-slate mt-3">Volunteer hours also appear in the church impact summary and each member's portal.</p>
          </Panel>
        </div>
      )}

      <Modal open={adding} onClose={() => setAdding(false)} title="Add to roster" size="sm">
        <form onSubmit={add} className="grid gap-3">
          <Input name="name" label="Name" required /><Input name="title" label="Role title" required placeholder="Greeter, Van driver, Youth volunteer" />
          <Select name="type" label="Type" defaultValue="volunteer"><option value="volunteer">Volunteer</option><option value="part-time">Part-time staff</option><option value="employee">Employee</option><option value="contractor">Contractor</option></Select>
          <Select name="ministry" label="Ministry">{state.ministries.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</Select>
          <Input name="email" type="email" label="Email" />
          <p className="text-xs text-slate">A background check is requested automatically and an approval is routed to the Executive Administrator.</p>
          <div className="flex justify-end gap-2 pt-2"><Button variant="ghost" onClick={() => setAdding(false)}>Cancel</Button><Button type="submit">Add</Button></div>
        </form>
      </Modal>
    </>
  )

  function Schedule() {
    const dates = Array.from(new Set(state.shifts.map((s) => s.date))).sort()
    const [assign, setAssign] = useState<Shift | null>(null)
    const eligible = (s: Shift) => state.staff.filter((x) => x.ministryIds.includes(s.ministryId) && x.bgCheck === 'clear')
    return (
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dates.map((d) => (
          <div key={d} className="card p-3">
            <p className="font-semibold text-sm px-1">{fmtLong(d)}</p>
            <ul className="mt-2 space-y-2">
              {state.shifts.filter((s) => s.date === d).map((s) => (
                <li key={s.id} className="rounded-lg border border-line p-2.5 text-sm">
                  <div className="flex items-center justify-between gap-2"><span className="font-medium">{s.role}</span><Badge tone={s.status === 'open' ? 'gold' : s.status === 'confirmed' ? 'success' : 'royal'} className="capitalize">{s.status}</Badge></div>
                  <p className="text-xs text-slate">{state.ministries.find((m) => m.id === s.ministryId)?.name}</p>
                  {s.staffId ? <p className="text-xs mt-1">{personName(state, s.staffId)}</p> : r !== 'volunteer' ? <Button size="sm" variant="outline" className="mt-2 w-full" onClick={() => setAssign(s)}>Assign</Button> : <p className="text-xs text-slate mt-1">Open shift</p>}
                  {s.status === 'filled' && s.staffId && <Button size="sm" variant="ghost" className="mt-1 w-full" onClick={() => { patch('shifts', s.id, { status: 'confirmed' }); log(who, 'Confirmed shift', `${s.role} ${fmtShort(s.date)}`) }}>Confirm</Button>}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <Modal open={!!assign} onClose={() => setAssign(null)} title={assign ? `Assign: ${assign.role}` : ''} size="sm">
          {assign && (
            <div className="grid gap-2">
              <p className="text-xs text-slate">Only people with a cleared background check in this ministry are eligible.</p>
              {eligible(assign).map((x) => <Button key={x.id} variant="outline" className="justify-between" onClick={() => { patch('shifts', assign.id, { staffId: x.id, status: 'filled' }); log(who, 'Assigned shift', `${x.name} → ${assign.role}`); setAssign(null) }}>{x.name} <span className="text-xs text-slate">{x.hoursThisMonth} h this month</span></Button>)}
              {eligible(assign).length === 0 && <p className="text-sm text-slate">Nobody eligible yet. Add volunteers to this ministry and clear their background checks.</p>}
            </div>
          )}
        </Modal>
      </div>
    )
  }
}
