import type { Approval, AgentDraft, DemoState } from '@/data/types'
import { useDemo } from '@/data/store'
import { roleMeta } from './nav'
import { uid } from '@/data/ids'
import { todayIso } from '@/data/dates'

/** Shared workflow actions so approvals have real side effects across modules. */
export function useActions() {
  const { state, patch, upsert, log } = useDemo()
  const who = roleMeta[state.role].label

  function decideApproval(a: Approval, decision: 'approved' | 'rejected') {
    patch('approvals', a.id, { status: decision })
    if (a.relatedId) {
      if (a.kind === 'expense') patch('expenses', a.relatedId, { status: decision === 'approved' ? 'approved' : 'rejected' })
      if (a.kind === 'reservation') patch('reservations', a.relatedId, { status: decision === 'approved' ? 'approved' : 'declined' })
      if (a.kind === 'event' && decision === 'approved') patch('events', a.relatedId, { stage: 'approved' })
      if (a.kind === 'communication') patch('announcements', a.relatedId, { status: decision === 'approved' ? 'approved' : 'draft' })
      if (a.kind === 'hire' && decision === 'approved') patch('staff', a.relatedId, { bgCheck: 'clear', bgCheckDate: todayIso() })
    }
    log(who, decision === 'approved' ? 'Approved' : 'Rejected', a.title)
  }

  function decideDraft(d: AgentDraft, decision: 'approved' | 'rejected', body?: string) {
    patch('drafts', d.id, { status: decision, ...(body ? { body } : {}) })
    if (decision === 'approved') {
      if (d.kind === 'Bulletin' || d.kind === 'Letters' || d.kind === 'Campaign') {
        upsert('announcements', { id: uid('an'), title: d.title, body: body ?? d.body, channels: d.kind === 'Campaign' ? ['email'] : d.kind === 'Letters' ? ['email'] : ['bulletin'], status: 'approved', date: todayIso(), audience: d.kind === 'Letters' ? 'First-time visitors' : 'All members', authorId: 'agent' })
      }
      if (d.kind === 'Report') upsert('documents', { id: uid('d'), title: `${d.title} (${todayIso()})`, category: 'report', updated: todayIso(), ownerId: 'm_3', size: '12 KB' })
      if (d.kind === 'Reminder' || d.kind === 'Checklist' || d.kind === 'List') upsert('tasks', { id: uid('t'), title: d.title, assigneeId: 'm_2', due: todayIso(), status: 'todo', module: d.module, priority: 'normal' })
    }
    log(`${who} (reviewing ${d.agentId} agent)`, decision === 'approved' ? 'Approved draft' : 'Rejected draft', d.title)
  }

  function advanceEvent(id: string) {
    const stages: DemoState['events'][number]['stage'][] = ['proposed', 'approved', 'reserved', 'published', 'promoted', 'staffed', 'completed', 'reported']
    const e = state.events.find((x) => x.id === id); if (!e) return
    const i = stages.indexOf(e.stage); if (i >= stages.length - 1) return
    const next = stages[i + 1]
    patch('events', id, { stage: next, ...(next === 'published' ? { registrationOpen: true } : {}), ...(next === 'completed' && !e.attendance ? { attendance: Math.round(e.capacity * 0.7) } : {}) })
    if (next === 'reserved' && !state.reservations.some((r) => r.eventId === id)) upsert('reservations', { id: uid('rs'), roomId: e.roomId, eventId: id, requester: 'Ministry', date: e.date, start: e.start, end: e.end, status: 'approved', purpose: e.title, external: false })
    if (next === 'reported') upsert('drafts', { id: uid('dr'), agentId: 'event', title: `Impact report: ${e.title}`, kind: 'Report', module: 'events', reviewerRole: 'admin', status: 'pending', createdAt: todayIso(), body: `${e.title}\nDate: ${e.date}\nAttendance: ${e.attendance ?? Math.round(e.capacity * 0.7)}\nBudget: $${e.budget.toLocaleString()} · Spent: $${e.spent.toLocaleString()}\nRegistrations: ${state.registrations.filter((r) => r.eventId === id).length}\n\nOutcomes and follow-ups to be confirmed by the ministry leader.` })
    log(who, 'Advanced event', `${e.title} → ${next}`)
  }

  function completeTask(id: string) { const t = state.tasks.find((x) => x.id === id); patch('tasks', id, { status: 'done' }); log(who, 'Completed task', t?.title ?? id) }
  function logContact(memberId: string, note: string) {
    const m = state.members.find((x) => x.id === memberId); if (!m) return
    patch('members', memberId, { lastContact: todayIso(), notes: `${todayIso()}: ${note}${m.notes ? '\n' + m.notes : ''}` })
    log(who, 'Logged contact', `${m.first} ${m.last}`)
  }

  return { who, decideApproval, decideDraft, advanceEvent, completeTask, logContact }
}
