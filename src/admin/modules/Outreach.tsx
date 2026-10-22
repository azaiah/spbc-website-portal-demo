import { useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShoppingBasket, ShowerHead, Bus, HandHeart, Plus, Download, Users, Scale, Package, UserRound, Check, HeartHandshake } from 'lucide-react'
import { useDemo } from '@/data/store'
import { personName, sum } from '@/data/selectors'
import { fmtShort, fmtLong, relDays, todayIso, monthKey, monthLabel } from '@/data/dates'
import type { ServiceRequest, ServiceProgram, PantryDay, ShowerDay } from '@/data/types'
import { uid } from '@/data/ids'
import { accountById } from '@/config/accounts'
import { church } from '@/config/site'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Input, Textarea } from '@/components/Field'
import { Tabs } from '@/components/Tabs'
import { Modal } from '@/components/Modal'
import { BarChart } from '@/components/charts/BarChart'
import { PageHeader, Kpi, Panel } from '../layout/shared'

type Tab = 'pantry' | 'showers' | 'rides' | 'requests'
const programLabel: Record<ServiceProgram, string> = { food: 'Fresh food', housing: 'Housing', employment: 'Jobs & training', transportation: 'Ride', senior: 'Senior & counseling', emergency: 'Emergency' }
const tone = { new: 'gold', assigned: 'royal', 'in-progress': 'neutral', fulfilled: 'success', referred: 'success' } as const
const n = (v: number) => v.toLocaleString('en-US')

function monthly<T extends { date: string }>(rows: T[], pick: (r: T) => number, months = 4) {
  const keys: string[] = []
  for (let i = months - 1; i >= 0; i--) { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i); keys.push(d.toISOString().slice(0, 7)) }
  return keys.map((k) => ({ label: monthLabel(k), value: sum(rows.filter((r) => monthKey(r.date) === k).map(pick)) }))
}

export function Outreach() {
  const { state, upsert, patch, log } = useDemo()
  useDocumentMeta('Outreach | Saint Paul’s Everywhere')
  const [params, setParams] = useSearchParams()
  const acct = accountById(state.accountId)
  const mine = acct?.ministryIds ?? []
  const leaderOnly = state.role === 'ministry'
  const allowed: Tab[] = leaderOnly
    ? (['pantry', 'showers', 'rides', 'requests'] as Tab[]).filter((t) => (t === 'pantry' || t === 'requests' || t === 'showers') ? mine.includes('min_outreach') : mine.includes('min_transport'))
    : ['pantry', 'showers', 'rides', 'requests']
  const tabs: Tab[] = allowed.length ? allowed : ['pantry']
  const tab = (tabs.includes(params.get('tab') as Tab) ? params.get('tab') : tabs[0]) as Tab
  const who = acct?.name ?? personName(state, state.currentMemberId)

  const [logging, setLogging] = useState<'pantry' | 'showers' | 'ride' | null>(null)
  const [closing, setClosing] = useState<ServiceRequest | null>(null)
  const [outcome, setOutcome] = useState('')

  const pantry = state.pantry
  const sh = state.showers
  const rides = useMemo(() => state.services.filter((s) => s.program === 'transportation').sort((a, b) => b.date.localeCompare(a.date)), [state.services])
  const requests = useMemo(() => state.services.filter((s) => s.program !== 'transportation').sort((a, b) => (a.status === 'new' ? -1 : 0) - (b.status === 'new' ? -1 : 0) || b.date.localeCompare(a.date)), [state.services])
  const ytd = (rows: { date: string }[]) => rows.filter((r) => r.date.slice(0, 4) === todayIso().slice(0, 4))
  const pYtd = ytd(pantry) as PantryDay[]
  const sYtd = ytd(sh) as ShowerDay[]

  function savePantry(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget); const num = (k: string) => Number(f.get(k)) || 0
    const date = String(f.get('date') || todayIso()); const day = 'Friday' as const
    upsert('pantry', { id: uid('pd'), date, day, households: num('households'), individuals: num('individuals'), seniors: num('seniors'), children: num('children'), pounds: num('pounds'), volunteers: num('volunteers'), newHouseholds: num('newHouseholds') })
    log(who, 'Logged fresh food distribution', `${num('households')} households, ${fmtShort(date)}`); setLogging(null)
  }
  function saveShowers(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget); const guests = Number(f.get('guests')) || 0
    const date = String(f.get('date') || todayIso())
    upsert('showers', { id: uid('sw'), date, guests, showers: Number(f.get('showers')) || 0, kits: Number(f.get('kits')) || 0, volunteers: Number(f.get('volunteers')) || 0, note: String(f.get('note') || '') })
    log(who, 'Logged Dignity on the Go', `${guests} guests, ${fmtShort(date)}`); setLogging(null)
  }
  function saveRide(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget)
    upsert('services', { id: uid('sv'), program: 'transportation', name: String(f.get('name')), contact: String(f.get('contact') ?? ''), text: `${f.get('when')}: ${f.get('where')}`, status: 'assigned', coordinatorId: 'm_13', date: todayIso() })
    log(who, 'Scheduled a ride', String(f.get('name'))); setLogging(null)
  }
  function impactSummary() {
    const lines = [
      `${church.centerName} and ${church.name}`, `Community impact summary, ${todayIso().slice(0, 4)} year to date (prepared ${fmtLong(todayIso())})`, '',
      'COMMUNITY FRESH FOOD DISTRIBUTION (Fridays 4 PM, Creighton Campus, with Feed More)',
      `Distribution days: ${pYtd.length}`, `Household visits: ${n(sum(pYtd.map((p) => p.households)))}`, `People served: ${n(sum(pYtd.map((p) => p.individuals)))} (seniors ${n(sum(pYtd.map((p) => p.seniors)))}, children ${n(sum(pYtd.map((p) => p.children)))})`, `Pounds distributed: ${n(sum(pYtd.map((p) => p.pounds)))}`, `Volunteer shifts: ${n(sum(pYtd.map((p) => p.volunteers)))}`, '',
      'DIGNITY ON THE GO: MOBILE SHOWERS (Wednesdays 10 AM, Belt Campus)',
      `Days: ${sYtd.length}`, `Guest visits: ${n(sum(sYtd.map((a) => a.guests)))}`, `Showers: ${n(sum(sYtd.map((a) => a.showers)))}`, `Hygiene kits: ${n(sum(sYtd.map((a) => a.kits)))}`, '',
      'TRANSPORTATION AND HELP REQUESTS',
      `Rides arranged: ${rides.length}`, `Help requests received: ${requests.length}; fulfilled or referred: ${requests.filter((r) => r.status === 'fulfilled' || r.status === 'referred').length}`, '',
      'Sample data in this demo. In production these figures come from the counts logged at each program.',
    ]
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain' })); a.download = `saint-pauls-impact-${todayIso()}.txt`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    upsert('documents', { id: uid('d'), title: `Community impact summary (${fmtShort(todayIso())})`, category: 'report', updated: todayIso(), ownerId: state.currentMemberId, size: '4 KB' })
    log(who, 'Downloaded impact summary', 'Outreach')
  }

  const tabItems = [
    { id: 'pantry' as Tab, label: 'Fresh food', count: pantry.filter((p) => p.date >= todayIso().slice(0, 7) + '-01').length },
    { id: 'showers' as Tab, label: 'Dignity on the Go' },
    { id: 'rides' as Tab, label: 'Rides', count: rides.filter((r) => r.status !== 'fulfilled').length },
    { id: 'requests' as Tab, label: 'Help requests', count: requests.filter((r) => r.status === 'new').length },
  ].filter((t) => tabs.includes(t.id))

  return (
    <>
      <PageHeader eyebrow="Community Outreach" title="Finding needs and meeting them, measured." text="Fresh food Fridays, Dignity on the Go showers, rides and help requests in one place. Every count logged here flows into grant narratives and the impact report. Figures in this demo are samples." actions={<><Button variant="outline" icon={<Download size={16} />} onClick={impactSummary}>Impact summary</Button>{tab !== 'requests' && <Button icon={<Plus size={16} />} onClick={() => setLogging(tab === 'pantry' ? 'pantry' : tab === 'showers' ? 'showers' : 'ride')}>{tab === 'pantry' ? 'Log a Friday' : tab === 'showers' ? 'Log a shower day' : 'Schedule a ride'}</Button>}</>} />
      {leaderOnly && <p className="mb-4 text-sm text-slate">Signed in as {acct?.name}. You see the programs your ministry runs.</p>}
      <Tabs value={tab} onChange={(t) => setParams({ tab: t })} items={tabItems} />

      {tab === 'pantry' && (
        <div className="mt-5 grid gap-4">
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <Kpi label="Household visits this year" value={n(sum(pYtd.map((p) => p.households)))} icon={ShoppingBasket} tone="midnight" />
            <Kpi label="People served" value={n(sum(pYtd.map((p) => p.individuals)))} sub={`${n(sum(pYtd.map((p) => p.children)))} children · ${n(sum(pYtd.map((p) => p.seniors)))} seniors`} icon={Users} />
            <Kpi label="Pounds distributed" value={n(sum(pYtd.map((p) => p.pounds)))} icon={Scale} />
            <Kpi label="New households" value={n(sum(pYtd.map((p) => p.newHouseholds)))} sub="First visit this year" tone="gold" />
          </div>
          <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
            <Panel title="Households by month" subtitle="Fridays at Creighton"><BarChart data={monthly(pantry, (p) => p.households)} height={150} color="#006C3A" /></Panel>
            <Panel title="Recent distribution days">
              <div className="overflow-x-auto -mx-1"><table className="w-full text-sm min-w-[520px]"><thead><tr className="text-left text-xs text-slate"><th className="py-2 px-1 font-medium">Date</th><th className="px-1 font-medium">Households</th><th className="px-1 font-medium">People</th><th className="px-1 font-medium">Pounds</th><th className="px-1 font-medium">Volunteers</th></tr></thead>
                <tbody>{[...pantry].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10).map((p) => <tr key={p.id} className="border-t border-line"><td className="py-2 px-1">{p.day.slice(0, 3)} {fmtShort(p.date)}</td><td className="px-1 font-semibold">{p.households}</td><td className="px-1">{p.individuals}</td><td className="px-1">{n(p.pounds)}</td><td className="px-1">{p.volunteers}</td></tr>)}</tbody></table></div>
            </Panel>
          </div>
        </div>
      )}

      {tab === 'showers' && (
        <div className="mt-5 grid gap-4">
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <Kpi label="Shower days this year" value={sYtd.length} icon={ShowerHead} tone="midnight" />
            <Kpi label="Guest visits" value={n(sum(sYtd.map((a) => a.guests)))} sub="Wednesdays at Belt" icon={Users} />
            <Kpi label="Showers" value={n(sum(sYtd.map((a) => a.showers)))} icon={HeartHandshake} />
            <Kpi label="Hygiene kits" value={n(sum(sYtd.map((a) => a.kits)))} icon={Package} tone="gold" />
          </div>
          <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
            <Panel title="Guests by month"><BarChart data={monthly(sh, (a) => a.guests)} height={150} color="#F3801F" /></Panel>
            <Panel title="Recent shower days">
              <ul className="divide-y divide-line">{[...sh].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8).map((a) => <li key={a.id} className="py-2.5 flex flex-wrap items-center justify-between gap-2 text-sm"><span><span className="font-semibold">{fmtShort(a.date)}</span>{a.note ? ` · ${a.note}` : ''}</span><span className="text-slate">{a.guests} guests · {a.showers} showers · {a.volunteers} volunteers</span></li>)}</ul>
            </Panel>
          </div>
        </div>
      )}

      {tab === 'rides' && (
        <Panel className="mt-5" title="Ride requests" subtitle="From the website’s ride form and 804.463.2429. Every ride logged strengthens the Section 5310 van application through Nia.">
          {rides.length === 0 && <p className="text-sm text-slate">No ride requests yet.</p>}
          <ul className="divide-y divide-line">{rides.map((r) => (
            <li key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0"><p className="font-semibold flex items-center gap-2"><Bus size={16} className="text-gold" /> {r.name} <Badge tone={tone[r.status]}>{r.status}</Badge></p><p className="text-sm text-slate mt-0.5">{r.text}</p><p className="text-xs text-slate mt-0.5">{relDays(r.date)}{r.coordinatorId ? ` · Driver lead: ${personName(state, r.coordinatorId)}` : ''}</p></div>
              <div className="flex gap-2 shrink-0">
                {r.status === 'new' && <Button size="sm" variant="outline" onClick={() => { patch('services', r.id, { status: 'assigned', coordinatorId: 'm_13' }); log(who, 'Assigned ride', r.name) }}>Assign driver</Button>}
                {r.status !== 'fulfilled' && <Button size="sm" icon={<Check size={14} />} onClick={() => { patch('services', r.id, { status: 'fulfilled', outcome: 'Ride completed' }); log(who, 'Completed ride', r.name) }}>Completed</Button>}
              </div>
            </li>
          ))}</ul>
        </Panel>
      )}

      {tab === 'requests' && (
        <Panel className="mt-5" title="Help requests" subtitle="From the website’s Get Help form. Names are visible only to the Outreach team; reports show totals.">
          {requests.length === 0 && <p className="text-sm text-slate">No requests yet.</p>}
          <ul className="divide-y divide-line">{requests.map((r) => (
            <li key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold flex flex-wrap items-center gap-2"><HandHeart size={16} className="text-gold" /> {r.name} <Badge tone="royal">{programLabel[r.program]}</Badge><Badge tone={tone[r.status]}>{r.status}</Badge></p>
                <p className="text-sm mt-1">{r.text}</p>
                <p className="text-xs text-slate mt-1">{relDays(r.date)}{r.householdSize ? ` · household of ${r.householdSize}` : ''}{r.contact ? ` · ${r.contact}` : ''}{r.coordinatorId ? ` · ${personName(state, r.coordinatorId)}` : ''}{r.outcome ? ` · Outcome: ${r.outcome}` : ''}</p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                {r.status === 'new' && <Button size="sm" variant="outline" icon={<UserRound size={14} />} onClick={() => { patch('services', r.id, { status: 'assigned', coordinatorId: 'm_13' }); log(who, 'Took help request', r.name) }}>Take it</Button>}
                {r.status !== 'fulfilled' && r.status !== 'referred' && <Button size="sm" onClick={() => { setClosing(r); setOutcome('') }}>Close with outcome</Button>}
              </div>
            </li>
          ))}</ul>
        </Panel>
      )}

      <Modal open={logging === 'pantry'} onClose={() => setLogging(null)} title="Log a Friday fresh food distribution">
        <form id="pantry-form" onSubmit={savePantry} className="grid gap-3 sm:grid-cols-2">
          <Input name="date" type="date" label="Date" defaultValue={todayIso()} required className="sm:col-span-2" />
          <Input name="households" type="number" min={0} label="Households" required />
          <Input name="individuals" type="number" min={0} label="People" required />
          <Input name="seniors" type="number" min={0} label="Seniors (60+)" />
          <Input name="children" type="number" min={0} label="Children (under 18)" />
          <Input name="pounds" type="number" min={0} label="Pounds distributed" />
          <Input name="volunteers" type="number" min={0} label="Volunteers" />
          <Input name="newHouseholds" type="number" min={0} label="New households" className="sm:col-span-2" />
          <div className="sm:col-span-2 flex justify-end gap-2"><Button variant="ghost" onClick={() => setLogging(null)}>Cancel</Button><Button type="submit">Save</Button></div>
        </form>
      </Modal>
      <Modal open={logging === 'showers'} onClose={() => setLogging(null)} title="Log a Dignity on the Go day">
        <form onSubmit={saveShowers} className="grid gap-3 sm:grid-cols-2">
          <Input name="date" type="date" label="Date" defaultValue={todayIso()} required />
          <Input name="guests" type="number" min={0} label="Guests" required />
          <Input name="showers" type="number" min={0} label="Showers" />
          <Input name="kits" type="number" min={0} label="Hygiene kits" />
          <Input name="volunteers" type="number" min={0} label="Volunteers" />
          <Input name="note" label="Note" placeholder="Anything to remember" />
          <div className="sm:col-span-2 flex justify-end gap-2"><Button variant="ghost" onClick={() => setLogging(null)}>Cancel</Button><Button type="submit">Save</Button></div>
        </form>
      </Modal>
      <Modal open={logging === 'ride'} onClose={() => setLogging(null)} title="Schedule a ride">
        <form onSubmit={saveRide} className="grid gap-3">
          <Input name="name" label="Rider" required />
          <Input name="contact" label="Phone" type="tel" />
          <Input name="when" label="When" placeholder="Sunday 8:15 AM pickup for Creighton" required />
          <Textarea name="where" label="Pickup address and notes" required />
          <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setLogging(null)}>Cancel</Button><Button type="submit">Schedule</Button></div>
        </form>
      </Modal>
      <Modal open={!!closing} onClose={() => setClosing(null)} title={`Close request: ${closing?.name ?? ''}`}>
        <div className="grid gap-3">
          <Textarea label="Outcome" value={outcome} onChange={(e) => setOutcome(e.target.value)} placeholder="Fresh food provided; referred for counseling" />
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => { if (closing) { patch('services', closing.id, { status: 'referred', outcome: outcome || 'Referred to a partner' }); log(who, 'Referred request', closing.name) } setClosing(null) }}>Referred</Button>
            <Button onClick={() => { if (closing) { patch('services', closing.id, { status: 'fulfilled', outcome: outcome || 'Fulfilled' }); log(who, 'Fulfilled request', closing.name) } setClosing(null) }}>Fulfilled</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
