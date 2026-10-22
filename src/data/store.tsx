import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import type { DemoState, Role } from './types'
import { createSeedState } from './seed'
import { loadRaw, saveRaw, clearRaw } from './storage'
import { uid } from './ids'
import { accountById } from '@/config/accounts'

export type CollectionKey =
  | 'members' | 'households' | 'funds' | 'gifts' | 'budgets' | 'expenses' | 'ministries' | 'events' | 'registrations' | 'rooms' | 'reservations' | 'maintenance' | 'assets'
  | 'staff' | 'shifts' | 'care' | 'services' | 'announcements' | 'campaigns' | 'documents' | 'meetings' | 'partners' | 'businesses' | 'grants' | 'programs' | 'drafts' | 'approvals' | 'tasks' | 'sermons' | 'attendance' | 'audit'
  | 'opportunities' | 'readiness' | 'pantry' | 'showers'
type ItemOf<K extends CollectionKey> = DemoState[K][number]
type ScalarKey = Exclude<keyof DemoState, CollectionKey | 'version'>

type Action =
  | { type: 'reset' }
  | { type: 'set'; key: ScalarKey; value: DemoState[ScalarKey] }
  | { type: 'upsert'; collection: CollectionKey; item: { id: string } }
  | { type: 'patch'; collection: CollectionKey; id: string; patch: Record<string, unknown> }
  | { type: 'remove'; collection: CollectionKey; id: string }
  | { type: 'audit'; who: string; action: string; target: string }
  | { type: 'signin'; accountId: string }
  | { type: 'signout' }

function stamp() { const d = new Date(); return `${d.toISOString().slice(0, 10)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` }

function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case 'reset': return { ...createSeedState(), entered: state.entered, role: state.role, accountId: state.accountId, currentMemberId: state.currentMemberId, settings: { ...createSeedState().settings, tourDone: true, guideOn: state.settings.guideOn } }
    case 'signin': {
      const a = accountById(action.accountId)
      if (!a) return state
      return { ...state, entered: true, accountId: a.id, role: a.role, currentMemberId: a.memberId, audit: [{ id: uid('au'), at: stamp(), who: a.name, action: 'Signed in (demo single sign-on)', target: a.title }, ...state.audit].slice(0, 200) }
    }
    case 'signout': return { ...state, entered: false }
    case 'set': return { ...state, [action.key]: action.value }
    case 'upsert': {
      const list = state[action.collection] as { id: string }[]
      const idx = list.findIndex((x) => x.id === action.item.id)
      const next = idx >= 0 ? list.map((x) => (x.id === action.item.id ? action.item : x)) : [action.item, ...list]
      return { ...state, [action.collection]: next }
    }
    case 'patch': {
      const list = state[action.collection] as { id: string }[]
      return { ...state, [action.collection]: list.map((x) => (x.id === action.id ? { ...x, ...action.patch } : x)) }
    }
    case 'remove': {
      const list = state[action.collection] as { id: string }[]
      return { ...state, [action.collection]: list.filter((x) => x.id !== action.id) }
    }
    case 'audit':
      return { ...state, audit: [{ id: uid('au'), at: stamp(), who: action.who, action: action.action, target: action.target }, ...state.audit].slice(0, 200) }
    default: return state
  }
}

function loadInitial(): DemoState {
  const raw = loadRaw()
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<DemoState>
      if (parsed && parsed.version === 1 && Array.isArray(parsed.members)) { const seed = createSeedState(); return { ...seed, ...parsed, settings: { ...seed.settings, ...(parsed.settings ?? {}) } } as DemoState }
    } catch { /* fall through */ }
  }
  return createSeedState()
}

type Ctx = {
  state: DemoState
  storageOk: boolean
  upsert: <K extends CollectionKey>(collection: K, item: ItemOf<K>) => void
  patch: <K extends CollectionKey>(collection: K, id: string, patch: Partial<ItemOf<K>>) => void
  remove: (collection: CollectionKey, id: string) => void
  set: <K extends ScalarKey>(key: K, value: DemoState[K]) => void
  reset: () => void
  setRole: (r: Role) => void
  signIn: (accountId: string) => void
  signOut: () => void
  log: (who: string, action: string, target: string) => void
}

const DemoContext = createContext<Ctx | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial)
  const [storageOk, setStorageOk] = useState(true)

  useEffect(() => {
    try { setStorageOk(saveRaw(JSON.stringify(state))) } catch { setStorageOk(false) }
  }, [state])

  const upsert = useCallback(<K extends CollectionKey>(collection: K, item: ItemOf<K>) => dispatch({ type: 'upsert', collection, item: item as { id: string } }), [])
  const patch = useCallback(<K extends CollectionKey>(collection: K, id: string, p: Partial<ItemOf<K>>) => dispatch({ type: 'patch', collection, id, patch: p as Record<string, unknown> }), [])
  const remove = useCallback((collection: CollectionKey, id: string) => dispatch({ type: 'remove', collection, id }), [])
  const set = useCallback(<K extends ScalarKey>(key: K, value: DemoState[K]) => dispatch({ type: 'set', key, value }), [])
  const reset = useCallback(() => { clearRaw(); dispatch({ type: 'reset' }) }, [])
  const setRole = useCallback((r: Role) => dispatch({ type: 'set', key: 'role', value: r }), [])
  const signIn = useCallback((accountId: string) => dispatch({ type: 'signin', accountId }), [])
  const signOut = useCallback(() => dispatch({ type: 'signout' }), [])
  const log = useCallback((who: string, action: string, target: string) => dispatch({ type: 'audit', who, action, target }), [])

  const value = useMemo<Ctx>(() => ({ state, storageOk, upsert, patch, remove, set, reset, setRole, signIn, signOut, log }), [state, storageOk, upsert, patch, remove, set, reset, setRole, signIn, signOut, log])
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used within DemoProvider')
  return ctx
}
