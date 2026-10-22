import { useDemo } from '@/data/store'
import { fullName, memberById } from '@/data/selectors'
import { fmtLong } from '@/data/dates'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { useMe, PageTitle } from './shared'

export function PortalGroups() {
  const { state, patch, log } = useDemo()
  const me = useMe()
  useDocumentMeta(`My ministries | ${state.church.name}`)
  const mine = state.ministries.filter((m) => me.ministryIds.includes(m.id))
  const others = state.ministries.filter((m) => !me.ministryIds.includes(m.id))
  const myShifts = state.shifts.filter((s) => me.ministryIds.includes(s.ministryId)).sort((a, b) => a.date.localeCompare(b.date))
  function join(id: string) { patch('members', me.id, { ministryIds: [...me.ministryIds, id] }); log(`${me.first} ${me.last}`, 'Joined ministry', state.ministries.find((m) => m.id === id)?.name ?? id) }
  function leave(id: string) { patch('members', me.id, { ministryIds: me.ministryIds.filter((x) => x !== id) }); log(`${me.first} ${me.last}`, 'Left ministry', state.ministries.find((m) => m.id === id)?.name ?? id) }
  return (
    <>
      <PageTitle title="My ministries" text="The groups you serve with, their schedules and the shifts coming up." />
      <section className="grid gap-3 md:grid-cols-2">
        {mine.map((m) => (
          <article key={m.id} className="card p-5 flex gap-4">
            <span className="w-1.5 rounded-full shrink-0" style={{ background: m.color }} />
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{m.name}</h2>
              <p className="text-sm text-slate mt-1">{m.description}</p>
              <p className="stamp mt-2">{m.meets} &middot; Led by {fullName(memberById(state, m.leaderId))}</p>
              <Button variant="ghost" size="sm" className="mt-3 -ml-2" onClick={() => leave(m.id)}>Leave group</Button>
            </div>
          </article>
        ))}
        {mine.length === 0 && <p className="card p-6 text-slate md:col-span-2">You are not part of a ministry yet. Pick one below.</p>}
      </section>
      {myShifts.length > 0 && (
        <section className="mt-8 card p-5">
          <h2 className="font-semibold">Upcoming shifts in my ministries</h2>
          <ul className="mt-3 divide-y divide-line">
            {myShifts.slice(0, 6).map((s) => <li key={s.id} className="py-2.5 flex items-center justify-between text-sm"><span>{s.role} <span className="text-slate">&middot; {state.ministries.find((m) => m.id === s.ministryId)?.name} &middot; {fmtLong(s.date)}</span></span><Badge tone={s.status === 'open' ? 'gold' : 'success'} className="capitalize">{s.status}</Badge></li>)}
          </ul>
        </section>
      )}
      <section className="mt-10">
        <h2 className="font-semibold">Explore other ministries</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {others.map((m) => <article key={m.id} className="card p-4"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: m.color }} /><h3 className="font-semibold">{m.name}</h3></div><p className="text-sm text-slate mt-1">{m.description}</p><p className="stamp mt-2">{m.meets}</p><Button variant="outline" size="sm" className="mt-3" onClick={() => join(m.id)}>Join</Button></article>)}
        </div>
      </section>
    </>
  )
}
