import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { Search, Users, CalendarDays, HandHeart, Landmark, Warehouse, FileText } from 'lucide-react'
import { useDemo } from '@/data/store'
import { useFocusTrap } from '@/components/useFocusTrap'
import { fullName } from '@/data/selectors'

type Hit = { id: string; label: string; sub: string; to: string; icon: typeof Users }

export function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state } = useDemo()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, open, onClose)
  useEffect(() => { if (!open) setQ('') }, [open])
  const hits = useMemo<Hit[]>(() => {
    const t = q.trim().toLowerCase()
    if (t.length < 2) return []
    const out: Hit[] = []
    state.members.filter((m) => fullName(m).toLowerCase().includes(t) || m.email.includes(t)).slice(0, 5).forEach((m) => out.push({ id: m.id, label: fullName(m), sub: `${m.status} · ${m.email}`, to: `/admin/members?open=${m.id}`, icon: Users }))
    state.events.filter((e) => e.title.toLowerCase().includes(t)).slice(0, 4).forEach((e) => out.push({ id: e.id, label: e.title, sub: `${e.date} · ${e.stage}`, to: `/admin/events?open=${e.id}`, icon: CalendarDays }))
    state.care.filter((c) => (c.name + c.text).toLowerCase().includes(t)).slice(0, 3).forEach((c) => out.push({ id: c.id, label: `${c.kind}: ${c.name}`, sub: c.status, to: '/admin/members?tab=care', icon: HandHeart }))
    state.expenses.filter((x) => (x.vendor + x.note).toLowerCase().includes(t)).slice(0, 3).forEach((x) => out.push({ id: x.id, label: `${x.vendor} $${x.amount}`, sub: x.status, to: '/admin/finance?tab=expenses', icon: Landmark }))
    state.maintenance.filter((m) => (m.title + m.area).toLowerCase().includes(t)).slice(0, 3).forEach((m) => out.push({ id: m.id, label: m.title, sub: m.area, to: '/admin/facilities?tab=maintenance', icon: Warehouse }))
    state.documents.filter((d) => d.title.toLowerCase().includes(t)).slice(0, 3).forEach((d) => out.push({ id: d.id, label: d.title, sub: d.category, to: '/admin/office?tab=documents', icon: FileText }))
    return out
  }, [q, state])
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-[95] flex items-start justify-center p-4 pt-[10vh]" role="presentation">
      <div className="absolute inset-0 bg-midnight/50" onClick={onClose} aria-hidden="true" />
      <div ref={ref} role="dialog" aria-modal="true" aria-label="Search" tabIndex={-1} className="relative w-full max-w-xl rounded-2xl bg-paper shadow-lift border border-line overflow-hidden">
        <div className="flex items-center gap-2 px-4 border-b border-line"><Search size={18} className="text-slate" /><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search members, events, requests, documents" className="flex-1 bg-transparent py-4 text-sm focus:outline-none" aria-label="Search" /></div>
        <ul className="max-h-[50vh] overflow-y-auto py-1">
          {hits.map((h) => <li key={h.to + h.id}><button type="button" onClick={() => { nav(h.to); onClose() }} className="w-full text-left flex items-center gap-3 px-4 py-2.5 hover:bg-royal-50"><h.icon size={16} className="text-royal shrink-0" /><span className="min-w-0"><span className="block text-sm font-medium truncate">{h.label}</span><span className="block text-xs text-slate capitalize truncate">{h.sub}</span></span></button></li>)}
          {q.length >= 2 && hits.length === 0 && <li className="px-4 py-6 text-sm text-slate">No matches for “{q}”.</li>}
          {q.length < 2 && <li className="px-4 py-6 text-sm text-slate">Type at least two characters. Search covers members, events, care requests, expenses, maintenance and documents your role can see.</li>}
        </ul>
      </div>
    </div>,
    document.body,
  )
}
