import { Link } from 'react-router-dom'
import { ArrowRight, Globe, User, Bot, ShieldCheck, Database, Mail } from 'lucide-react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { PageHeader, Panel } from '../layout/shared'
import { modules } from '@/config/platform'
import { PoweredBy } from '@/components/Logo'

const tours = [
  { t: 'The one-database story', s: ['On the church website, send a prayer request or plan a visit to the Belt Campus', 'Come back here: Members → Pastoral care, or Members → Visitors', 'The record is already there, tagged with the campus and routed to the right person'], to: '/prayer' },
  { t: 'Events publish themselves', s: ['Events → open the lifecycle board', 'Every public event on the website (Trunk or Treat, Fire on Fridays, the 117th Anniversary) is a card here', 'Advance a proposed event and it appears on the public Events page'], to: '/admin/events' },
  { t: 'Find funding with the Grant Advisor', s: ['Open Grant Advisor and sort opportunities by fit', 'Open one to see why it fits Saint Paul’s, who applies (church or Nia) and the next steps', 'Draft a letter of inquiry, add it to the pipeline and tick off readiness items'], to: '/admin/grants' },
  { t: 'Fresh food and showers', s: ['Outreach → log a Friday distribution or a Dignity on the Go day', 'Watch households, guests and showers roll up', 'Those same numbers feed grant letters and the impact summary'], to: '/admin/outreach' },
  { t: 'Monday Morning Package', s: ['AI Agents → Run Monday package now', 'Review each draft; edit, approve or reject', 'Approved e-bulletins and letters move to the Office; reports to Documents'], to: '/admin/agents' },
  { t: 'Everyone sees only their part', s: ['Use the account menu (top right) to sign in as Min. Vernita Williams: imagiNATION only', 'Sign in as the Outreach Team: fresh food, showers and rides', 'Sign in as Angela Brooks (sample member): Saint Paul’s Everywhere for members'], to: '/login' },
]

export function Help() {
  useDocumentMeta('Help | Saint Paul’s Everywhere')
  return (
    <>
      <PageHeader eyebrow="Help" title="How to tour this demo" text="A working demo of Saint Paul’s Everywhere for The Saint Paul’s Baptist Church. Changes persist in your browser until you reset." />
      <div className="grid gap-4 md:grid-cols-2">
        {tours.map((x) => <Panel key={x.t} title={x.t}><ol className="list-decimal pl-5 text-sm space-y-1">{x.s.map((s) => <li key={s}>{s}</li>)}</ol><Link to={x.to} className="mt-1 hit gap-1 text-sm font-medium text-royal">Start here <ArrowRight size={14} /></Link></Panel>)}
      </div>
      <Panel className="mt-4" title="The three surfaces">
        <ul className="grid sm:grid-cols-3 gap-3 text-sm">
          <li className="rounded-lg bg-linen p-3"><Globe size={18} className="text-gold" /><p className="font-semibold mt-2">Church website</p><p className="text-slate text-xs mt-1">Public front door: both campuses, life stages, events (formerly myspbc.events), watch, give, prayer, outreach, City of Possibility, AI assistant.</p><Link to="/" className="text-xs text-royal font-medium mt-1 hit">Open</Link></li>
          <li className="rounded-lg bg-linen p-3"><User size={18} className="text-gold" /><p className="font-semibold mt-2">Member portal</p><p className="text-slate text-xs mt-1">Your life stage, events, groups, giving (via Pushpay), prayer requests, profile and consent.</p><Link to="/portal" className="text-xs text-royal font-medium mt-1 hit">Open</Link></li>
          <li className="rounded-lg bg-linen p-3"><ShieldCheck size={18} className="text-gold" /><p className="font-semibold mt-2">Admin and CRM</p><p className="text-slate text-xs mt-1">Every module, the AI agent workforce, the Grant Advisor, approvals and dashboards, scoped by role.</p><Link to="/admin" className="text-xs text-royal font-medium mt-1 hit">You are here</Link></li>
        </ul>
      </Panel>
      <Panel className="mt-4" title="The core modules">
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">{modules.map((m) => <li key={m.id} className="flex items-center gap-2 rounded-lg border border-line p-2.5"><m.icon size={16} className="text-royal shrink-0" /><span className="flex-1">{m.n}. {m.name}</span>{m.firstRelease && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" title="First release" />}</li>)}</ul>
      </Panel>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Panel title={<span className="flex items-center gap-2"><Bot size={18} className="text-gold" /> About the agents</span>}><p className="text-sm text-slate">In this demo the agents are simulated: drafts are generated from live data when you run the Monday package or submit requests. In the production platform they are scoped language-model agents with access only to the records their task needs, and every action still ends in a human approval.</p></Panel>
        <Panel title={<span className="flex items-center gap-2"><Database size={18} className="text-gold" /> About the data</span>}><p className="text-sm text-slate">Church facts, campuses, schedule, events, life stages and leaders’ names and titles come from Saint Paul’s public websites (myspbc.org, myspbc.events, grow.myspbc.org). Members other than leaders, all gifts, care requests, attendance and program figures are sample data; leaders are never given invented giving or care records. Nothing leaves your browser. The production platform runs on managed cloud infrastructure with encryption, audit trails, backups and per-church data isolation.</p><p className="text-sm text-slate mt-2 flex items-center gap-1.5"><Mail size={14} /> {/* TODO: confirm DataIsData contact address with Tony */}Questions about Saint Paul’s Everywhere: <a href="mailto:hello@dataisdata.com" className="text-royal underline hit">hello@dataisdata.com</a></p><PoweredBy className="mt-3" /></Panel>
      </div>
    </>
  )
}
