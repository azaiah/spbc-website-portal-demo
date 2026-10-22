import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Handshake, Store, Landmark, GraduationCap, Check, Plus, Building, ArrowRight } from 'lucide-react'
import { useDemo } from '@/data/store'
import { personName, fullName, memberById, sum } from '@/data/selectors'
import { fmtShort, money, daysUntil } from '@/data/dates'
import type { Grant, Partner } from '@/data/types'
import { uid } from '@/data/ids'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Input, Select } from '@/components/Field'
import { Tabs } from '@/components/Tabs'
import { Modal } from '@/components/Modal'
import { PageHeader, Kpi, Panel, Progress } from '../layout/shared'

type Tab = 'partners' | 'directory' | 'grants' | 'programs' | 'rentals'
const grantStages: Grant['status'][] = ['identified', 'applying', 'submitted', 'awarded', 'reporting', 'declined']

export function Partners() {
  const { state, patch, upsert, log } = useDemo()
  useDocumentMeta('Business Partnerships & Revenue | Saint Paul’s Everywhere')
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'partners'
  const who = personName(state, state.currentMemberId)
  const [adding, setAdding] = useState<'partner' | 'grant' | null>(null)
  const rentals = state.reservations.filter((x) => x.external)
  const rentalRevenue = sum(rentals.filter((x) => x.status === 'approved').map((x) => x.fee ?? 0))
  const pipeline = sum(state.grants.filter((g) => g.status !== 'declined' && g.status !== 'awarded').map((g) => g.amount))

  function addPartner(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const fd = new FormData(e.currentTarget); const p: Partner = { id: uid('p'), name: String(fd.get('name')), type: String(fd.get('type')) as Partner['type'], contact: String(fd.get('contact')), status: 'prospect', notes: String(fd.get('notes') ?? '') }; upsert('partners', p); log(who, 'Added partner', p.name); setAdding(null) }
  function addGrant(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const fd = new FormData(e.currentTarget); const g: Grant = { id: uid('gr'), name: String(fd.get('name')), funder: String(fd.get('funder')), amount: Number(fd.get('amount')), deadline: String(fd.get('deadline')), status: 'identified', ownerId: state.currentMemberId }; upsert('grants', g); upsert('tasks', { id: uid('t'), title: `Grant: ${g.name} due ${fmtShort(g.deadline)}`, assigneeId: state.currentMemberId, due: g.deadline, status: 'todo', module: 'partners', priority: 'normal' }); log(who, 'Added grant opportunity', g.name); setAdding(null) }

  return (
    <>
      <PageHeader eyebrow="Module 11" title="Business Partnerships & Revenue Opportunities" text="Member-owned businesses, community partners and sponsors, workforce partnerships, facility rentals and grants. Revenue activities are reviewed for nonprofit, tax and mission compatibility." actions={<><Button variant="outline" icon={<Plus size={16} />} onClick={() => setAdding('grant')}>Add grant</Button><Button icon={<Plus size={16} />} onClick={() => setAdding('partner')}>Add partner</Button></>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Kpi label="Active partners" value={state.partners.filter((p) => p.status === 'active').length} sub={`${state.partners.filter((p) => p.status === 'prospect').length} prospects`} icon={Handshake} tone="midnight" />
        <Kpi label="Grant pipeline" value={money(pipeline)} sub={`${money(sum(state.grants.filter((g) => g.status === 'awarded').map((g) => g.amount)))} awarded`} icon={Landmark} to="/admin/partners?tab=grants" />
        <Kpi label="Member businesses" value={state.businesses.filter((b) => b.approved).length} sub={`${state.businesses.filter((b) => !b.approved).length} pending review`} icon={Store} to="/admin/partners?tab=directory" />
        <Kpi label="Rental revenue" value={money(rentalRevenue)} sub={`${rentals.length} external bookings`} icon={Building} to="/admin/partners?tab=rentals" />
      </div>
      <Tabs className="mt-6" value={tab} onChange={(t) => setParams({ tab: t })} items={[{ id: 'partners', label: 'Partner CRM' }, { id: 'directory', label: 'Business directory', count: state.businesses.filter((b) => !b.approved).length }, { id: 'grants', label: 'Grants' }, { id: 'programs', label: 'Programs' }, { id: 'rentals', label: 'Rentals' }]} />

      {tab === 'partners' && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {state.partners.map((p) => (
            <article key={p.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2"><div className="min-w-0"><h3 className="font-semibold">{p.name}</h3><p className="text-xs text-slate">{p.contact}</p></div><div className="flex flex-wrap gap-1.5"><Badge className="capitalize">{p.type}</Badge><Badge tone={p.status === 'active' ? 'success' : p.status === 'prospect' ? 'gold' : 'neutral'} className="capitalize">{p.status}</Badge></div></div>
              <p className="text-sm text-slate mt-2">{p.notes}</p>
              <div className="mt-3 flex gap-2">{p.status === 'prospect' && <Button size="sm" variant="outline" onClick={() => { patch('partners', p.id, { status: 'active' }); log(who, 'Activated partner', p.name) }}>Mark active</Button>}{p.status === 'active' && <Button size="sm" variant="ghost" onClick={() => { patch('partners', p.id, { status: 'paused' }); log(who, 'Paused partner', p.name) }}>Pause</Button>}</div>
            </article>
          ))}
        </div>
      )}

      {tab === 'directory' && (
        <div className="mt-4 card divide-y divide-line">
          {state.businesses.map((b) => <div key={b.id} className="p-3 flex flex-wrap sm:flex-nowrap items-center gap-3 text-sm"><Store size={18} className="text-royal shrink-0" /><span className="flex-1 min-w-[12rem]"><span className="block font-medium">{b.name}</span><span className="block text-xs text-slate">{b.category} · owned by {fullName(memberById(state, b.ownerMemberId))} · {b.phone}{b.website ? ` · ${b.website}` : ''}</span></span>{b.approved ? <Badge tone="success">Listed</Badge> : <Button size="sm" variant="outline" icon={<Check size={14} />} onClick={() => { patch('businesses', b.id, { approved: true }); log(who, 'Approved directory listing', b.name) }}>Approve listing</Button>}</div>)}
          <p className="p-3 text-xs text-slate">The Church Community Marketplace lists member-owned businesses on the church website once approved. Listings are optional and reviewed by leadership.</p>
        </div>
      )}

      {tab === 'grants' && (
        <div className="mt-4 overflow-x-auto pb-2 -mx-3 px-3">
          <div className="grid grid-flow-col auto-cols-[240px] gap-3 min-w-max">
            {grantStages.map((s) => (
              <div key={s} className="card p-3">
                <div className="flex items-center justify-between px-1"><p className="font-semibold text-sm capitalize">{s}</p><Badge>{state.grants.filter((g) => g.status === s).length}</Badge></div>
                <ul className="mt-2 space-y-2">
                  {state.grants.filter((g) => g.status === s).map((g) => { const d = daysUntil(g.deadline); const i = grantStages.indexOf(g.status); return (
                    <li key={g.id} className="rounded-lg border border-line p-2.5 text-sm">
                      <p className="font-medium leading-snug">{g.name}</p><p className="text-xs text-slate">{g.funder}</p><p className="font-mono text-xs mt-1">{money(g.amount)}</p>
                      <p className={`text-[13px] mt-1 ${d < 0 ? 'text-slate' : d < 14 ? 'text-danger' : 'text-slate'}`}>{d < 0 ? `Deadline passed ${fmtShort(g.deadline)}` : `Due in ${d} days`}</p>
                      {i < 4 && <Button size="sm" variant="ghost" className="mt-1 w-full justify-between" onClick={() => { patch('grants', g.id, { status: grantStages[i + 1] }); log(who, 'Advanced grant', `${g.name} → ${grantStages[i + 1]}`) }}>Advance <ArrowRight size={14} /></Button>}
                    </li>
                  ) })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'programs' && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {state.programs.map((p) => (
            <Panel key={p.id} title={p.name} subtitle={`${p.kind} · ${p.partnerId ? `with ${state.partners.find((x) => x.id === p.partnerId)?.name}` : 'church-run'} · next cohort ${fmtShort(p.nextCohort)}`}>
              <div className="grid grid-cols-3 gap-2 text-center text-sm"><div className="rounded-lg bg-linen p-2"><p className="text-[13px] text-slate">Enrolled</p><p className="font-display text-xl font-semibold">{p.enrolled}</p></div><div className="rounded-lg bg-linen p-2"><p className="text-[13px] text-slate">Completed</p><p className="font-display text-xl font-semibold">{p.completed}</p></div><div className="rounded-lg bg-linen p-2"><p className="text-[13px] text-slate">{p.placed !== undefined ? 'Placed' : 'Completion'}</p><p className="font-display text-xl font-semibold">{p.placed !== undefined ? p.placed : `${Math.round((p.completed / p.enrolled) * 100)}%`}</p></div></div>
              <Progress value={p.completed} max={p.enrolled} className="mt-3" color="bg-success" />
              <p className="text-xs text-slate mt-2 flex items-center gap-1.5"><GraduationCap size={12} /> Outcomes reported monthly to partners and funders.</p>
            </Panel>
          ))}
        </div>
      )}

      {tab === 'rentals' && (
        <div className="mt-4 card divide-y divide-line">
          {rentals.map((x) => <div key={x.id} className="p-3 flex flex-wrap sm:flex-nowrap items-center gap-x-3 gap-y-2 text-sm"><span className="flex-1 min-w-0 basis-full sm:basis-auto"><span className="block font-medium">{x.requester}</span><span className="block text-xs text-slate">{state.rooms.find((r) => r.id === x.roomId)?.name} · {fmtShort(x.date)} · {x.purpose}</span></span><span className="font-mono">{money((x.fee ?? 0) + (x.deposit ?? 0))}</span><Badge tone={x.status === 'approved' ? 'success' : x.status === 'requested' ? 'gold' : 'danger'} className="capitalize">{x.status}</Badge><Badge tone={x.paid ? 'success' : 'neutral'}>{x.paid ? 'Paid' : 'Unpaid'}</Badge></div>)}
          <p className="p-3 text-xs text-slate">Rental income posts to the Building & Facilities Fund. Utilization and revenue roll into the Reports module.</p>
        </div>
      )}

      <Modal open={adding === 'partner'} onClose={() => setAdding(null)} title="Add a partner" size="sm"><form onSubmit={addPartner} className="grid gap-3"><Input name="name" label="Organization" required /><Select name="type" label="Type"><option>employer</option><option>sponsor</option><option>nonprofit</option><option>agency</option><option>vendor</option></Select><Input name="contact" label="Contact" /><Input name="notes" label="Notes" /><div className="flex justify-end gap-2 pt-2"><Button variant="ghost" onClick={() => setAdding(null)}>Cancel</Button><Button type="submit">Save</Button></div></form></Modal>
      <Modal open={adding === 'grant'} onClose={() => setAdding(null)} title="Add a grant opportunity" size="sm"><form onSubmit={addGrant} className="grid gap-3"><Input name="name" label="Grant" required /><Input name="funder" label="Funder" required /><Input name="amount" type="number" min={0} label="Amount" required /><Input name="deadline" type="date" label="Deadline" required /><div className="flex justify-end gap-2 pt-2"><Button variant="ghost" onClick={() => setAdding(null)}>Cancel</Button><Button type="submit">Save</Button></div></form></Modal>
    </>
  )
}
