import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useDemo } from '@/data/store'
import { fmtDate } from '@/data/dates'
import { personName } from '@/data/selectors'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { LinkButton } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { useMe, PageTitle } from './shared'

export function PortalCare() {
  const { state } = useDemo()
  const me = useMe()
  useDocumentMeta(`Prayer and care | ${state.church.name}`)
  const mine = state.care.filter((c) => c.memberId === me.id).sort((a, b) => b.date.localeCompare(a.date))
  return (
    <>
      <PageTitle title="Prayer and care" text="Requests you have shared with the care team and where they stand." action={<LinkButton to="/prayer">Share a new request</LinkButton>} />
      <section className="grid gap-3">
        {mine.map((c) => (
          <article key={c.id} className="card p-5">
            <div className="flex flex-wrap items-center gap-2"><Badge tone="royal" className="capitalize">{c.kind}</Badge><Badge tone={c.status === 'closed' ? 'success' : c.status === 'new' ? 'gold' : 'neutral'} className="capitalize">{c.status.replace('-', ' ')}</Badge>{c.confidential && <Badge><Lock size={11} /> Confidential</Badge>}<span className="stamp ml-auto">{fmtDate(c.date)}</span></div>
            <p className="mt-3">{c.text}</p>
            <p className="text-sm text-slate mt-2">{c.assigneeId ? `With ${personName(state, c.assigneeId)}` : 'Awaiting assignment'}</p>
            {c.updates.length > 0 && <ul className="mt-3 border-l-2 border-gold/40 pl-3 space-y-1.5">{c.updates.map((u, i) => <li key={i} className="text-sm"><span className="stamp">{fmtDate(u.date)}</span> {u.note}</li>)}</ul>}
          </article>
        ))}
        {mine.length === 0 && <p className="card p-6 text-slate">No requests on file. <Link to="/prayer" className="text-royal underline">Share one</Link> any time.</p>}
      </section>
    </>
  )
}
