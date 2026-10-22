import { useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, UserPlus, Phone, Mail, MapPin, Lock, Check, HandHeart, Users, ArrowRight } from 'lucide-react'
import { useDemo } from '@/data/store'
import { fullName, visitors, needsFollowUp, newVisitorsNoContact, can, sum, personName, openCare } from '@/data/selectors'
import { fmtDate, fmtShort, money, relDays, todayIso } from '@/data/dates'
import type { Member, MemberStatus, CareRequest } from '@/data/types'
import { uid } from '@/data/ids'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Button } from '@/components/Button'
import { Badge, type Tone } from '@/components/Badge'
import { Input, Select, Textarea } from '@/components/Field'
import { Tabs } from '@/components/Tabs'
import { Drawer } from '@/components/Drawer'
import { Modal } from '@/components/Modal'
import { Table, type Column, type SortState, sortRows } from '@/components/Table'
import { PageHeader, Kpi, Row, Restricted } from '../layout/shared'
import { useActions } from '../actions'

type Tab = 'directory' | 'visitors' | 'care'
const statusTone: Record<MemberStatus, Tone> = { member: 'success', attendee: 'royal', visitor: 'gold', inactive: 'neutral' }

export function Members() {
  const { state, upsert, patch, log } = useDemo()
  useDocumentMeta('Members | Saint Paul’s Everywhere')
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'directory'
  const openId = params.get('open')
  const filter = params.get('filter') ?? 'all'
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<SortState>({ key: 'name', dir: 'asc' })
  const [adding, setAdding] = useState(false)
  const r = state.role
  const { logContact } = useActions()

  const rows = useMemo(() => {
    let list = state.members
    if (filter === 'visitor') list = visitors(state)
    else if (filter === 'followup') list = needsFollowUp(state)
    else if (filter !== 'all') list = list.filter((m) => m.status === filter)
    const t = q.toLowerCase()
    if (t) list = list.filter((m) => (fullName(m) + m.email + m.phone + m.tags.join(' ')).toLowerCase().includes(t))
    return list
  }, [state, filter, q])

  const cols: Column<Member>[] = [
    { key: 'name', header: 'Name', render: (m) => <span className="flex items-center gap-2"><span className="h-8 w-8 rounded-full bg-midnight text-gold-light flex items-center justify-center text-xs font-semibold shrink-0">{m.first[0]}{m.last[0]}</span><span><span className="block font-medium">{fullName(m)}</span><span className="block text-xs text-slate">{m.email}</span></span></span>, sortValue: (m) => m.last + m.first },
    { key: 'status', header: 'Status', render: (m) => <Badge tone={statusTone[m.status]} className="capitalize">{m.status}</Badge>, sortValue: (m) => m.status },
    { key: 'ministries', header: 'Ministries', render: (m) => <span className="text-xs">{m.ministryIds.map((id) => state.ministries.find((x) => x.id === id)?.name).filter(Boolean).join(', ') || '—'}</span>, hideBelow: 'lg' },
    { key: 'contact', header: 'Last contact', render: (m) => <span className={!m.lastContact || relDays(m.lastContact).includes('ago') && Number(relDays(m.lastContact).split(' ')[0]) > 90 ? 'text-danger' : ''}>{relDays(m.lastContact)}</span>, sortValue: (m) => m.lastContact || '0000', hideBelow: 'md' },
    { key: 'tags', header: 'Tags', render: (m) => <span className="flex flex-wrap gap-1">{m.tags.map((t) => <Badge key={t}>{t}</Badge>)}</span>, hideBelow: 'sm' },
  ]
  const open = state.members.find((m) => m.id === openId)

  function addMember(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const first = String(fd.get('first')).trim(); const last = String(fd.get('last')).trim(); const email = String(fd.get('email')).trim()
    if (!first || !last) return
    const dup = state.members.find((m) => m.email && m.email.toLowerCase() === email.toLowerCase() && email)
    if (dup) { setParams({ open: dup.id }); setAdding(false); return }
    const hh = { id: uid('hh'), name: `${last} Household`, address: String(fd.get('address') ?? '') }
    upsert('households', hh)
    const m: Member = { id: uid('m'), first, last, email, phone: String(fd.get('phone') ?? ''), householdId: hh.id, status: String(fd.get('status')) as MemberStatus, joinedAt: '', firstVisit: todayIso(), ministryIds: [], tags: ['Added manually'], consent: { email: true, sms: false }, lastContact: todayIso(), address: hh.address, notes: '', volunteerInterests: [] }
    upsert('members', m)
    if (m.status === 'visitor') upsert('tasks', { id: uid('t'), title: `Welcome call: ${first} ${last}`, assigneeId: 'm_4', due: todayIso(), status: 'todo', module: 'members', priority: 'high' })
    log(personName(state, state.currentMemberId), 'Added person', `${first} ${last}`)
    setAdding(false); setParams({ open: m.id })
  }

  return (
    <>
      <PageHeader eyebrow="Module 1" title="Membership & Household CRM" text="Every member, family, visitor and ministry participant in one searchable record. Visitors become attendees become members without anyone falling through." actions={<Button icon={<UserPlus size={16} />} onClick={() => setAdding(true)}>Add person</Button>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Kpi label="Members and attendees" value={state.members.filter((m) => m.status === 'member' || m.status === 'attendee').length} icon={Users} tone="midnight" />
        <Kpi label="Visitors in pipeline" value={visitors(state).length} sub={`${newVisitorsNoContact(state).length} not yet contacted`} icon={UserPlus} to="/admin/members?tab=visitors" />
        <Kpi label="Needs follow-up" value={needsFollowUp(state).length} sub="No contact in 90+ days" to="/admin/members?filter=followup" />
        <Kpi label="Open care requests" value={openCare(state).length} icon={HandHeart} to="/admin/members?tab=care" />
      </div>
      <Tabs className="mt-6" value={tab} onChange={(t) => setParams({ tab: t })} items={[{ id: 'directory', label: 'Directory', count: state.members.length }, { id: 'visitors', label: 'Visitor pipeline', count: visitors(state).length }, { id: 'care', label: 'Pastoral care', count: openCare(state).length }]} />

      {tab === 'directory' && (
        <>
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Input className="flex-1" placeholder="Search by name, email, phone or tag" value={q} onChange={(e) => setQ(e.target.value)} trailing={<Search size={16} className="text-slate mr-2" />} aria-label="Search members" />
            <Select value={filter} onChange={(e) => setParams({ tab: 'directory', filter: e.target.value })} aria-label="Filter" className="sm:w-56">
              <option value="all">All people</option><option value="member">Members</option><option value="attendee">Attendees</option><option value="visitor">Visitors</option><option value="inactive">Inactive</option><option value="followup">Needs follow-up</option>
            </Select>
          </div>
          <div className="mt-3"><Table columns={cols} rows={sortRows(rows, cols, sort)} rowKey={(m) => m.id} onRowClick={(m) => setParams({ tab: 'directory', filter, open: m.id })} sort={sort} onSort={setSort} caption="Members directory" /></div>
        </>
      )}

      {tab === 'visitors' && <VisitorPipeline onOpen={(id) => setParams({ tab: 'visitors', open: id })} />}
      {tab === 'care' && (can.seeConfidentialCare(r) || r === 'secretary' || r === 'support' ? <CareQueue /> : <div className="mt-4"><Restricted what="pastoral care records" /></div>)}

      <Drawer open={!!open} onClose={() => setParams({ tab, filter })} title={open ? fullName(open) : ''} subtitle={open && <span className="flex flex-wrap gap-1.5 items-center"><Badge tone={statusTone[open.status]} className="capitalize">{open.status}</Badge>{open.tags.map((t) => <Badge key={t}>{t}</Badge>)}</span>} wide>
        {open && <MemberDetail m={open} onLog={(note) => logContact(open.id, note)} onStatus={(s) => { patch('members', open.id, { status: s, ...(s === 'member' && !open.joinedAt ? { joinedAt: todayIso() } : {}) }); log(personName(state, state.currentMemberId), 'Changed status', `${fullName(open)} → ${s}`) }} />}
      </Drawer>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add a person">
        <form onSubmit={addMember} className="grid gap-3 sm:grid-cols-2">
          <Input name="first" label="First name" required /><Input name="last" label="Last name" required />
          <Input name="email" type="email" label="Email" hint="(checked for duplicates)" /><Input name="phone" type="tel" label="Phone" />
          <Input name="address" label="Address" className="sm:col-span-2" />
          <Select name="status" label="Status" defaultValue="visitor"><option value="visitor">Visitor</option><option value="attendee">Attendee</option><option value="member">Member</option></Select>
          <div className="sm:col-span-2 flex justify-end gap-2 pt-2"><Button variant="ghost" onClick={() => setAdding(false)}>Cancel</Button><Button type="submit">Save</Button></div>
          <p className="sm:col-span-2 text-xs text-slate">Visitors automatically get a welcome-call task for the hospitality team and a welcome letter draft from the Member Agent.</p>
        </form>
      </Modal>
    </>
  )
}

function MemberDetail({ m, onLog, onStatus }: { m: Member; onLog: (note: string) => void; onStatus: (s: MemberStatus) => void }) {
  const { state } = useDemo()
  const r = state.role
  const [note, setNote] = useState('')
  const household = state.members.filter((x) => x.householdId === m.householdId && x.id !== m.id)
  const gifts = state.gifts.filter((g) => g.memberId === m.id).sort((a, b) => b.date.localeCompare(a.date))
  const ytd = sum(gifts.filter((g) => g.date.startsWith(todayIso().slice(0, 4))).map((g) => g.amount))
  const regs = state.registrations.filter((x) => x.memberId === m.id)
  const care = state.care.filter((c) => c.memberId === m.id)
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="stamp mb-1">Contact</p>
          <p className="text-sm flex items-center gap-2"><Mail size={14} className="text-slate" /> {m.email || '—'}</p>
          <p className="text-sm flex items-center gap-2 mt-1"><Phone size={14} className="text-slate" /> {m.phone || '—'}</p>
          <p className="text-sm flex items-center gap-2 mt-1"><MapPin size={14} className="text-slate" /> {m.address}</p>
          <p className="text-xs text-slate mt-2">Consent: email {m.consent.email ? 'yes' : 'no'} · SMS {m.consent.sms ? 'yes' : 'no'}</p>
        </div>
        <dl>
          <Row label="Household">{state.households.find((h) => h.id === m.householdId)?.name} {household.length ? `(+${household.length})` : ''}</Row>
          <Row label="First visit">{fmtDate(m.firstVisit)}</Row>
          <Row label="Member since">{m.joinedAt ? fmtDate(m.joinedAt) : '—'}</Row>
          <Row label="Last contact">{relDays(m.lastContact)}</Row>
          <Row label="Ministries">{m.ministryIds.map((id) => state.ministries.find((x) => x.id === id)?.name).join(', ') || '—'}</Row>
          <Row label="Volunteer interests">{m.volunteerInterests.join(', ') || '—'}</Row>
        </dl>
      </div>
      <div>
        <p className="stamp mb-2">Status</p>
        <div className="flex flex-wrap gap-2">{(['visitor', 'attendee', 'member', 'inactive'] as MemberStatus[]).map((s) => <Button key={s} size="sm" variant={m.status === s ? 'dark' : 'outline'} onClick={() => onStatus(s)} className="capitalize">{s}</Button>)}</div>
      </div>
      <div>
        <p className="stamp mb-2">Giving</p>
        {can.seeGivingDetail(r) ? (
          <><p className="text-sm">{money(ytd)} year to date across {gifts.length} gifts total.</p><ul className="mt-2 divide-y divide-line text-sm">{gifts.slice(0, 5).map((g) => <li key={g.id} className="py-1.5 flex justify-between"><span>{fmtShort(g.date)} · {state.funds.find((f) => f.id === g.fundId)?.name}</span><span className="font-mono">{money(g.amount)}</span></li>)}</ul></>
        ) : can.seeGivingSummary(r) ? <p className="text-sm text-slate">Summary only for your role: {gifts.length ? 'active giver' : 'no recorded gifts'}.</p> : <p className="text-sm text-slate flex items-center gap-1.5"><Lock size={13} /> Giving history is restricted to the Finance Office and Executive Administrator.</p>}
      </div>
      <div>
        <p className="stamp mb-2">Events</p>
        <ul className="text-sm space-y-1">{regs.map((x) => <li key={x.id}>{state.events.find((e) => e.id === x.eventId)?.title} · {x.qty} {x.qty === 1 ? 'seat' : 'seats'}</li>)}{regs.length === 0 && <li className="text-slate">No registrations.</li>}</ul>
      </div>
      <div>
        <p className="stamp mb-2">Pastoral care</p>
        {can.seeConfidentialCare(r) ? <ul className="text-sm space-y-1.5">{care.map((c) => <li key={c.id} className="rounded-lg bg-linen p-2.5"><span className="capitalize font-medium">{c.kind}</span> · {fmtShort(c.date)} · <span className="capitalize">{c.status}</span><p className="text-slate mt-0.5">{c.text}</p></li>)}{care.length === 0 && <li className="text-slate">No care requests.</li>}</ul> : <p className="text-sm text-slate flex items-center gap-1.5"><Lock size={13} /> {care.length} confidential record(s). Visible to the Pastor and Executive Administrator only.</p>}
      </div>
      <div>
        <p className="stamp mb-2">Log a contact</p>
        <div className="flex gap-2"><Input className="flex-1" placeholder="Called about Sunday visit, left voicemail" value={note} onChange={(e) => setNote(e.target.value)} aria-label="Contact note" /><Button onClick={() => { if (note.trim()) { onLog(note.trim()); setNote('') } }} icon={<Check size={14} />}>Log</Button></div>
        {m.notes && <pre className="mt-2 text-xs text-slate whitespace-pre-wrap font-sans">{m.notes}</pre>}
      </div>
    </div>
  )
}

function VisitorPipeline({ onOpen }: { onOpen: (id: string) => void }) {
  const { state } = useDemo()
  const { logContact } = useActions()
  const stages: { id: string; label: string; test: (m: Member) => boolean }[] = [
    { id: 'new', label: 'New visitor, no contact', test: (m) => m.status === 'visitor' && !m.lastContact },
    { id: 'contacted', label: 'Contacted', test: (m) => m.status === 'visitor' && !!m.lastContact },
    { id: 'attending', label: 'Attending regularly', test: (m) => m.status === 'attendee' },
    { id: 'orientation', label: 'In orientation', test: (m) => state.registrations.some((r) => r.eventId === 'e_3' && r.memberId === m.id) && m.status !== 'member' },
  ]
  return (
    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {stages.map((s) => {
        const list = state.members.filter(s.test)
        return (
          <div key={s.id} className="card p-3">
            <div className="flex items-center justify-between px-1"><p className="font-semibold text-sm">{s.label}</p><Badge tone="gold">{list.length}</Badge></div>
            <ul className="mt-2 space-y-2">
              {list.map((m) => (
                <li key={m.id} className="rounded-lg border border-line p-2.5">
                  <button type="button" onClick={() => onOpen(m.id)} className="text-left w-full"><p className="font-medium text-sm">{fullName(m)}</p><p className="text-xs text-slate">First visit {fmtShort(m.firstVisit)} · {m.phone}</p></button>
                  {s.id === 'new' && <Button size="sm" variant="outline" className="mt-2 w-full" icon={<Phone size={13} />} onClick={() => logContact(m.id, 'Welcome call completed')}>Log welcome call</Button>}
                </li>
              ))}
              {list.length === 0 && <li className="text-xs text-slate px-1 py-3">Nobody here right now.</li>}
            </ul>
          </div>
        )
      })}
      <p className="md:col-span-2 xl:col-span-4 text-xs text-slate flex items-center gap-1.5">Website visitor forms create records here automatically and assign the welcome team <ArrowRight size={12} /> the Member Agent drafts the letter.</p>
    </div>
  )
}

function CareQueue() {
  const { state, patch, log } = useDemo()
  const r = state.role
  const [open, setOpen] = useState<CareRequest | null>(null)
  const [note, setNote] = useState('')
  const list = state.care.filter((c) => can.seeConfidentialCare(r) || !c.confidential).sort((a, b) => (a.status === 'closed' ? 1 : 0) - (b.status === 'closed' ? 1 : 0) || b.date.localeCompare(a.date))
  const hidden = state.care.length - list.length
  const who = personName(state, state.currentMemberId)
  function update(c: CareRequest, p: Partial<CareRequest>) { patch('care', c.id, p); log(who, 'Updated care request', c.name) }
  return (
    <div className="mt-4">
      {hidden > 0 && <p className="text-xs text-slate mb-3 flex items-center gap-1.5"><Lock size={12} /> {hidden} confidential request(s) hidden from your role.</p>}
      <div className="grid gap-3">
        {list.map((c) => (
          <article key={c.id} className="card p-4 flex flex-col sm:flex-row sm:items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2"><Badge tone="royal" className="capitalize">{c.kind}</Badge><Badge tone={c.status === 'new' ? 'gold' : c.status === 'closed' ? 'success' : 'neutral'} className="capitalize">{c.status.replace('-', ' ')}</Badge>{c.confidential && <Badge><Lock size={11} /> Confidential</Badge>}<span className="stamp">{relDays(c.date)}</span></div>
              <p className="font-semibold mt-1.5">{c.name} <span className="text-slate font-normal text-sm">· {c.contact}</span></p>
              <p className="text-sm mt-1">{c.text}</p>
              <p className="text-xs text-slate mt-1">{c.assigneeId ? `Assigned to ${personName(state, c.assigneeId)}` : 'Unassigned'}{c.updates.length ? ` · ${c.updates.length} update(s)` : ''}</p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              {!c.assigneeId && <Button size="sm" variant="outline" onClick={() => update(c, { assigneeId: c.kind === 'assistance' ? 'm_7' : 'm_1', status: 'assigned' })}>Assign to {c.kind === 'assistance' ? 'Outreach' : 'Pastor'}</Button>}
              {c.status !== 'closed' && <Button size="sm" variant="outline" onClick={() => setOpen(c)}>Add update</Button>}
              {c.status !== 'closed' && <Button size="sm" onClick={() => update(c, { status: 'closed' })} icon={<Check size={14} />}>Close</Button>}
            </div>
          </article>
        ))}
      </div>
      <Modal open={!!open} onClose={() => setOpen(null)} title="Add an update" size="sm" footer={<><Button variant="ghost" onClick={() => setOpen(null)}>Cancel</Button><Button onClick={() => { if (open && note.trim()) { update(open, { status: 'in-progress', updates: [...open.updates, { date: todayIso(), note: note.trim() }] }); setNote(''); setOpen(null) } }}>Save</Button></>}>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} label="Update" placeholder="Visited Tuesday evening. Follow-up call next week." />
      </Modal>
    </div>
  )
}
