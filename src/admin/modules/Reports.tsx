import { Download, Landmark, TrendingUp, Church, Warehouse, HandHeart, Inbox, FileText } from 'lucide-react'
import { useDemo } from '@/data/store'
import { giftsInMonth, sum, monthlyGiving, activeMembers, visitors, needsFollowUp, pendingApprovals, pendingDrafts, openTasks, openMaintenance, openShifts, upcomingEvents, can } from '@/data/selectors'
import { money, monthLabel, todayIso, fmtShort } from '@/data/dates'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Button } from '@/components/Button'
import { BarChart, Sparkline } from '@/components/charts/BarChart'
import { PageHeader, Panel, Progress, Restricted } from '../layout/shared'

export function Reports() {
  const { state, upsert, log } = useDemo()
  useDocumentMeta('Executive Reporting | Saint Paul’s Everywhere')
  const r = state.role
  if (!can.seeGivingSummary(r)) return <><PageHeader eyebrow="Module 12" title="Executive Reporting & Decision Intelligence" /><Restricted what="executive reports" /></>
  const trend = monthlyGiving(state, 6)
  const thisMonth = sum(giftsInMonth(state).map((g) => g.amount))
  const planned = sum(state.budgets.map((b) => b.planned)); const actual = sum(state.budgets.map((b) => b.actual))
  const att11 = [...state.attendance].sort((a, b) => a.date.localeCompare(b.date)).filter((a) => a.service === '9:45 AM')
  const avg4 = Math.round(sum(att11.slice(-4).map((a) => a.count)) / 4); const avgPrev = Math.round(sum(att11.slice(-8, -4).map((a) => a.count)) / 4)
  const firstTime = sum(state.attendance.slice(0, 8).map((a) => a.firstTime))
  const roomUse = state.rooms.map((rm) => ({ rm, n: state.events.filter((e) => e.roomId === rm.id).length + state.reservations.filter((x) => x.roomId === rm.id && !x.eventId).length }))
  const volunteerHours = sum(state.staff.filter((s) => s.type === 'volunteer').map((s) => s.hoursThisMonth))
  const inMinistry = Math.round((activeMembers(state).filter((m) => m.ministryIds.length).length / activeMembers(state).length) * 100)

  const questions = [
    { icon: Landmark, q: 'How are we doing financially?', a: `${money(thisMonth)} received this month (${trend[5].total >= trend[4].total ? 'up' : 'down'} vs last month). Spending is ${money(actual)} against ${money(planned)} budgeted (${Math.round((actual / planned) * 100)}%). Building fund at ${Math.round((sum(state.gifts.filter((g) => g.fundId === 'f_building').map((g) => g.amount)) / (state.funds.find((f) => f.id === 'f_building')?.goal ?? 150000)) * 100)}% of goal.`, body: <BarChart data={trend.map((t) => ({ label: monthLabel(t.key), value: t.total }))} format={(n) => money(n)} height={110} /> },
    { icon: TrendingUp, q: 'Are we growing?', a: `Average Sunday attendance is ${avg4} (${avg4 >= avgPrev ? '+' : ''}${avg4 - avgPrev} vs the prior four weeks). ${firstTime} first-time guests in the last month; ${visitors(state).length} are in the visitor pipeline. ${inMinistry}% of active members serve in a ministry.`, body: <Sparkline values={att11.map((a) => a.count)} width={320} height={70} color="#4B2A7B" /> },
    { icon: Church, q: 'Which ministries need support?', a: `${needsFollowUp(state).length} members have had no contact in 90+ days. ${openShifts(state).length} volunteer shifts are open. ${state.budgets.filter((b) => b.actual > b.planned).length} budget lines are over plan this month.`, body: <ul className="space-y-1.5 text-xs">{state.ministries.slice(0, 5).map((m) => { const l = state.budgets.filter((b) => b.ministryId === m.id); const a = sum(l.map((x) => x.actual)); const p = sum(l.map((x) => x.planned)); return <li key={m.id}><div className="flex justify-between"><span>{m.name}</span><span className="font-mono">{Math.round((a / p) * 100)}%</span></div><Progress value={a} max={p} className="mt-0.5" color={a > p ? 'bg-danger' : 'bg-royal'} /></li> })}</ul> },
    { icon: Warehouse, q: 'Are we using our facilities efficiently?', a: `${state.reservations.filter((x) => x.external && x.status === 'approved').length} external rentals approved this season (${money(sum(state.reservations.filter((x) => x.external && x.status === 'approved').map((x) => x.fee ?? 0)))}). ${openMaintenance(state).length} maintenance items open, ${openMaintenance(state).filter((m) => m.priority === 'urgent').length} urgent.`, body: <ul className="space-y-1 text-xs">{roomUse.sort((a, b) => b.n - a.n).slice(0, 5).map((x) => <li key={x.rm.id} className="flex justify-between"><span>{x.rm.name}</span><span className="font-mono">{x.n} bookings</span></li>)}</ul> },
    { icon: HandHeart, q: 'What impact are we making?', a: `${state.services.length} community service requests received; ${state.services.filter((s) => s.status === 'fulfilled' || s.status === 'referred').length} fulfilled or referred. ${volunteerHours} volunteer hours this month. ${state.programs.reduce((s, p) => s + p.completed, 0)} program completions.`, body: <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-[13px] sm:text-xs"><div className="rounded-lg bg-linen p-2"><p className="text-slate">Requests</p><p className="font-display text-xl font-semibold">{state.services.length}</p></div><div className="rounded-lg bg-linen p-2"><p className="text-slate">Vol. hours</p><p className="font-display text-xl font-semibold">{volunteerHours}</p></div><div className="rounded-lg bg-linen p-2"><p className="text-slate">Completions</p><p className="font-display text-xl font-semibold">{state.programs.reduce((s, p) => s + p.completed, 0)}</p></div></div> },
    { icon: Inbox, q: 'What needs my attention?', a: `${pendingApprovals(state).length} approvals, ${pendingDrafts(state).length} agent drafts and ${openTasks(state).length} open tasks (${openTasks(state).filter((t) => t.due < todayIso()).length} overdue). ${upcomingEvents(state).filter((e) => e.stage === 'proposed').length} events await approval.`, body: <ul className="space-y-1 text-xs">{pendingApprovals(state).slice(0, 4).map((a) => <li key={a.id} className="flex justify-between"><span className="truncate">{a.title}</span><span className="text-slate capitalize shrink-0 ml-2">{a.kind}</span></li>)}</ul> },
  ]

  function exportSummary() {
    const lines = [`${state.church.name}`, `Weekly Executive Summary · ${todayIso()}`, '', ...questions.flatMap((x) => [x.q.toUpperCase(), x.a, '']), 'Underlying records are available in Saint Paul’s Everywhere for verification.', 'Prepared automatically; reviewed by the Executive Administrator.']
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain' })); a.download = `executive-summary-${todayIso()}.txt`; a.click()
    upsert('documents', { id: `d_${Date.now()}`, title: `Weekly Executive Summary (${fmtShort(todayIso())})`, category: 'report', updated: todayIso(), ownerId: 'm_3', size: '8 KB' })
    log('Reports', 'Exported executive summary', todayIso())
  }

  return (
    <>
      <PageHeader eyebrow="Module 12" title="Executive Reporting & Decision Intelligence" text="Six questions leadership asks, answered from the same records every other module uses. Summaries are prepared weekly, monthly and quarterly, with the underlying data one click away." actions={<><Button variant="outline" icon={<FileText size={16} />} onClick={() => window.print()}>Print</Button><Button icon={<Download size={16} />} onClick={exportSummary}>Export weekly summary</Button></>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {questions.map((x) => (
          <Panel key={x.q} title={<span className="flex items-center gap-2"><x.icon size={18} className="text-gold" /> {x.q}</span>}>
            <p className="text-sm leading-relaxed">{x.a}</p>
            <div className="mt-3">{x.body}</div>
          </Panel>
        ))}
      </div>
      <Panel className="mt-4" title="Audit trail" subtitle="Every consequential action, by person or agent, with a timestamp">
        <div className="max-h-72 overflow-y-auto">
          <table className="w-full text-xs"><thead className="text-left stamp"><tr><th className="py-1.5 pr-3">When</th><th className="py-1.5 pr-3">Who</th><th className="py-1.5 pr-3">Action</th><th className="py-1.5">Target</th></tr></thead><tbody>{state.audit.map((a) => <tr key={a.id} className="border-t border-line"><td className="py-1.5 pr-3 font-mono whitespace-nowrap">{a.at}</td><td className="py-1.5 pr-3 whitespace-nowrap">{a.who}</td><td className="py-1.5 pr-3">{a.action}</td><td className="py-1.5">{a.target}</td></tr>)}</tbody></table>
        </div>
      </Panel>
    </>
  )
}
