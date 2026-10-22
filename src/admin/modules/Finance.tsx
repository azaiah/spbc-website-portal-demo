import { useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Landmark, CheckCircle2, Download, Plus, TrendingUp, Wallet, Receipt, Check, X, Lock } from 'lucide-react'
import { useDemo } from '@/data/store'
import { giftsInMonth, sum, monthlyGiving, givingByFund, can, fullName, memberById, personName } from '@/data/selectors'
import { money, monthLabel, fmtShort, fmtDate, todayIso } from '@/data/dates'
import type { Gift, Expense } from '@/data/types'
import { uid } from '@/data/ids'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Input, Select } from '@/components/Field'
import { Tabs } from '@/components/Tabs'
import { Modal } from '@/components/Modal'
import { Table, type Column } from '@/components/Table'
import { BarChart, Donut } from '@/components/charts/BarChart'
import { PageHeader, Kpi, Panel, Progress, Restricted } from '../layout/shared'

type Tab = 'overview' | 'giving' | 'funds' | 'budgets' | 'expenses' | 'statements'
const fundColors = ['#4B2A7B', '#C9A24B', '#6E44A8', '#1E7A4C', '#8A6620', '#B45309']

export function Finance() {
  const { state, patch, upsert, log } = useDemo()
  useDocumentMeta('Finance | Saint Paul’s Everywhere')
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'overview'
  const r = state.role
  const detail = can.seeGivingDetail(r)
  const who = personName(state, state.currentMemberId)
  const thisMonth = sum(giftsInMonth(state).map((g) => g.amount))
  const trend = monthlyGiving(state, 6)
  const byFund = givingByFund(state, 30)
  const unreconciled = state.gifts.filter((g) => g.status === 'recorded')
  const pendingExp = state.expenses.filter((x) => x.status === 'requested')
  const planned = sum(state.budgets.map((b) => b.planned)); const actual = sum(state.budgets.map((b) => b.actual))

  if (!can.seeGivingSummary(r)) return <><PageHeader eyebrow="Module 2" title="Financial Management & Stewardship" /><Restricted what="financial records" /></>

  return (
    <>
      <PageHeader eyebrow="Module 2" title="Financial Management & Stewardship" text="Giving, funds, budgets, expenses and reconciliation. QuickBooks stays in place; this is the unified view on top of it." actions={detail && <Button variant="outline" icon={<Download size={16} />} onClick={() => exportCsv(state.gifts, state)}>Export giving</Button>} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Contributions this month" value={money(thisMonth)} sub={`${giftsInMonth(state).length} gifts`} icon={Landmark} tone="midnight" />
        <Kpi label="Awaiting reconciliation" value={unreconciled.length} sub={money(sum(unreconciled.map((g) => g.amount)))} icon={CheckCircle2} to="/admin/finance?tab=giving" />
        <Kpi label="Expense requests" value={pendingExp.length} sub={money(sum(pendingExp.map((x) => x.amount)))} icon={Receipt} to="/admin/finance?tab=expenses" />
        <Kpi label="Month budget used" value={`${Math.round((actual / planned) * 100)}%`} sub={`${money(actual)} of ${money(planned)}`} icon={Wallet} to="/admin/finance?tab=budgets" />
      </div>
      <Tabs className="mt-6" value={tab} onChange={(t) => setParams({ tab: t })} items={[{ id: 'overview', label: 'Overview' }, { id: 'giving', label: 'Giving', count: unreconciled.length }, { id: 'funds', label: 'Funds' }, { id: 'budgets', label: 'Budgets' }, { id: 'expenses', label: 'Expenses', count: pendingExp.length }, { id: 'statements', label: 'Statements' }]} />

      {tab === 'overview' && (
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Panel title="Giving trend" subtitle="Last 6 months, all funds" className="lg:col-span-2"><BarChart data={trend.map((t) => ({ label: monthLabel(t.key), value: t.total }))} format={(n) => money(n)} height={180} /></Panel>
          <Panel title="By fund" subtitle="Last 30 days">
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-4"><Donut size={110} segments={byFund.map((x, i) => ({ label: x.fund.name, value: x.total, color: fundColors[i] }))} /><ul className="text-xs space-y-1.5 flex-1 min-w-0 w-full">{byFund.map((x, i) => <li key={x.fund.id} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: fundColors[i] }} /><span className="flex-1 truncate">{x.fund.name}</span><span className="font-mono">{money(x.total)}</span></li>)}</ul></div>
          </Panel>
          <Panel title="Cash-flow view" subtitle="Illustrative month" className="lg:col-span-3">
            <div className="grid gap-3 sm:grid-cols-4 text-sm">
              <div className="rounded-lg bg-linen p-3"><p className="text-xs text-slate">Received (month)</p><p className="font-display text-xl font-semibold">{money(thisMonth)}</p></div>
              <div className="rounded-lg bg-linen p-3"><p className="text-xs text-slate">Budgeted spend</p><p className="font-display text-xl font-semibold">{money(planned)}</p></div>
              <div className="rounded-lg bg-linen p-3"><p className="text-xs text-slate">Actual spend</p><p className="font-display text-xl font-semibold">{money(actual)}</p></div>
              <div className={`rounded-lg p-3 ${thisMonth - actual >= 0 ? 'bg-[#E6F3EC]' : 'bg-[#FBE9E7]'}`}><p className="text-xs text-slate">Net (month)</p><p className="font-display text-xl font-semibold">{money(thisMonth - actual)}</p></div>
            </div>
            <p className="text-xs text-slate mt-3 flex items-center gap-1.5"><TrendingUp size={13} /> Forecast and bank integration pull from QuickBooks Online and Stripe in the connected platform; this demo computes from recorded gifts and budget lines.</p>
          </Panel>
        </div>
      )}

      {tab === 'giving' && (detail ? <GivingTable /> : <div className="mt-4"><Restricted what="individual giving detail (summary only for your role)" /></div>)}

      {tab === 'funds' && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {state.funds.map((f) => { const total = sum(state.gifts.filter((g) => g.fundId === f.id).map((g) => g.amount)); return (
            <article key={f.id} className="card p-5">
              <div className="flex items-start justify-between gap-2"><div><h3 className="font-semibold">{f.name}</h3><p className="text-sm text-slate mt-0.5">{f.description}</p></div><Badge tone={f.type === 'restricted' ? 'danger' : f.type === 'designated' ? 'royal' : 'neutral'} className="capitalize">{f.type}</Badge></div>
              <p className="font-display text-2xl font-semibold mt-3">{money(total)} <span className="text-sm text-slate font-sans font-normal">received (6 months)</span></p>
              {f.goal && <><Progress value={total} max={f.goal} className="mt-2" /><p className="text-xs text-slate mt-1">{Math.round((total / f.goal) * 100)}% of {money(f.goal)} goal</p></>}
            </article>
          ) })}
        </div>
      )}

      {tab === 'budgets' && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {state.ministries.map((m) => { const lines = state.budgets.filter((b) => b.ministryId === m.id); const p = sum(lines.map((l) => l.planned)); const a = sum(lines.map((l) => l.actual)); return (
            <article key={m.id} className="card p-4">
              <div className="flex items-center justify-between"><h3 className="font-semibold flex items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: m.color }} />{m.name}</h3><span className={`font-mono text-sm ${a > p ? 'text-danger' : ''}`}>{money(a)} / {money(p)}</span></div>
              <Progress value={a} max={p} className="mt-2" color={a > p ? 'bg-danger' : 'bg-royal'} />
              <ul className="mt-3 grid grid-cols-1 min-[400px]:grid-cols-2 gap-x-4 gap-y-1 text-xs">{lines.map((l) => <li key={l.id} className="flex justify-between"><span className="text-slate">{l.category}</span><span className={`font-mono ${l.actual > l.planned ? 'text-danger' : ''}`}>{money(l.actual)}/{money(l.planned)}</span></li>)}</ul>
              <p className="text-[13px] text-slate mt-2">Annual budget {money(m.annualBudget)} · monthly view</p>
            </article>
          ) })}
        </div>
      )}

      {tab === 'expenses' && <Expenses />}
      {tab === 'statements' && (detail ? <Statements /> : <div className="mt-4"><Restricted what="donor statements" /></div>)}
    </>
  )

  function GivingTable() {
    const [filter, setFilter] = useState<'all' | 'recorded' | 'reconciled'>('all')
    const [adding, setAdding] = useState(false)
    const rows = useMemo(() => state.gifts.filter((g) => filter === 'all' || g.status === filter).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 150), [filter, state.gifts])
    const cols: Column<Gift>[] = [
      { key: 'date', header: 'Date', render: (g) => fmtShort(g.date) },
      { key: 'donor', header: 'Donor', render: (g) => g.memberId ? fullName(memberById(state, g.memberId)) : g.donorName ?? 'Anonymous' },
      { key: 'fund', header: 'Fund', render: (g) => state.funds.find((f) => f.id === g.fundId)?.name, hideBelow: 'md' },
      { key: 'method', header: 'Method', render: (g) => <span className="capitalize">{g.method}{g.recurring ? ' · recurring' : ''}</span>, hideBelow: 'lg' },
      { key: 'amount', header: 'Amount', render: (g) => <span className="font-mono font-semibold">{money(g.amount)}</span>, className: 'text-right' },
      { key: 'status', header: 'Status', render: (g) => g.status === 'reconciled' ? <Badge tone="success">Reconciled</Badge> : <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); patch('gifts', g.id, { status: 'reconciled' }); log(who, 'Reconciled gift', money(g.amount)) }}>Reconcile</Button> },
    ]
    function add(e: FormEvent<HTMLFormElement>) {
      e.preventDefault(); const fd = new FormData(e.currentTarget)
      upsert('gifts', { id: uid('g'), memberId: String(fd.get('member')) || undefined, amount: Number(fd.get('amount')), fundId: String(fd.get('fund')), method: String(fd.get('method')) as Gift['method'], date: String(fd.get('date')) || todayIso(), status: 'recorded' })
      log(who, 'Recorded gift', money(Number(fd.get('amount')))); setAdding(false)
    }
    return (
      <div className="mt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex gap-1.5">{(['all', 'recorded', 'reconciled'] as const).map((f) => <button key={f} type="button" onClick={() => setFilter(f)} className={`rounded-full px-3 py-1.5 text-xs font-medium border capitalize ${filter === f ? 'bg-midnight text-white border-midnight' : 'border-line bg-paper'}`}>{f === 'recorded' ? 'Awaiting reconciliation' : f}</button>)}</div>
          <div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => { unreconciled.forEach((g) => patch('gifts', g.id, { status: 'reconciled' })); log(who, 'Reconciled batch', `${unreconciled.length} gifts`) }} disabled={!unreconciled.length} icon={<Check size={14} />}>Reconcile all ({unreconciled.length})</Button><Button size="sm" icon={<Plus size={14} />} onClick={() => setAdding(true)}>Record gift</Button></div>
        </div>
        <Table columns={cols} rows={rows} rowKey={(g) => g.id} caption="Gifts" />
        <p className="text-xs text-slate mt-2">Showing the most recent {rows.length}. Online gifts from the church website land here as “recorded” until the finance team reconciles them against the bank deposit.</p>
        <Modal open={adding} onClose={() => setAdding(false)} title="Record a gift" size="sm">
          <form onSubmit={add} className="grid gap-3">
            <Select name="member" label="Donor"><option value="">Anonymous / cash plate</option>{state.members.filter((m) => m.status !== 'visitor').map((m) => <option key={m.id} value={m.id}>{fullName(m)}</option>)}</Select>
            <Input name="amount" type="number" min={1} step="0.01" label="Amount" required />
            <Select name="fund" label="Fund">{state.funds.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</Select>
            <Select name="method" label="Method"><option>check</option><option>cash</option><option>card</option><option>online</option><option>ach</option><option>text</option></Select>
            <Input name="date" type="date" label="Date" defaultValue={todayIso()} />
            <div className="flex justify-end gap-2 pt-2"><Button variant="ghost" onClick={() => setAdding(false)}>Cancel</Button><Button type="submit">Save</Button></div>
          </form>
        </Modal>
      </div>
    )
  }

  function Expenses() {
    const [adding, setAdding] = useState(false)
    const list = [...state.expenses].sort((a, b) => (a.status === 'requested' ? -1 : 1) - (b.status === 'requested' ? -1 : 1) || b.date.localeCompare(a.date))
    function decide(x: Expense, s: Expense['status']) {
      patch('expenses', x.id, { status: s })
      const ap = state.approvals.find((a) => a.relatedId === x.id); if (ap) patch('approvals', ap.id, { status: s === 'rejected' ? 'rejected' : 'approved' })
      if (s === 'paid') { const line = state.budgets.find((b) => b.ministryId === x.ministryId && b.category === x.category) ?? state.budgets.find((b) => b.ministryId === x.ministryId); if (line) patch('budgets', line.id, { actual: line.actual + x.amount }) }
      log(who, `Expense ${s}`, `${x.vendor} ${money(x.amount)}`)
    }
    function add(e: FormEvent<HTMLFormElement>) {
      e.preventDefault(); const fd = new FormData(e.currentTarget)
      const x: Expense = { id: uid('x'), ministryId: String(fd.get('ministry')), vendor: String(fd.get('vendor')), amount: Number(fd.get('amount')), category: String(fd.get('category')), status: 'requested', requestedById: state.currentMemberId, date: todayIso(), note: String(fd.get('note') ?? '') }
      upsert('expenses', x); upsert('approvals', { id: uid('ap'), kind: 'expense', title: x.note || x.vendor, requester: who, amount: x.amount, status: 'pending', createdAt: todayIso(), relatedId: x.id, relatedModule: 'finance' })
      log(who, 'Requested expense', `${x.vendor} ${money(x.amount)}`); setAdding(false)
    }
    return (
      <div className="mt-4">
        <div className="flex justify-end mb-3"><Button size="sm" icon={<Plus size={14} />} onClick={() => setAdding(true)}>New expense request</Button></div>
        <div className="grid gap-3">
          {list.map((x) => (
            <article key={x.id} className="card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2"><Badge tone={x.status === 'requested' ? 'gold' : x.status === 'approved' ? 'royal' : x.status === 'paid' ? 'success' : 'danger'} className="capitalize">{x.status}</Badge><Badge>{state.ministries.find((m) => m.id === x.ministryId)?.name}</Badge><span className="stamp">{fmtShort(x.date)}</span></div>
                <p className="font-semibold mt-1.5">{x.vendor} <span className="font-mono text-slate font-normal">· {money(x.amount)}</span>{x.amount > 2500 && <Badge tone="warning" className="ml-2">Board approval</Badge>}</p>
                <p className="text-sm text-slate">{x.note} · {x.category} · requested by {personName(state, x.requestedById)}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {x.status === 'requested' && can.approveFinance(r) && <><Button size="sm" variant="outline" icon={<X size={14} />} onClick={() => decide(x, 'rejected')}>Reject</Button><Button size="sm" icon={<Check size={14} />} onClick={() => decide(x, 'approved')}>Approve</Button></>}
                {x.status === 'approved' && detail && <Button size="sm" icon={<Receipt size={14} />} onClick={() => decide(x, 'paid')}>Mark paid</Button>}
                {x.status === 'requested' && !can.approveFinance(r) && <span className="text-xs text-slate flex items-center gap-1"><Lock size={12} /> Finance Office decides</span>}
              </div>
            </article>
          ))}
        </div>
        <Modal open={adding} onClose={() => setAdding(false)} title="Expense request" size="sm">
          <form onSubmit={add} className="grid gap-3">
            <Select name="ministry" label="Ministry">{state.ministries.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</Select>
            <Input name="vendor" label="Vendor" required /><Input name="amount" type="number" min={1} label="Amount" required />
            <Select name="category" label="Category"><option>Programs</option><option>Supplies</option><option>Events</option><option>Equipment</option><option>Food</option><option>Vehicle</option><option>Software</option></Select>
            <Input name="note" label="What is it for?" />
            <div className="flex justify-end gap-2 pt-2"><Button variant="ghost" onClick={() => setAdding(false)}>Cancel</Button><Button type="submit">Submit for approval</Button></div>
          </form>
        </Modal>
      </div>
    )
  }

  function Statements() {
    const [memberId, setMemberId] = useState('m_20')
    const year = todayIso().slice(0, 4)
    const m = memberById(state, memberId)
    const gifts = state.gifts.filter((g) => g.memberId === memberId && g.date.startsWith(year)).sort((a, b) => a.date.localeCompare(b.date))
    const givers = state.members.filter((x) => state.gifts.some((g) => g.memberId === x.id)).sort((a, b) => a.last.localeCompare(b.last))
    function download() {
      if (!m) return
      const lines = [state.church.name, `${state.church.address}, ${state.church.city}`, '', `Annual Giving Statement, ${year}`, fullName(m), m.address, '', 'Date,Fund,Method,Amount', ...gifts.map((g) => `${g.date},${state.funds.find((f) => f.id === g.fundId)?.name},${g.method},${g.amount.toFixed(2)}`), '', `Total,,,${sum(gifts.map((g) => g.amount)).toFixed(2)}`, '', `${state.church.name} is a 501(c)(3) organization. No goods or services were provided in exchange for these contributions.`]
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' })); a.download = `statement-${m.last}-${year}.csv`; a.click()
      log(who, 'Generated statement', fullName(m))
    }
    return (
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <div className="card p-4">
          <Select label="Donor" value={memberId} onChange={(e) => setMemberId(e.target.value)}>{givers.map((x) => <option key={x.id} value={x.id}>{fullName(x)}</option>)}</Select>
          <p className="text-xs text-slate mt-3">Annual statements for every donor can be generated in one batch each January and delivered to the member portal. Receipts for individual gifts are emailed automatically.</p>
          <div className="mt-4 flex gap-2"><Button onClick={download} icon={<Download size={16} />}>Download {year} statement</Button></div>
        </div>
        <div className="card p-6 print-page">
          <p className="font-display text-xl font-semibold">{state.church.name}</p><p className="text-xs text-slate">{state.church.address}, {state.church.city}</p>
          <p className="stamp mt-4">Annual giving statement · {year}</p>
          <p className="font-semibold mt-1">{m ? fullName(m) : ''}</p><p className="text-sm text-slate">{m?.address}</p>
          <table className="w-full text-sm mt-4"><thead><tr className="text-left text-xs text-slate uppercase font-mono"><th className="py-1">Date</th><th className="py-1">Fund</th><th className="py-1 text-right">Amount</th></tr></thead><tbody>{gifts.map((g) => <tr key={g.id} className="border-t border-line"><td className="py-1">{fmtDate(g.date)}</td><td className="py-1">{state.funds.find((f) => f.id === g.fundId)?.name}</td><td className="py-1 text-right font-mono">{money(g.amount, true)}</td></tr>)}</tbody><tfoot><tr className="border-t-2 border-midnight font-semibold"><td className="py-2" colSpan={2}>Total</td><td className="py-2 text-right font-mono">{money(sum(gifts.map((g) => g.amount)), true)}</td></tr></tfoot></table>
          <p className="text-[13px] text-slate mt-4">{state.church.name} is a 501(c)(3) organization. No goods or services were provided in exchange for these contributions.</p>
        </div>
      </div>
    )
  }
}

function exportCsv(gifts: Gift[], s: { funds: { id: string; name: string }[]; members: { id: string; first: string; last: string }[] }) {
  const lines = ['Date,Donor,Fund,Method,Amount,Status', ...gifts.map((g) => { const m = s.members.find((x) => x.id === g.memberId); return `${g.date},"${m ? m.first + ' ' + m.last : g.donorName ?? 'Anonymous'}",${s.funds.find((f) => f.id === g.fundId)?.name},${g.method},${g.amount},${g.status}` })]
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' })); a.download = 'giving-export.csv'; a.click()
}
