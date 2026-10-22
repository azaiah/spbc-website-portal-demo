import { useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Megaphone, FileText, Mail, FolderOpen, Users, Inbox, Check, Send, Download, Plus, Bot, ArrowRight } from 'lucide-react'
import { useDemo } from '@/data/store'
import { upcomingEvents, personName, can, fullName, visitors } from '@/data/selectors'
import { fmtShort, fmtLong, fmtTime, todayIso, relDays } from '@/data/dates'
import type { Announcement, Document as Doc } from '@/data/types'
import { uid } from '@/data/ids'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Input, Select, Textarea } from '@/components/Field'
import { Tabs } from '@/components/Tabs'
import { Modal } from '@/components/Modal'
import { PageHeader, Kpi, Panel } from '../layout/shared'

type Tab = 'announcements' | 'bulletin' | 'letters' | 'documents' | 'meetings' | 'requests'
const channelLabel = { bulletin: 'Bulletin', website: 'Website', email: 'Email', sms: 'SMS' }

export function Office() {
  const { state, patch, upsert, log } = useDemo()
  useDocumentMeta('Administrative Office | Saint Paul’s Everywhere')
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'announcements'
  const who = personName(state, state.currentMemberId)
  const r = state.role
  const drafts = state.announcements.filter((a) => a.status === 'draft')
  const incoming = [
    ...state.care.filter((c) => c.status === 'new').map((c) => ({ id: c.id, kind: 'Care request', from: c.name, to: c.kind === 'assistance' ? 'Outreach' : 'Pastoral care', date: c.date })),
    ...state.services.filter((s) => s.status === 'new').map((s) => ({ id: s.id, kind: 'Community request', from: s.name, to: 'Outreach coordinator', date: s.date })),
    ...state.reservations.filter((x) => x.status === 'requested').map((x) => ({ id: x.id, kind: 'Facility request', from: x.requester, to: 'Executive Administrator', date: x.date })),
    ...state.registrations.filter((x) => x.date === todayIso()).slice(0, 5).map((x) => ({ id: x.id, kind: 'Event registration', from: x.name, to: 'Events', date: x.date })),
  ]

  return (
    <>
      <PageHeader eyebrow="Module 3" title="Church Administrative Office" text="The church secretary's desk, digitized: announcements, the weekly bulletin, letters, documents, meetings and every incoming request routed to the right person." />
      <div className="grid gap-3 sm:grid-cols-4">
        <Kpi label="Announcements in draft" value={drafts.length} sub={`${state.announcements.filter((a) => a.status === 'scheduled').length} scheduled`} icon={Megaphone} tone="midnight" />
        <Kpi label="Incoming requests" value={incoming.length} sub="Auto-routed today" icon={Inbox} to="/admin/office?tab=requests" />
        <Kpi label="Documents" value={state.documents.length} sub="Policies, minutes, forms" icon={FolderOpen} to="/admin/office?tab=documents" />
        <Kpi label="Meetings this week" value={state.meetings.filter((m) => m.date >= todayIso()).length} sub="Agendas prepared" icon={Users} to="/admin/office?tab=meetings" />
      </div>
      <Tabs className="mt-6" value={tab} onChange={(t) => setParams({ tab: t })} items={[{ id: 'announcements', label: 'Announcements', count: drafts.length }, { id: 'bulletin', label: 'Bulletin' }, { id: 'letters', label: 'Letters' }, { id: 'documents', label: 'Documents' }, { id: 'meetings', label: 'Meetings' }, { id: 'requests', label: 'Incoming', count: incoming.length }]} />

      {tab === 'announcements' && <Announcements />}
      {tab === 'bulletin' && <Bulletin />}
      {tab === 'letters' && <Letters />}
      {tab === 'documents' && <Documents />}
      {tab === 'meetings' && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {state.meetings.map((m) => (
            <Panel key={m.id} title={m.title} subtitle={`${fmtLong(m.date)} · ${m.attendees.length} attendees`}>
              <p className="stamp mb-1">Agenda</p>
              <ol className="list-decimal pl-5 text-sm space-y-1">{m.agenda.map((a) => <li key={a}>{a}</li>)}</ol>
              {m.notes && <><p className="stamp mt-3 mb-1">Notes</p><p className="text-sm">{m.notes}</p></>}
              <p className="stamp mt-3 mb-1">Action items</p>
              <ul className="text-sm space-y-1">{m.actions.map((a, i) => <li key={i} className="flex items-center gap-2"><button type="button" onClick={() => { patch('meetings', m.id, { actions: m.actions.map((x, j) => (j === i ? { ...x, done: !x.done } : x)) }); log(who, 'Updated action item', a.text) }} className="tap -m-3 shrink-0 inline-flex items-center justify-center" aria-pressed={a.done} aria-label={a.text}><span className={`h-5 w-5 shrink-0 rounded border-2 flex items-center justify-center ${a.done ? 'bg-success border-success text-white' : 'border-line'}`}>{a.done && <Check size={12} />}</span></button><span className={a.done ? 'line-through text-slate' : ''}>{a.text}</span><span className="text-xs text-slate ml-auto">{personName(state, a.ownerId)}</span></li>)}</ul>
              <p className="text-xs text-slate mt-3 flex items-center gap-1.5"><Bot size={12} /> The Office Agent circulated this agenda and will summarize notes into action items after the meeting.</p>
            </Panel>
          ))}
        </div>
      )}
      {tab === 'requests' && (
        <div className="mt-4 card divide-y divide-line">
          {incoming.map((x) => <div key={x.id} className="p-3 flex flex-wrap sm:flex-nowrap items-center gap-x-3 gap-y-1 text-sm"><Badge tone="royal">{x.kind}</Badge><span className="flex-1 min-w-0 truncate">{x.from}</span><span className="text-slate inline-flex items-center gap-1.5 basis-full sm:basis-auto sm:shrink-0">Routed to <ArrowRight size={12} /> <span className="font-medium text-midnight">{x.to}</span></span><span className="stamp shrink-0 hidden sm:inline">{relDays(x.date)}</span></div>)}
          {incoming.length === 0 && <p className="p-6 text-sm text-slate">No new requests. Website forms (prayer, community help, facility use, registrations, contact) land here and route automatically.</p>}
        </div>
      )}
    </>
  )

  function Announcements() {
    const [editing, setEditing] = useState<Announcement | null>(null)
    const list = [...state.announcements].sort((a, b) => ['draft', 'approved', 'scheduled', 'sent'].indexOf(a.status) - ['draft', 'approved', 'scheduled', 'sent'].indexOf(b.status))
    function save(e: FormEvent<HTMLFormElement>) {
      e.preventDefault(); const fd = new FormData(e.currentTarget)
      const channels = (['bulletin', 'website', 'email', 'sms'] as const).filter((c) => fd.get(`ch_${c}`))
      const a: Announcement = { id: editing?.id ?? uid('an'), title: String(fd.get('title')), body: String(fd.get('body')), channels, status: editing?.status ?? 'draft', date: String(fd.get('date')) || todayIso(), audience: String(fd.get('audience')), authorId: state.currentMemberId }
      upsert('announcements', a); log(who, editing ? 'Edited announcement' : 'Drafted announcement', a.title); setEditing(null)
    }
    return (
      <div className="mt-4">
        <div className="flex justify-end mb-3"><Button size="sm" icon={<Plus size={14} />} onClick={() => setEditing({ id: '', title: '', body: '', channels: ['bulletin'], status: 'draft', date: todayIso(), audience: 'All members', authorId: '' })}>New announcement</Button></div>
        <div className="grid gap-3">
          {list.map((a) => (
            <article key={a.id} className="card p-4 flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2"><Badge tone={a.status === 'draft' ? 'gold' : a.status === 'sent' ? 'success' : 'royal'} className="capitalize">{a.status}</Badge>{a.channels.map((c) => <Badge key={c}>{channelLabel[c]}</Badge>)}<span className="stamp">{fmtShort(a.date)} · {a.audience}</span></div>
                <p className="font-semibold mt-1.5">{a.title}</p><p className="text-sm text-slate line-clamp-2">{a.body}</p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => setEditing(a)}>Edit</Button>
                {a.status === 'draft' && can.approveComms(r) && <Button size="sm" variant="outline" icon={<Check size={14} />} onClick={() => { patch('announcements', a.id, { status: 'approved' }); log(who, 'Approved announcement', a.title) }}>Approve</Button>}
                {a.status === 'approved' && <Button size="sm" variant="outline" onClick={() => { patch('announcements', a.id, { status: 'scheduled' }); log(who, 'Scheduled announcement', a.title) }}>Schedule</Button>}
                {(a.status === 'approved' || a.status === 'scheduled') && can.approveComms(r) && <Button size="sm" icon={<Send size={14} />} onClick={() => { patch('announcements', a.id, { status: 'sent' }); upsert('campaigns', { id: uid('cp'), name: a.title, channel: a.channels.includes('sms') ? 'sms' : 'email', segment: a.audience, recipients: a.audience.includes('All') ? state.members.filter((m) => m.consent.email).length : 40, status: 'sent', sentAt: todayIso() }); log(who, 'Sent announcement', a.title) }}>Send now</Button>}
              </div>
            </article>
          ))}
        </div>
        <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit announcement' : 'New announcement'}>
          {editing && (
            <form onSubmit={save} className="grid gap-3">
              <Input name="title" label="Title" defaultValue={editing.title} required />
              <Textarea name="body" label="Body" defaultValue={editing.body} required />
              <div className="grid grid-cols-2 gap-3"><Input name="date" type="date" label="Publish date" defaultValue={editing.date} /><Select name="audience" label="Audience" defaultValue={editing.audience}><option>All members</option><option>All contacts with consent</option><option>Members with volunteer interests</option><option>First-time visitors</option><option>Ministry leaders</option></Select></div>
              <fieldset><legend className="text-sm font-medium mb-1">Channels</legend><div className="flex flex-wrap gap-3 text-sm">{(['bulletin', 'website', 'email', 'sms'] as const).map((c) => <label key={c} className="inline-flex items-center gap-1.5"><input type="checkbox" name={`ch_${c}`} defaultChecked={editing.channels.includes(c)} className="accent-[#4B2A7B]" /> {channelLabel[c]}</label>)}</div></fieldset>
              <div className="flex justify-end gap-2 pt-2"><Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit">Save draft</Button></div>
            </form>
          )}
        </Modal>
      </div>
    )
  }

  function Bulletin() {
    const events = upcomingEvents(state, true).slice(0, 8)
    const approved = state.announcements.filter((a) => (a.status === 'approved' || a.status === 'scheduled' || a.status === 'sent') && a.channels.includes('bulletin'))
    const text = useMemo(() => [state.church.name.toUpperCase(), 'Sunday Bulletin', '', 'WELCOME', 'We are glad you are here. First-time guests, please stop by the welcome desk for a gift.', '', 'THIS WEEK AND BEYOND', ...events.map((e) => `- ${e.title}: ${fmtLong(e.date)}, ${fmtTime(e.start)}, ${state.rooms.find((x) => x.id === e.roomId)?.name}`), '', 'ANNOUNCEMENTS', ...approved.map((a) => `- ${a.title}: ${a.body}`), '', 'GIVING', `Give online at ${state.church.website}/give or text GIVE to ${state.church.phone}.`, '', `${state.church.address}, ${state.church.city} · ${state.church.phone}`].join('\n'), [events, approved])
    function download() { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' })); a.download = `bulletin-${todayIso()}.txt`; a.click(); log(who, 'Generated bulletin', todayIso()) }
    return (
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-3">
          <Panel title="Generated from approved content" subtitle="Events on the calendar plus announcements approved for the bulletin channel">
            <ul className="text-sm space-y-1">{events.map((e) => <li key={e.id} className="flex justify-between"><span>{e.title}</span><span className="text-slate">{fmtShort(e.date)}</span></li>)}</ul>
            <p className="text-xs text-slate mt-3 flex items-center gap-1.5"><Bot size={12} /> The Office Agent prepares this draft every Wednesday at noon; the Office & Communications edits and approves.</p>
          </Panel>
          <div className="flex gap-2"><Button icon={<Download size={16} />} onClick={download}>Download bulletin</Button><Button variant="outline" icon={<FileText size={16} />} onClick={() => window.print()}>Print</Button></div>
        </div>
        <pre className="card p-6 text-sm whitespace-pre-wrap font-sans leading-relaxed print-page">{text}</pre>
      </div>
    )
  }

  function Letters() {
    const templates = [
      { id: 'welcome', name: 'Welcome letter (first-time visitor)', body: (n: string) => `Dear ${n},\n\nThank you for worshiping with us at ${state.church.shortName} this Sunday. We hope you felt at home. If there is anything we can pray about with you, or if you would like to learn more about our ministries, simply reply to this letter or stop by the welcome desk next Sunday.\n\nOur New Member Orientation begins soon. You are warmly invited.\n\nGrace and peace,\n${state.church.pastor}\n${state.church.pastorTitle}` },
      { id: 'thanks', name: 'Thank you for your gift', body: (n: string) => `Dear ${n},\n\nThank you for your generous gift to ${state.church.name}. Your faithfulness makes worship, youth ministry, the food pantry and the van ministry possible for this neighborhood.\n\n${state.church.name} is a 501(c)(3) organization. No goods or services were provided in exchange for this contribution.\n\nWith gratitude,\n${state.church.pastor}` },
      { id: 'facility', name: 'Facility use confirmation', body: (n: string) => `Dear ${n},\n\nThis letter confirms your reservation at ${state.church.name}. Please review the attached Facility Use Policy and return the signed agreement with your deposit no later than ten days before the event.\n\nSincerely,\nDanielle Carter\nExecutive Administrator` },
      { id: 'membership', name: 'Membership confirmation', body: (n: string) => `Dear ${n},\n\nOn behalf of the congregation, welcome to the ${state.church.name} family. Your membership was received and recorded today. We look forward to serving alongside you.\n\nIn Christ,\n${state.church.pastor}` },
    ]
    const [tpl, setTpl] = useState(templates[0].id)
    const [memberId, setMemberId] = useState(visitors(state)[0]?.id ?? state.members[0].id)
    const m = state.members.find((x) => x.id === memberId)
    const body = templates.find((t) => t.id === tpl)!.body(m ? fullName(m) : 'Friend')
    function download() { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], { type: 'text/plain' })); a.download = `letter-${tpl}-${m?.last ?? 'draft'}.txt`; a.click(); log(who, 'Generated letter', `${tpl} for ${m ? fullName(m) : ''}`) }
    return (
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <div className="card p-4 grid gap-3">
          <Select label="Template" value={tpl} onChange={(e) => setTpl(e.target.value)}>{templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</Select>
          <Select label="Recipient" value={memberId} onChange={(e) => setMemberId(e.target.value)}>{state.members.map((x) => <option key={x.id} value={x.id}>{fullName(x)} ({x.status})</option>)}</Select>
          <div className="flex gap-2"><Button icon={<Download size={16} />} onClick={download}>Download</Button><Button variant="outline" icon={<Mail size={16} />} onClick={() => { if (m) { patch('members', m.id, { lastContact: todayIso() }); log(who, 'Sent letter', `${tpl} to ${fullName(m)}`) } }}>Mark as sent</Button></div>
          <p className="text-xs text-slate">Church-approved templates only. Marking a letter sent updates the member's last-contact date.</p>
        </div>
        <pre className="card p-6 text-sm whitespace-pre-wrap font-sans leading-relaxed">{body}</pre>
      </div>
    )
  }

  function Documents() {
    const [cat, setCat] = useState<'all' | Doc['category']>('all')
    const [adding, setAdding] = useState(false)
    const list = state.documents.filter((d) => cat === 'all' || d.category === cat).sort((a, b) => b.updated.localeCompare(a.updated))
    function add(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const fd = new FormData(e.currentTarget); upsert('documents', { id: uid('d'), title: String(fd.get('title')), category: String(fd.get('category')) as Doc['category'], updated: todayIso(), ownerId: state.currentMemberId, size: '—' }); log(who, 'Added document', String(fd.get('title'))); setAdding(false) }
    return (
      <div className="mt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5">{(['all', 'policy', 'minutes', 'form', 'agreement', 'letter', 'report'] as const).map((c) => <button key={c} type="button" onClick={() => setCat(c)} className={`rounded-full px-3 py-1.5 text-xs font-medium border capitalize ${cat === c ? 'bg-midnight text-white border-midnight' : 'border-line bg-paper'}`}>{c}</button>)}</div>
          <Button size="sm" icon={<Plus size={14} />} onClick={() => setAdding(true)}>Add document</Button>
        </div>
        <div className="card divide-y divide-line">{list.map((d) => <div key={d.id} className="p-3 flex items-center gap-3 text-sm"><FileText size={18} className="text-royal shrink-0" /><span className="flex-1 min-w-0"><span className="block font-medium truncate">{d.title}</span><span className="block text-xs text-slate capitalize">{d.category} · updated {fmtShort(d.updated)} · {personName(state, d.ownerId)}</span></span><span className="text-xs text-slate hidden sm:inline">{d.size}</span></div>)}</div>
        <Modal open={adding} onClose={() => setAdding(false)} title="Add a document" size="sm"><form onSubmit={add} className="grid gap-3"><Input name="title" label="Title" required /><Select name="category" label="Category"><option>policy</option><option>minutes</option><option>form</option><option>agreement</option><option>letter</option><option>report</option></Select><div className="flex justify-end gap-2 pt-2"><Button variant="ghost" onClick={() => setAdding(false)}>Cancel</Button><Button type="submit">Save</Button></div></form></Modal>
      </div>
    )
  }
}
