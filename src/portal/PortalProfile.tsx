import { useState } from 'react'
import { Save, CheckCircle2 } from 'lucide-react'
import { useDemo } from '@/data/store'
import { fmtDate } from '@/data/dates'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Input, Toggle } from '@/components/Field'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { useMe, PageTitle } from './shared'

export function PortalProfile() {
  const { state, patch, log } = useDemo()
  const me = useMe()
  useDocumentMeta(`Profile | ${state.church.name}`)
  const [form, setForm] = useState({ first: me.first, last: me.last, email: me.email, phone: me.phone, address: me.address })
  const [consent, setConsent] = useState(me.consent)
  const [saved, setSaved] = useState(false)
  const household = state.members.filter((m) => m.householdId === me.householdId && m.id !== me.id)
  function save() { patch('members', me.id, { ...form, consent }); log(`${form.first} ${form.last}`, 'Updated profile', 'Member portal'); setSaved(true); setTimeout(() => setSaved(false), 2500) }
  return (
    <>
      <PageTitle title="Profile" text="Your contact information and how the church may reach you." />
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <section className="card p-5 grid gap-4 sm:grid-cols-2">
          <Input label="First name" value={form.first} onChange={(e) => setForm({ ...form, first: e.target.value })} />
          <Input label="Last name" value={form.last} onChange={(e) => setForm({ ...form, last: e.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input className="sm:col-span-2" label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <div className="sm:col-span-2 border-t border-line pt-2">
            <Toggle checked={consent.email} onChange={(v) => setConsent({ ...consent, email: v })} label="Email announcements and newsletters" description="Weekly bulletin, event invitations, giving statements." />
            <Toggle checked={consent.sms} onChange={(v) => setConsent({ ...consent, sms: v })} label="Text message reminders" description="Event reminders and urgent church notices. Message rates may apply." />
          </div>
          <div className="sm:col-span-2 flex items-center gap-3"><Button onClick={save} icon={saved ? <CheckCircle2 size={16} /> : <Save size={16} />}>{saved ? 'Saved' : 'Save changes'}</Button><span className="text-xs text-slate">Changes update the church directory immediately.</span></div>
        </section>
        <div className="space-y-4">
          <section className="card p-5">
            <h2 className="font-semibold">Membership</h2>
            <dl className="mt-3 text-sm space-y-2">
              <div className="flex justify-between"><dt className="text-slate">Status</dt><dd><Badge tone="success" className="capitalize">{me.status}</Badge></dd></div>
              <div className="flex justify-between"><dt className="text-slate">Member since</dt><dd>{fmtDate(me.joinedAt)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate">Household</dt><dd>{state.households.find((h) => h.id === me.householdId)?.name}</dd></div>
              <div className="flex justify-between"><dt className="text-slate">Volunteer interests</dt><dd>{me.volunteerInterests.join(', ') || 'None listed'}</dd></div>
            </dl>
          </section>
          <section className="card p-5">
            <h2 className="font-semibold">Household</h2>
            <ul className="mt-3 text-sm divide-y divide-line">{household.map((h) => <li key={h.id} className="py-2 flex justify-between"><span>{h.first} {h.last}</span><span className="text-slate capitalize">{h.status}</span></li>)}{household.length === 0 && <li className="py-2 text-slate">No other household members on file.</li>}</ul>
          </section>
          <section className="rounded-xl border border-line bg-paper p-4 text-xs text-slate">Your giving history is visible only to you and the finance team. Pastoral care notes are visible only to the pastor and care coordinator.</section>
        </div>
      </div>
    </>
  )
}
