import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Church, ShieldCheck, Plug, Building2, Database, Check, Lock, RotateCcw } from 'lucide-react'
import { useDemo } from '@/data/store'
import { roleLabel, can } from '@/data/selectors'
import type { Role } from '@/data/types'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Input, Toggle } from '@/components/Field'
import { Tabs } from '@/components/Tabs'
import { PageHeader, Panel, Restricted } from '../layout/shared'
import { roleDefs } from '@/config/platform'
import { PoweredBy } from '@/components/Logo'

type Tab = 'church' | 'roles' | 'security' | 'integrations' | 'tenants'
const roles: Role[] = ['pastor', 'admin', 'finance', 'secretary', 'ministry', 'volunteer', 'member', 'support']
const perms: { label: string; test: (r: Role) => boolean }[] = [
  { label: 'Giving detail (individual gifts)', test: can.seeGivingDetail },
  { label: 'Giving summary', test: can.seeGivingSummary },
  { label: 'Confidential pastoral care', test: can.seeConfidentialCare },
  { label: 'Approve expenses', test: can.approveFinance },
  { label: 'Approve operations (events, facilities, hires)', test: can.approveOps },
  { label: 'Approve communications', test: can.approveComms },
  { label: 'Manage settings and integrations', test: can.manageSettings },
]

export function Settings() {
  const { state, set, reset, log } = useDemo()
  useDocumentMeta('Settings | Saint Paul’s Everywhere')
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'church'
  const r = state.role
  const [church, setChurch] = useState(state.church)
  const [saved, setSaved] = useState(false)
  if (!can.manageSettings(r) && r !== 'pastor') return <><PageHeader title="Settings" /><Restricted what="settings" /></>
  const readOnly = r === 'pastor'

  return (
    <>
      <PageHeader eyebrow="Administration" title="Settings" text="Church profile, roles and permissions, security, integrations and multi-church tenancy." />
      <Tabs value={tab} onChange={(t) => setParams({ tab: t })} items={[{ id: 'church', label: 'Church profile' }, { id: 'roles', label: 'Roles & permissions' }, { id: 'security', label: 'Security' }, { id: 'integrations', label: 'Integrations' }, { id: 'tenants', label: 'Tenants' }]} />

      {tab === 'church' && (
        <Panel className="mt-4" title={<span className="flex items-center gap-2"><Church size={18} className="text-gold" /> Church profile</span>} subtitle="Shown on the website, bulletins, letters and statements">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Church name" value={church.name} onChange={(e) => setChurch({ ...church, name: e.target.value })} disabled={readOnly} />
            <Input label="Short name" value={church.shortName} onChange={(e) => setChurch({ ...church, shortName: e.target.value })} disabled={readOnly} />
            <Input className="sm:col-span-2" label="Tagline" value={church.tagline} onChange={(e) => setChurch({ ...church, tagline: e.target.value })} disabled={readOnly} />
            <Input label="Senior pastor" value={church.pastor} onChange={(e) => setChurch({ ...church, pastor: e.target.value })} disabled={readOnly} />
            <Input label="Phone" value={church.phone} onChange={(e) => setChurch({ ...church, phone: e.target.value })} disabled={readOnly} />
            <Input label="Address" value={church.address} onChange={(e) => setChurch({ ...church, address: e.target.value })} disabled={readOnly} />
            <Input label="City, state ZIP" value={church.city} onChange={(e) => setChurch({ ...church, city: e.target.value })} disabled={readOnly} />
            <Input label="Email" value={church.email} onChange={(e) => setChurch({ ...church, email: e.target.value })} disabled={readOnly} />
            <Input label="Website" value={church.website} onChange={(e) => setChurch({ ...church, website: e.target.value })} disabled={readOnly} />
          </div>
          {!readOnly && <div className="mt-4 flex items-center gap-3"><Button onClick={() => { set('church', church); log(roleLabel[r], 'Updated church profile', church.name); setSaved(true); setTimeout(() => setSaved(false), 2000) }} icon={saved ? <Check size={16} /> : undefined}>{saved ? 'Saved' : 'Save profile'}</Button><span className="text-xs text-slate">Changes apply to the church website and member portal immediately.</span></div>}
        </Panel>
      )}

      {tab === 'roles' && (
        <Panel className="mt-4" title={<span className="flex items-center gap-2"><ShieldCheck size={18} className="text-gold" /> Roles and permissions</span>} subtitle="Not everyone should see the same information. Switch accounts from the menu at the top right to see it enforced.">
          <div className="overflow-x-auto"><table className="w-full text-xs min-w-[720px]"><thead><tr className="text-left"><th className="py-2 pr-3 stamp">Permission</th>{roles.map((x) => <th key={x} className="py-2 px-2 stamp text-center">{roleLabel[x].split(' ')[0]}</th>)}</tr></thead><tbody>{perms.map((p) => <tr key={p.label} className="border-t border-line"><td className="py-2 pr-3">{p.label}</td>{roles.map((x) => <td key={x} className="py-2 px-2 text-center">{p.test(x) ? <Check size={14} className="inline text-success" /> : <span className="text-line">—</span>}</td>)}</tr>)}</tbody></table></div>
          <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-xs text-slate">{roleDefs.map((d) => <li key={d.id} className="rounded-lg bg-linen p-2.5"><span className="font-semibold text-midnight">{d.label}:</span> {d.access}</li>)}</ul>
        </Panel>
      )}

      {tab === 'security' && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Panel title={<span className="flex items-center gap-2"><Lock size={18} className="text-gold" /> Security controls</span>}>
            <Toggle checked={state.settings.mfa} onChange={(v) => { set('settings', { ...state.settings, mfa: v }); log(roleLabel[r], v ? 'Enabled MFA requirement' : 'Disabled MFA requirement', 'All staff') }} label="Require multi-factor authentication" description="All staff and volunteer accounts." id="mfa" />
            <Toggle checked={state.settings.guideOn} onChange={(v) => set('settings', { ...state.settings, guideOn: v })} label="Guide mode" description="Plain-language walkthrough panel at the top of every admin page." />
            <Toggle checked={state.settings.agentsEnabled} onChange={(v) => { set('settings', { ...state.settings, agentsEnabled: v }); log(roleLabel[r], v ? 'Resumed agents' : 'Paused agents', 'All') }} label="AI agents enabled" description="Agents draft and route; humans approve." />
            <ul className="mt-3 text-sm space-y-1.5 text-slate"><li className="flex gap-2"><Check size={14} className="text-success shrink-0 mt-0.5" /> Encryption in transit and at rest</li><li className="flex gap-2"><Check size={14} className="text-success shrink-0 mt-0.5" /> Audit log on every record ({state.audit.length} entries)</li><li className="flex gap-2"><Check size={14} className="text-success shrink-0 mt-0.5" /> Nightly backups, 7-year retention for financial records</li><li className="flex gap-2"><Check size={14} className="text-success shrink-0 mt-0.5" /> PCI-compliant payment processor; no card numbers stored</li><li className="flex gap-2"><Check size={14} className="text-success shrink-0 mt-0.5" /> Confidential pastoral records excluded from AI agents</li></ul>
          </Panel>
          <Panel title={<span className="flex items-center gap-2"><Database size={18} className="text-gold" /> Demo data</span>} subtitle="This demo stores everything in your browser">
            <p className="text-sm text-slate">Reset replaces every change across the church website, member portal and admin with the original sample data.</p>
            <Button variant="danger" className="mt-3" icon={<RotateCcw size={16} />} onClick={() => { if (confirm('Reset all demo data?')) reset() }}>Reset demo data</Button>
          </Panel>
        </div>
      )}

      {tab === 'integrations' && (
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {state.settings.integrations.map((i) => (
            <article key={i.id} className="card p-4 flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-royal-50 text-royal flex items-center justify-center shrink-0"><Plug size={18} /></div>
              <div className="flex-1 min-w-0"><p className="font-semibold">{i.name}</p><Badge tone={i.status === 'connected' ? 'success' : i.status === 'available' ? 'neutral' : 'gold'} className="mt-1 capitalize">{i.status}</Badge></div>
              {i.status === 'available' && !readOnly && <Button size="sm" variant="outline" onClick={() => { set('settings', { ...state.settings, integrations: state.settings.integrations.map((x) => (x.id === i.id ? { ...x, status: 'connected' } : x)) }); log(roleLabel[r], 'Connected integration', i.name) }}>Connect</Button>}
            </article>
          ))}
          <p className="md:col-span-2 lg:col-span-3 text-xs text-slate">Integration layer: payment processors, accounting, email, SMS, calendars, background checks and payroll. Existing systems stay in place; ChurchConnect becomes the unified view.</p>
        </div>
      )}

      {tab === 'tenants' && (
        <Panel className="mt-4" title={<span className="flex items-center gap-2"><Building2 size={18} className="text-gold" /> Multi-church tenancy</span>} subtitle="One shared platform; each church's data logically isolated">
          <div className="card divide-y divide-line">{state.settings.tenants.map((t) => <div key={t.id} className="p-3 flex items-center gap-3 text-sm"><span className="flex-1 min-w-0"><span className="block font-medium">{t.name}</span><span className="block text-xs text-slate">{t.plan} · {t.members} member records</span></span><Badge tone={t.status === 'Pilot' ? 'gold' : t.status === 'Onboarding' ? 'royal' : 'neutral'}>{t.status}</Badge></div>)}</div>
          <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate"><span>Tenant administration is performed by DataIsData under the support agreement.</span><PoweredBy /></div>
        </Panel>
      )}
    </>
  )
}
