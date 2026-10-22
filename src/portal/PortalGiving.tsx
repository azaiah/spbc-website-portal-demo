import { useMemo, useState } from 'react'
import { Download, Heart, Repeat } from 'lucide-react'
import { useDemo } from '@/data/store'
import { sum } from '@/data/selectors'
import { fmtDate, money } from '@/data/dates'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { LinkButton, Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Table, type Column } from '@/components/Table'
import { BarChart } from '@/components/charts/BarChart'
import type { Gift } from '@/data/types'
import { useMe, PageTitle, Stat } from './shared'

export function PortalGiving() {
  const { state } = useDemo()
  const me = useMe()
  useDocumentMeta(`Giving | ${state.church.name}`)
  const years = Array.from(new Set(state.gifts.filter((g) => g.memberId === me.id).map((g) => g.date.slice(0, 4)))).sort().reverse()
  const [year, setYear] = useState(years[0] ?? new Date().getFullYear().toString())
  const gifts = useMemo(() => state.gifts.filter((g) => g.memberId === me.id && g.date.startsWith(year)).sort((a, b) => b.date.localeCompare(a.date)), [state.gifts, me.id, year])
  const total = sum(gifts.map((g) => g.amount))
  const byFund = state.funds.map((f) => ({ f, t: sum(gifts.filter((g) => g.fundId === f.id).map((g) => g.amount)) })).filter((x) => x.t > 0)
  const byMonth = Array.from({ length: 12 }, (_, i) => { const k = `${year}-${String(i + 1).padStart(2, '0')}`; return { label: new Date(Number(year), i, 1).toLocaleDateString('en-US', { month: 'short' }).slice(0, 1), value: sum(gifts.filter((g) => g.date.startsWith(k)).map((g) => g.amount)) } })
  const recurring = gifts.some((g) => g.recurring)

  function statement() {
    const lines = [`${state.church.name}`, `Annual Giving Statement, ${year}`, `${me.first} ${me.last}`, me.address, '', 'Date,Fund,Method,Amount', ...gifts.map((g) => `${g.date},${state.funds.find((f) => f.id === g.fundId)?.name},${g.method},${g.amount.toFixed(2)}`), '', `Total,,,${total.toFixed(2)}`, '', `${state.church.name} is a 501(c)(3). No goods or services were provided in exchange for these contributions.`]
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' })); a.download = `giving-statement-${year}.csv`; a.click()
  }

  const cols: Column<Gift>[] = [
    { key: 'date', header: 'Date', render: (g) => fmtDate(g.date), sortValue: (g) => g.date },
    { key: 'fund', header: 'Fund', render: (g) => state.funds.find((f) => f.id === g.fundId)?.name },
    { key: 'method', header: 'Method', render: (g) => <span className="capitalize">{g.method}{g.recurring ? ' (recurring)' : ''}</span>, hideBelow: 'sm' },
    { key: 'status', header: 'Status', render: (g) => <Badge tone={g.status === 'reconciled' ? 'success' : 'neutral'} className="capitalize">{g.status}</Badge>, hideBelow: 'md' },
    { key: 'amount', header: 'Amount', render: (g) => <span className="font-mono font-semibold">{money(g.amount)}</span>, sortValue: (g) => g.amount, className: 'text-right' },
  ]

  return (
    <>
      <PageTitle title="Giving" text="Every gift, by fund and by month, with statements ready for tax time." action={<div className="flex gap-2"><Button variant="outline" onClick={statement} icon={<Download size={16} />}>{year} statement</Button><LinkButton to="/give" icon={<Heart size={16} />}>Give</LinkButton></div>} />
      <div className="flex flex-wrap gap-1.5 mb-4">{years.map((y) => <button key={y} type="button" onClick={() => setYear(y)} className={`rounded-full px-4 min-h-[44px] text-sm font-medium border ${year === y ? 'bg-midnight text-white border-midnight' : 'border-line bg-paper hover:border-slate'}`}>{y}</button>)}</div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label={`Total given in ${year}`} value={money(total)} sub={`${gifts.length} gifts`} hi />
        <Stat label="Largest fund" value={byFund.sort((a, b) => b.t - a.t)[0]?.f.name ?? 'None'} sub={byFund[0] ? money(byFund[0].t) : ''} />
        <Stat label="Recurring" value={recurring ? 'Active' : 'Not set'} sub={recurring ? <span className="inline-flex items-center gap-1"><Repeat size={12} /> Monthly to General Fund</span> : 'Set up on the Give page'} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="card p-5"><h2 className="font-semibold">By month</h2><div className="mt-4"><BarChart data={byMonth} format={(n) => money(n)} /></div></section>
        <section className="card p-5"><h2 className="font-semibold">By fund</h2><ul className="mt-3 space-y-3">{byFund.map((x) => <li key={x.f.id}><div className="flex justify-between text-sm"><span>{x.f.name}</span><span className="font-mono">{money(x.t)}</span></div><div className="mt-1 h-2 rounded-full bg-linen overflow-hidden"><div className="h-full bg-gold" style={{ width: `${(x.t / (total || 1)) * 100}%` }} /></div></li>)}</ul></section>
      </div>
      <section className="mt-6"><Table columns={cols} rows={gifts} rowKey={(g) => g.id} caption="Giving history" /></section>
    </>
  )
}
