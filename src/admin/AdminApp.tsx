import type { ReactElement } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useDemo } from '@/data/store'
import { Shell } from './layout/Shell'
import { navForRole } from './nav'
import { Dashboard } from './modules/Dashboard'
import { ActionCenter } from './modules/ActionCenter'
import { Members } from './modules/Members'
import { Finance } from './modules/Finance'
import { Office } from './modules/Office'
import { Ministries } from './modules/Ministries'
import { Agents } from './modules/Agents'
import { Events } from './modules/Events'
import { Facilities } from './modules/Facilities'
import { People } from './modules/People'
import { Community } from './modules/Community'
import { Communications } from './modules/Communications'
import { Partners } from './modules/Partners'
import { Reports } from './modules/Reports'
import { Settings } from './modules/Settings'
import { Help } from './modules/Help'
import { Outreach } from './modules/Outreach'
import { Grants } from './modules/Grants'
import { Restricted } from './layout/shared'

function Guard({ path, children }: { path: string; children: ReactElement }) {
  const { state } = useDemo()
  const allowed = navForRole(state.role).some((n) => n.to === path)
  return allowed ? children : <Restricted what="this module" />
}

export default function AdminApp() {
  const { state } = useDemo()
  const loc = useLocation()
  if (!state.entered) return <Navigate to={`/login?next=${encodeURIComponent(loc.pathname + loc.search)}`} replace />
  if (state.role === 'member') return <Navigate to="/portal" replace />
  return (
    <Shell>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="action-center" element={<Guard path="/admin/action-center"><ActionCenter /></Guard>} />
        <Route path="members" element={<Guard path="/admin/members"><Members /></Guard>} />
        <Route path="finance" element={<Guard path="/admin/finance"><Finance /></Guard>} />
        <Route path="office" element={<Guard path="/admin/office"><Office /></Guard>} />
        <Route path="ministries" element={<Guard path="/admin/ministries"><Ministries /></Guard>} />
        <Route path="agents" element={<Guard path="/admin/agents"><Agents /></Guard>} />
        <Route path="events" element={<Guard path="/admin/events"><Events /></Guard>} />
        <Route path="facilities" element={<Guard path="/admin/facilities"><Facilities /></Guard>} />
        <Route path="people" element={<Guard path="/admin/people"><People /></Guard>} />
        <Route path="outreach" element={<Guard path="/admin/outreach"><Outreach /></Guard>} />
        <Route path="grants" element={<Guard path="/admin/grants"><Grants /></Guard>} />
        <Route path="community" element={<Guard path="/admin/community"><Community /></Guard>} />
        <Route path="communications" element={<Guard path="/admin/communications"><Communications /></Guard>} />
        <Route path="partners" element={<Guard path="/admin/partners"><Partners /></Guard>} />
        <Route path="reports" element={<Guard path="/admin/reports"><Reports /></Guard>} />
        <Route path="settings" element={<Guard path="/admin/settings"><Settings /></Guard>} />
        <Route path="help" element={<Help />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Shell>
  )
}
