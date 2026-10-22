import { useMemo, useRef, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Compass, Sparkles, ExternalLink, Plus, FileText, CheckCircle2, Circle, CalendarClock, Layers, ShieldCheck, Lightbulb, Send, Bot, Target, AlertTriangle, ArrowRight, Copy } from 'lucide-react'
import { useDemo } from '@/data/store'
import { sum } from '@/data/selectors'
import { money, fmtDate, daysUntil, todayIso } from '@/data/dates'
import type { Opportunity, OpportunityCategory, FundingEntity, Grant } from '@/data/types'
import { uid } from '@/data/ids'
import { RESEARCHED_ON } from '@/data/funding'
import { accountById } from '@/config/accounts'
import { church } from '@/config/site'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Select, Textarea } from '@/components/Field'
import { Tabs } from '@/components/Tabs'
import { Drawer } from '@/components/Drawer'
import { Kpi, Panel, Progress } from '../layout/shared'

type Tab = 'matches' | 'calendar' | 'stacks' | 'readiness' | 'pipeline' | 'ask'
const catLabel: Record<OpportunityCategory, string> = { security: 'Security', energy: 'Energy', youth: 'Youth', food: 'Food', violence: 'Violence prevention', recovery: 'Recovery & prevention', housing: 'Housing', transport: 'Transportation', capacity: 'Capacity', facility: 'Building', 'tax-credit': 'Tax credits', earned: 'Earned income', giving: 'Giving', education: 'Education' }
const entityLabel: Record<FundingEntity, string> = { church: 'Church applies', center: 'Nia applies', either: 'Either entity' }
const levelLabel = { federal: 'Federal', state: 'State', city: 'City', foundation: 'Foundation', corporate: 'Corporate', creative: 'Outside the box' } as const
const stages: Grant['status'][] = ['identified', 'applying', 'submitted', 'awarded', 'reporting', 'declined']

function FitRing({ fit, size = 52 }: { fit: number; size?: number }) {
  const r = (size - 6) / 2; const c = 2 * Math.PI * r
  const color = fit >= 85 ? '#4B2A7B' : fit >= 70 ? '#C9A24B' : '#8C8496'
  return (
    <span className="relative inline-grid place-items-center shrink-0" style={{ width: size, height: size }} aria-label={`Fit score ${fit} out of 100`}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true"><circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E7DFD0" strokeWidth="5" /><circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - fit / 100)} /></svg>
      <span className="absolute font-display text-lg font-semibold">{fit}</span>
    </span>
  )
}

/** Funding stacks: combinations the advisor recommends to fully fund one program from several sources. */
const stacks = [
  { id: 'st_food', title: 'Grow fresh food Fridays without growing the budget', program: 'Community Fresh Food Distribution', note: 'Feed More supplies the food; NAP-credited business sponsors and Dominion cover bags, volunteers’ meals and logistics; employer volunteer grants reward the people already serving.', ops: ['op_nap', 'op_dominion', 'op_match'] },
  { id: 'st_showers', title: 'Keep Dignity on the Go rolling', program: 'Mobile showers at Belt', note: 'City of Richmond ESG/public services funds and NAP sponsors cover the trailer, water, towels and hygiene kits; counts logged every Wednesday make the case.', ops: ['op_cdbg', 'op_nap', 'op_dominion'] },
  { id: 'st_safe', title: 'Two safer campuses', program: 'Security at Creighton and Belt', note: 'NSGP funds up to $200,000 per site; BJA adds a second federal source; both reuse the same vulnerability assessments.', ops: ['op_nsgp', 'op_bja'] },
  { id: 'st_ride', title: 'No senior misses church for lack of a ride', program: 'Transportation, Prime Time and Refiners', note: 'A state-procured accessible van through Section 5310 (Nia applies), with the local share covered by employer matches and recurring giving.', ops: ['op_5310', 'op_match', 'op_recurring'] },
  { id: 'st_build', title: 'Lower the power bill at Creighton for decades', program: 'Creighton campus', note: 'Solar canopies with IRS elective pay before the 2027 deadline; Commons rentals turn empty hours into income.', ops: ['op_solar', 'op_rentals'] },
  { id: 'st_city', title: 'Lay groundwork for the City of Possibility', program: 'City of Possibility', note: 'Henrico HOME/CDBG for affordability, solar from day one, and NAP sponsors for community spaces. Housing finance itself sits with the development entity.', ops: ['op_henrico', 'op_solar', 'op_nap'] },
]

const suggestions = ['What can we apply for in the next 90 days?', 'How do we pay for an accessible van?', 'What is the fastest money we can raise?', 'Which grants can the church apply for, not Nia?', 'What is blocking us from federal grants?', 'How can local businesses help?']

export function Grants() {
  const { state, upsert, patch, log } = useDemo()
  useDocumentMeta('Grant Advisor | Saint Paul’s Everywhere')
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'matches'
  const acct = accountById(state.accountId)
  const who = acct?.name ?? 'Staff'
  const [entity, setEntity] = useState<'all' | FundingEntity>('all')
  const [cat, setCat] = useState<'all' | OpportunityCategory>('all')
  const [sort, setSort] = useState<'fit' | 'deadline' | 'amount'>('fit')
  const [outside, setOutside] = useState(false)
  const [open, setOpen] = useState<Opportunity | null>(null)
  const [draft, setDraft] = useState('')
  const [copied, setCopied] = useState(false)

  const ops = state.opportunities.filter((o) => !o.dismissed)
  const list = useMemo(() => ops
    .filter((o) => entity === 'all' || o.entity === entity || o.entity === 'either')
    .filter((o) => cat === 'all' || o.category === cat)
    .filter((o) => !outside || o.outsideBox || o.level === 'creative')
    .sort((a, b) => sort === 'fit' ? b.fit - a.fit : sort === 'amount' ? b.amountValue - a.amountValue : (a.nextDeadline ?? '9999').localeCompare(b.nextDeadline ?? '9999')), [ops, entity, cat, sort, outside])
  const upcoming = ops.filter((o) => o.nextDeadline && o.nextDeadline >= todayIso()).sort((a, b) => a.nextDeadline!.localeCompare(b.nextDeadline!))
  const ready = state.readiness.filter((r) => r.done).length
  const potential = sum(ops.filter((o) => o.fit >= 70).map((o) => o.amountValue))
  const pipelineValue = sum(state.grants.filter((g) => g.status !== 'declined').map((g) => g.amount))
  const inPipeline = (o: Opportunity) => state.grants.some((g) => g.opportunityId === o.id)

  // Real program data feeds the letters the advisor drafts.
  const yr = todayIso().slice(0, 4)
  const pY = state.pantry.filter((p) => p.date.startsWith(yr))
  const sY = state.showers.filter((a) => a.date.startsWith(yr))
  const facts = {
    households: sum(pY.map((p) => p.households)), people: sum(pY.map((p) => p.individuals)), pounds: sum(pY.map((p) => p.pounds)), days: pY.length,
    showerDays: sY.length, guests: sum(sY.map((a) => a.guests)), showers: sum(sY.map((a) => a.showers)),
  }

  function letterFor(o: Opportunity) {
    const applicant = o.entity === 'church' ? church.name : `${church.centerName} (501(c)(3), EIN ${church.centerEin})`
    return `${fmtDate(todayIso(), { month: 'long', day: 'numeric', year: 'numeric' })}

${o.funder}
Re: Letter of inquiry, ${o.name}

Dear Program Officer,

${applicant}, located at ${church.address} in ${church.neighborhood}, respectfully requests your consideration for ${o.name}${o.amount ? ` (${o.amount})` : ''}.

Who we are
The Saint Paul’s Baptist Church was founded on Thanksgiving night, 1909, and today worships as one church on two campuses: Creighton Road in Eastern Henrico and Belt Boulevard in Southside Richmond. ${church.centerName}, founded by the church in 1992, carries its community development work. Its mission: ${church.centerMission}

Why this fits
${o.whyFit}

What we already do
- Community Fresh Food Distribution every Friday at the Creighton Campus with Feed More: ${facts.days} distribution days so far this year, ${facts.households.toLocaleString()} household visits and ${facts.people.toLocaleString()} people served.
- Dignity on the Go mobile showers every Wednesday at the Belt Campus: ${facts.showerDays} days, ${facts.guests.toLocaleString()} guest visits and ${facts.showers.toLocaleString()} showers.
- Diaper pop-ups with Urban Baby Beginnings, a Family Health Fair with the Henrico County Alumnae Chapter of Delta Sigma Theta, vaccine clinics, transportation, emergency financial assistance and youth mentoring.

What this support would make possible
${o.programs.length ? `This request supports ${o.programs.join(', ')}. ` : ''}[Describe the specific outcome, the number of people served and the 12-month timeline.]

We would welcome the chance to submit a full proposal or to host you at a Friday distribution.

With gratitude,

[Name]
[Title]
${o.entity === 'center' ? church.centerName : church.name}
${church.phone} · ${church.centerEmail}

(Draft prepared by the Grant Advisor from Saint Paul’s Everywhere records. Program figures in this demo are sample data. Review every fact before sending.)`
  }

  const isPlan = (o: Opportunity) => o.level === 'creative' || o.category === 'giving' || o.category === 'earned'
  function planFor(o: Opportunity) {
    return `Action plan: ${o.name}
Prepared ${fmtDate(todayIso(), { month: 'long', day: 'numeric', year: 'numeric' })} by the Grant Advisor for ${o.entity === 'center' ? church.centerName : church.name}

Goal
${o.amount}. ${o.window}

Why it fits Saint Paul’s
${o.whyFit}

What has to be in place
${o.requirements.map((r) => `- ${r}`).join('\n')}

Next 30 days
${o.nextSteps.map((x, i) => `${i + 1}. ${x}`).join('\n')}

Owner: [assign]   Review date: [set]   Programs: ${o.programs.join(', ')}

(Draft prepared by the Grant Advisor. Review with the Pastor before launching.)`
  }

  function addToPipeline(o: Opportunity) {
    if (inPipeline(o)) return
    upsert('grants', { id: uid('gr'), name: o.name, funder: o.funder, amount: o.amountValue, deadline: o.nextDeadline ?? todayIso(), status: 'identified', ownerId: state.currentMemberId, opportunityId: o.id, entity: o.entity })
    upsert('tasks', { id: uid('t'), title: `Grant: ${o.nextSteps[0] ?? `Review ${o.name}`}`, assigneeId: state.currentMemberId, due: o.nextDeadline && daysUntil(o.nextDeadline) < 45 ? todayIso() : new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10), status: 'todo', module: 'grants', priority: o.fit >= 85 ? 'high' : 'normal' })
    log(who, 'Added grant to pipeline', o.name)
  }
  function saveDraft(o: Opportunity) {
    upsert('drafts', { id: uid('dr'), agentId: 'grants', title: `${isPlan(o) ? 'Action plan' : 'Letter of inquiry'}: ${o.name}`, kind: isPlan(o) ? 'Action plan' : 'Letter of inquiry', module: 'grants', reviewerRole: 'admin', status: 'pending', createdAt: todayIso(), body: draft })
    log('Grant Advisor', isPlan(o) ? 'Drafted action plan' : 'Drafted letter of inquiry', o.name)
  }

  const tabItems = [
    { id: 'matches' as Tab, label: 'Matches', count: ops.length },
    { id: 'calendar' as Tab, label: 'Deadlines', count: upcoming.filter((o) => daysUntil(o.nextDeadline!) <= 120).length },
    { id: 'stacks' as Tab, label: 'Funding stacks' },
    { id: 'readiness' as Tab, label: 'Readiness', count: state.readiness.length - ready },
    { id: 'pipeline' as Tab, label: 'Pipeline', count: state.grants.length },
    { id: 'ask' as Tab, label: 'Ask the advisor' },
  ]

  return (
    <>
      <div className="relative isolate overflow-hidden rounded-3xl bg-midnight text-white p-6 sm:p-8 mb-6 grain">
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight via-midnight/85 to-plum/40" />
        <p className="font-caps text-[13px] tracking-[0.26em] text-gold-light flex items-center gap-2"><Compass size={14} /> Grant Advisor · AI agent</p>
        <h1 className="display text-4xl sm:text-5xl mt-3 max-w-3xl">Funding found for Saint Paul’s, not for “churches in general.”</h1>
        <p className="mt-3 max-w-2xl text-white/75">Scans federal, Virginia, Henrico, City of Richmond, foundation and corporate funding, scores the fit against Saint Paul’s real programs, and looks past grants for tax credits, earned income and giving. Opportunities researched {fmtDate(RESEARCHED_ON, { month: 'long', day: 'numeric', year: 'numeric' })}; the live agent re-checks weekly.</p>
        <div className="mt-5 flex flex-wrap gap-2"><Button onClick={() => setParams({ tab: 'ask' })} icon={<Bot size={16} />} className="!bg-gold-bright !text-midnight hover:!bg-gold-light">Ask the advisor</Button><Button variant="outline" onClick={() => setParams({ tab: 'stacks' })} icon={<Layers size={16} />} className="!bg-white/10 !text-white !border-white/25 hover:!bg-white/20">See funding stacks</Button></div>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Kpi label="Potential from strong fits" value={money(potential)} sub={`${ops.filter((o) => o.fit >= 70).length} opportunities scoring 70+`} icon={Target} tone="midnight" />
        <Kpi label="In the pipeline" value={money(pipelineValue)} sub={`${state.grants.filter((g) => g.status !== 'declined').length} active applications`} />
        <Kpi label="Next deadline" value={upcoming[0] ? `${daysUntil(upcoming[0].nextDeadline!)} days` : 'None'} sub={upcoming[0]?.name} icon={CalendarClock} />
        <Kpi label="Grant readiness" value={`${Math.round((ready / state.readiness.length) * 100)}%`} sub={`${state.readiness.length - ready} items open`} tone="gold" icon={ShieldCheck} />
      </div>

      <Tabs className="mt-6" value={tab} onChange={(t) => setParams({ tab: t })} items={tabItems} />

      {tab === 'matches' && (
        <div className="mt-5">
          <div className="flex flex-wrap items-end gap-3 mb-4">
            <Select label="Who applies" value={entity} onChange={(e) => setEntity(e.target.value as typeof entity)} className="w-48"><option value="all">Church or Nia</option><option value="church">Church</option><option value="center">Nia (501(c)(3))</option></Select>
            <Select label="Category" value={cat} onChange={(e) => setCat(e.target.value as typeof cat)} className="w-48"><option value="all">All categories</option>{[...new Set(ops.map((o) => o.category))].map((c) => <option key={c} value={c}>{catLabel[c]}</option>)}</Select>
            <Select label="Sort by" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="w-40"><option value="fit">Best fit</option><option value="deadline">Soonest deadline</option><option value="amount">Largest amount</option></Select>
            <button type="button" aria-pressed={outside} onClick={() => setOutside((v) => !v)} className={`min-h-[44px] rounded-full border px-4 text-sm font-semibold inline-flex items-center gap-2 ${outside ? 'bg-plum text-white border-plum' : 'bg-paper border-line text-slate hover:border-slate'}`}><Lightbulb size={16} /> Outside the box</button>
          </div>
          <ul className="grid gap-3 lg:grid-cols-2">
            {list.map((o) => (
              <li key={o.id}>
                <button type="button" onClick={() => { setOpen(o); setDraft(''); setCopied(false) }} className="w-full text-left card p-4 sm:p-5 hover:border-plum/40 hover:shadow-lift transition flex gap-4">
                  <FitRing fit={o.fit} />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap gap-1.5 mb-1.5"><Badge tone={o.level === 'creative' ? 'gold' : 'royal'}>{levelLabel[o.level]}</Badge><Badge>{catLabel[o.category]}</Badge>{o.outsideBox && o.level !== 'creative' && <Badge tone="gold">Outside the box</Badge>}{!o.verified && <Badge tone="warning">Confirm details</Badge>}{inPipeline(o) && <Badge tone="success">In pipeline</Badge>}</span>
                    <span className="block font-semibold leading-snug">{o.name}</span>
                    <span className="block text-xs text-slate mt-0.5">{o.funder}</span>
                    <span className="block text-sm mt-2 font-medium text-plum">{o.amount}</span>
                    <span className="block text-xs text-slate mt-1">{o.nextDeadline ? `Next deadline ${fmtDate(o.nextDeadline)} (${daysUntil(o.nextDeadline)} days)` : o.window} · {entityLabel[o.entity]}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {list.length === 0 && <p className="text-sm text-slate">No matches for these filters.</p>}
        </div>
      )}

      {tab === 'calendar' && (
        <div className="mt-5 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Panel title="Upcoming deadlines" subtitle="Dates marked expected are projected from the last cycle; confirm when the funder posts the new round.">
            <ol className="relative border-l-2 border-line ml-2">
              {upcoming.map((o) => { const d = daysUntil(o.nextDeadline!); return (
                <li key={o.id} className="ml-5 pb-5 last:pb-0">
                  <span className={`absolute -left-[9px] mt-1 h-4 w-4 rounded-full border-2 border-paper ${d <= 60 ? 'bg-danger' : d <= 120 ? 'bg-gold-bright' : 'bg-plum'}`} />
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate">{fmtDate(o.nextDeadline!, { month: 'long', day: 'numeric', year: 'numeric' })} · {d} days</p>
                  <button type="button" onClick={() => { setOpen(o); setDraft('') }} className="font-semibold text-left hover:text-plum">{o.name}</button>
                  <p className="text-sm text-slate">{o.window}</p>
                  {o.nextSteps[0] && <p className="text-sm mt-1 flex gap-1.5"><ArrowRight size={14} className="text-gold mt-0.5 shrink-0" /> {o.nextSteps[0]}</p>}
                </li>
              ) })}
            </ol>
          </Panel>
          <Panel title="Rolling and anytime" subtitle="No deadline. Start whenever you are ready.">
            <ul className="divide-y divide-line">{ops.filter((o) => !o.nextDeadline).sort((a, b) => b.fit - a.fit).map((o) => <li key={o.id} className="py-2.5 flex items-center gap-3"><FitRing fit={o.fit} size={40} /><button type="button" onClick={() => { setOpen(o); setDraft('') }} className="text-left text-sm font-medium hover:text-plum">{o.name}<span className="block text-xs text-slate font-normal">{o.amount}</span></button></li>)}</ul>
          </Panel>
        </div>
      )}

      {tab === 'stacks' && (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {stacks.map((s) => { const items = s.ops.map((id) => state.opportunities.find((o) => o.id === id)).filter(Boolean) as Opportunity[]; const total = sum(items.map((o) => o.amountValue)); return (
            <Panel key={s.id} title={s.title} subtitle={s.program}>
              <p className="text-sm text-slate">{s.note}</p>
              <ul className="mt-3 divide-y divide-line">{items.map((o) => <li key={o.id} className="py-2 flex items-center justify-between gap-3 text-sm"><button type="button" onClick={() => { setOpen(o); setDraft('') }} className="text-left hover:text-plum min-w-0"><span className="font-medium">{o.name}</span><span className="block text-xs text-slate truncate">{o.amount}</span></button><span className="font-mono text-xs shrink-0">{money(o.amountValue)}</span></li>)}</ul>
              <div className="mt-3 flex items-center justify-between rounded-2xl bg-royal-50 px-4 py-3"><span className="text-sm font-semibold text-plum">Estimated combined potential</span><span className="font-display text-2xl font-semibold text-plum">{money(total)}</span></div>
              <p className="mt-2 text-[13px] text-slate">Estimates use typical award sizes; actual awards vary.</p>
            </Panel>
          ) })}
        </div>
      )}

      {tab === 'readiness' && (
        <div className="mt-5 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <Panel title="Readiness checklist" subtitle="Most grants are lost before they start. Each item shows what it unlocks.">
            <Progress value={ready} max={state.readiness.length} className="mb-4" color="bg-plum" />
            <ul className="grid gap-2">{state.readiness.map((r) => (
              <li key={r.id}><button type="button" onClick={() => { patch('readiness', r.id, { done: !r.done }); log(who, r.done ? 'Reopened readiness item' : 'Completed readiness item', r.label) }} aria-pressed={r.done} className={`w-full text-left rounded-2xl border p-4 flex gap-3 transition ${r.done ? 'border-line bg-linen' : 'border-gold-bright/50 bg-paper hover:border-plum/40'}`}>
                {r.done ? <CheckCircle2 className="text-plum shrink-0" /> : <Circle className="text-slate shrink-0" />}
                <span className="min-w-0"><span className={`block font-semibold ${r.done ? 'line-through decoration-slate/40 text-slate' : ''}`}>{r.label}</span><span className="block text-sm text-slate mt-0.5">{r.detail}</span><span className="block text-xs mt-1.5"><span className="font-semibold text-plum">Unlocks:</span> {r.unlocks}</span><span className="block text-[13px] text-slate mt-1">{entityLabel[r.entity]}</span></span>
              </button></li>
            ))}</ul>
          </Panel>
          <Panel title={<span className="flex items-center gap-2"><AlertTriangle size={18} className="text-gold" /> Do this first</span>}>
            {state.readiness.find((r) => r.id === 'rd_sam' && !r.done) ? (
              <><p className="font-semibold">Register the church and Nia on SAM.gov.</p><p className="text-sm text-slate mt-2">It is free, it can take several weeks, and it is required before federal and most pass-through money can be paid: Nonprofit Security, Project Safe Neighborhoods, CDBG and the afterschool meal program. Starting now protects every 2027 deadline on the calendar.</p><a href="https://sam.gov/" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-plum underline min-h-[44px]">Open SAM.gov <ExternalLink size={14} /></a></>
            ) : <p className="text-sm text-slate">SAM.gov is done. Next priority: {state.readiness.find((r) => !r.done)?.label ?? 'everything is complete.'}</p>}
          </Panel>
        </div>
      )}

      {tab === 'pipeline' && (
        <div className="mt-5 overflow-x-auto pb-2">
          <div className="grid gap-3 min-w-[960px] grid-cols-6">
            {stages.map((st) => { const gs = state.grants.filter((g) => g.status === st); return (
              <div key={st} className="rounded-2xl bg-paper border border-line p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate flex justify-between"><span>{st}</span><span>{gs.length}</span></p>
                <p className="text-xs text-slate mb-2">{money(sum(gs.map((g) => g.amount)))}</p>
                <ul className="grid gap-2">{gs.map((g) => (
                  <li key={g.id} className="rounded-xl border border-line bg-linen p-3 text-sm">
                    <p className="font-semibold leading-snug">{g.name}</p>
                    <p className="text-xs text-slate mt-1">{g.funder}</p>
                    <p className="text-xs mt-1"><span className="font-mono">{money(g.amount)}</span> · due {fmtDate(g.deadline, { month: 'short', day: 'numeric' })}</p>
                    <select aria-label={`Move ${g.name}`} value={g.status} onChange={(e) => { patch('grants', g.id, { status: e.target.value as Grant['status'] }); log(who, 'Moved grant', `${g.name} → ${e.target.value}`) }} className="mt-2 w-full rounded-lg border border-line bg-paper px-2 py-1.5 text-xs capitalize">{stages.map((x) => <option key={x} value={x}>{x}</option>)}</select>
                  </li>
                ))}</ul>
              </div>
            ) })}
          </div>
        </div>
      )}

      {tab === 'ask' && <AdvisorChat ops={ops} readinessOpen={state.readiness.filter((r) => !r.done).map((r) => r.label)} onOpen={(o) => { setOpen(o); setDraft('') }} />}

      <Drawer open={!!open} onClose={() => setOpen(null)} wide title={open?.name ?? ''} subtitle={open ? `${open.funder} · ${entityLabel[open.entity]}` : ''}
        footer={open && <div className="flex flex-wrap gap-2 justify-end">
          <Button variant="ghost" onClick={() => { patch('opportunities', open.id, { dismissed: true }); log(who, 'Dismissed opportunity', open.name); setOpen(null) }}>Not a fit</Button>
          <Button variant="outline" icon={<FileText size={16} />} onClick={() => setDraft(isPlan(open) ? planFor(open) : letterFor(open))}>{isPlan(open) ? 'Draft action plan' : 'Draft letter of inquiry'}</Button>
          <Button icon={<Plus size={16} />} disabled={inPipeline(open)} onClick={() => addToPipeline(open)}>{inPipeline(open) ? 'In pipeline' : 'Add to pipeline'}</Button>
        </div>}>
        {open && (
          <div className="grid gap-5">
            <div className="flex items-center gap-4"><FitRing fit={open.fit} size={64} /><div><p className="font-display text-2xl font-semibold text-plum">{open.amount}</p><p className="text-sm text-slate">{open.window}</p></div></div>
            {!open.verified && <p className="rounded-xl bg-gold-50 border border-gold-bright/40 p-3 text-sm flex gap-2"><AlertTriangle size={16} className="text-gold shrink-0 mt-0.5" /> The advisor flags this as a lead: confirm the current details with the funder before relying on it.</p>}
            <section><h3 className="font-semibold flex items-center gap-2"><Sparkles size={16} className="text-gold" /> Why it fits Saint Paul’s</h3><p className="text-sm text-slate mt-1.5 leading-relaxed">{open.whyFit}</p></section>
            <section><h3 className="font-semibold">Requirements</h3><ul className="mt-1.5 grid gap-1.5 text-sm">{open.requirements.map((r) => <li key={r} className="flex gap-2"><CheckCircle2 size={15} className="text-plum shrink-0 mt-0.5" /> {r}</li>)}</ul></section>
            <section><h3 className="font-semibold">Next steps</h3><ol className="mt-1.5 grid gap-1.5 text-sm list-decimal pl-5">{open.nextSteps.map((s) => <li key={s}>{s}</li>)}</ol></section>
            <section className="flex flex-wrap gap-1.5">{open.programs.map((p) => <Badge key={p} tone="royal">{p}</Badge>)}</section>
            {open.source && <a href={open.source} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-plum underline min-h-[44px] break-all">Official source <ExternalLink size={14} className="shrink-0" /></a>}
            {draft && (
              <section className="rounded-2xl border border-line bg-linen p-4">
                <div className="flex items-center justify-between gap-2 mb-2"><h3 className="font-semibold flex items-center gap-2"><Bot size={16} className="text-gold" /> {isPlan(open) ? 'Draft action plan' : 'Draft letter of inquiry'}</h3><div className="flex gap-2"><Button size="sm" variant="ghost" icon={<Copy size={14} />} onClick={() => { navigator.clipboard?.writeText(draft).then(() => setCopied(true)).catch(() => setCopied(false)) }}>{copied ? 'Copied' : 'Copy'}</Button><Button size="sm" onClick={() => saveDraft(open)}>Send for review</Button></div></div>
                <Textarea aria-label="Draft" value={draft} onChange={(e) => setDraft(e.target.value)} rows={18} className="font-mono text-xs" />
                <p className="text-xs text-slate mt-2">“Send for review” places the draft in the Action Center for the Executive Administrator. Nothing is sent to a funder automatically.</p>
              </section>
            )}
          </div>
        )}
      </Drawer>
    </>
  )
}

type Msg = { from: 'you' | 'advisor'; text: string; ops?: Opportunity[] }

/** Demo advisor: answers from the researched opportunity list. The production agent uses a live model with web search. */
function AdvisorChat({ ops, readinessOpen, onOpen }: { ops: Opportunity[]; readinessOpen: string[]; onOpen: (o: Opportunity) => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'advisor', text: `I am the Saint Paul’s Grant Advisor. I know both campuses, Nia (EIN ${church.centerEin}), your programs and ${ops.length} funding opportunities I researched for you. Ask me anything about paying for ministry.` }])
  const [q, setQ] = useState('')
  const end = useRef<HTMLDivElement>(null)
  const byId = (...ids: string[]) => ids.map((id) => ops.find((o) => o.id === id)).filter(Boolean) as Opportunity[]

  function answer(text: string): Msg {
    const t = text.toLowerCase()
    if (/(90|soon|quarter|next few|this month|deadline)/.test(t)) {
      const soon = ops.filter((o) => o.nextDeadline && daysUntil(o.nextDeadline) >= 0 && daysUntil(o.nextDeadline) <= 120).sort((a, b) => a.nextDeadline!.localeCompare(b.nextDeadline!))
      const rolling = ops.filter((o) => o.status === 'rolling' || o.status === 'open').sort((a, b) => b.fit - a.fit).slice(0, 2)
      return { from: 'advisor', text: `${soon.length ? `${soon.length} deadlines fall in the next 120 days, starting with ${soon[0].name} on ${fmtDate(soon[0].nextDeadline!)}.` : 'No hard deadlines fall in the next 120 days.'} Two things need no deadline at all and can start this week.`, ops: [...soon.slice(0, 3), ...rolling] }
    }
    if (/(van|ride|transport|bus|vehicle)/.test(t)) return { from: 'advisor', text: 'The best path is Section 5310 through Virginia DRPT: the state buys an accessible vehicle and Nia provides a local share. Applications run December 1 to February 1. Start logging every ride in Outreach now, especially Prime Time and Refiners; demand data is what wins this. Cover the local share with employer matches and recurring giving.', ops: byId('op_5310', 'op_match', 'op_recurring') }
    if (/(fast|quick|now|immediately|easiest)/.test(t)) return { from: 'advisor', text: 'The fastest money is not a grant. Make recurring giving the default ask on the new website and from the pulpit in November (no application), then publish Nia’s EIN for employer matching. Commons rentals come third.', ops: byId('op_recurring', 'op_match', 'op_rentals') }
    if (/(church|not nia|not the center|sanctuary|house of worship)/.test(t)) return { from: 'advisor', text: 'Most foundations will not fund a church directly, which is exactly why Nia exists. These are open to the church itself:', ops: ops.filter((o) => o.entity === 'church').sort((a, b) => b.fit - a.fit) }
    if (/(block|sam|federal|ready|readiness|missing)/.test(t)) return { from: 'advisor', text: readinessOpen.length ? `${readinessOpen.length} readiness items are open: ${readinessOpen.join('; ')}. SAM.gov registration matters most because federal and pass-through programs cannot pay without it, and it can take weeks.` : 'Every readiness item is complete. You are ready to apply.', ops: byId('op_nsgp', 'op_psn', 'op_cdbg') }
    if (/(business|sponsor|company|local)/.test(t)) return { from: 'advisor', text: 'Use Virginia’s Neighborhood Assistance Program. A business that gives $10,000 to Nia can receive up to $6,500 back in state tax credits, so the real cost of sponsoring fresh food Fridays drops to $3,500. Pair that with employer matching for members who already volunteer.', ops: byId('op_nap', 'op_match', 'op_dominion') }
    if (/(security|safe|camera|guard)/.test(t)) return { from: 'advisor', text: 'Houses of worship qualify for FEMA’s Nonprofit Security Grant Program, up to $200,000 per site, and Creighton and Belt are separate sites. The Virginia window is short, usually early July, and requires a vulnerability assessment first. Request both assessments this winter.', ops: byId('op_nsgp', 'op_bja') }
    if (/(youth|smb|kids|mentor|student)/.test(t)) return { from: 'advisor', text: 'For SMB’s mentoring programs: the Ujima Legacy Fund (ages 12 to 21, through Nia), Project Safe Neighborhoods for prevention, and NAP sponsors.', ops: byId('op_cfr', 'op_psn', 'op_nap') }
    if (/(shower|homeless|dignity)/.test(t)) return { from: 'advisor', text: 'Dignity on the Go serves Southside Richmond, so City of Richmond ESG/public services funds fit, with NAP sponsors for towels and hygiene kits.', ops: byId('op_cdbg', 'op_nap', 'op_dominion') }
    if (/(possibility|housing|city of|321)/.test(t)) return { from: 'advisor', text: 'For the City of Possibility, look at Henrico HOME/CDBG for affordability and elective-pay solar from day one. Housing finance itself (tax credits, lenders) belongs to the development entity, outside this advisor.', ops: byId('op_henrico', 'op_solar') }
    if (/(food|pantry|groceries|hunger|fresh)/.test(t)) return { from: 'advisor', text: 'Fresh food is supplied through Feed More, so ask funders for what Feed More does not cover: bags, logistics, volunteer meals and promotion. Dominion and NAP sponsors fit best.', ops: byId('op_dominion', 'op_nap', 'op_match') }
    if (/(violence|gun|prevent|police|reentry|re-entry)/.test(t)) return { from: 'advisor', text: 'Project Safe Neighborhoods names faith-based prevention and reentry programs as eligible. SMB’s youth mentoring and Saint Paul’s commitment to people coming home from incarceration make a strong story through Nia.', ops: byId('op_psn', 'op_opioid') }
    if (/(build|roof|energy|solar|electric|hvac)/.test(t)) return { from: 'advisor', text: 'For Creighton, solar with IRS elective pay returns roughly 30% or more of the cost as a cash payment, but solar must be placed in service by the end of 2027. Commons rentals add income from hours the space sits empty.', ops: byId('op_solar', 'op_rentals') }
    const words = t.split(/\W+/).filter((w) => w.length > 3)
    const scored = ops.map((o) => ({ o, s: words.filter((w) => `${o.name} ${o.whyFit} ${o.programs.join(' ')} ${catLabel[o.category]}`.toLowerCase().includes(w)).length })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s || b.o.fit - a.o.fit).slice(0, 3).map((x) => x.o)
    return scored.length ? { from: 'advisor', text: 'Here is what fits that question best:', ops: scored } : { from: 'advisor', text: 'I do not have a match for that yet. Here are the three strongest fits overall. In production I would also search the web for new opportunities.', ops: [...ops].sort((a, b) => b.fit - a.fit).slice(0, 3) }
  }
  function send(text: string, e?: FormEvent) {
    e?.preventDefault(); const v = text.trim(); if (!v) return
    setMsgs((m) => [...m, { from: 'you', text: v }, answer(v)]); setQ('')
    window.setTimeout(() => end.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50)
  }
  return (
    <Panel className="mt-5" title={<span className="flex items-center gap-2"><Bot size={18} className="text-gold" /> Ask the Grant Advisor</span>} subtitle="Demo: answers come from the researched opportunity list. The production agent uses a live AI model with web search and your records.">
      <div className="max-h-[52vh] overflow-y-auto grid gap-3 pr-1" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={`max-w-[92%] ${m.from === 'you' ? 'justify-self-end' : ''}`}>
            <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.from === 'you' ? 'bg-plum text-white' : 'bg-linen border border-line'}`}>{m.text}</div>
            {m.ops && m.ops.length > 0 && <ul className="mt-2 grid gap-2">{m.ops.map((o) => <li key={o.id}><button type="button" onClick={() => onOpen(o)} className="w-full text-left rounded-xl border border-line bg-paper p-3 flex items-center gap-3 hover:border-plum/40"><FitRing fit={o.fit} size={38} /><span className="min-w-0 text-sm"><span className="block font-semibold truncate">{o.name}</span><span className="block text-xs text-slate truncate">{o.amount}{o.nextDeadline ? ` · due ${fmtDate(o.nextDeadline)}` : ''}</span></span></button></li>)}</ul>}
          </div>
        ))}
        <div ref={end} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">{suggestions.map((s) => <button key={s} type="button" onClick={() => send(s)} className="rounded-full border border-line bg-paper px-3 py-2 text-xs font-medium hover:border-plum/40 min-h-[36px]">{s}</button>)}</div>
      <form onSubmit={(e) => send(q, e)} className="mt-3 flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about funding a program, a building need or a deadline" aria-label="Ask the Grant Advisor" className="flex-1 min-w-0 rounded-full border border-line bg-paper px-4 min-h-[48px] text-sm" />
        <Button type="submit" icon={<Send size={16} />}>Ask</Button>
      </form>
    </Panel>
  )
}
