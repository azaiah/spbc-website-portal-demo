import type { ReactNode } from 'react'
import { useDemo } from '@/data/store'

export function useMe() {
  const { state } = useDemo()
  return state.members.find((m) => m.id === state.currentMemberId)!
}

export function PageTitle({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div><h1 className="display text-3xl">{title}</h1>{text && <p className="text-slate mt-1">{text}</p>}</div>
      {action}
    </div>
  )
}

export function Stat({ label, value, sub, hi = false }: { label: string; value: ReactNode; sub?: ReactNode; hi?: boolean }) {
  return (
    <div className={`rounded-xl p-4 ${hi ? 'bg-midnight text-white' : 'card'}`}>
      <p className={`text-xs ${hi ? 'text-white/60' : 'text-slate'}`}>{label}</p>
      <p className={`font-display text-2xl font-semibold mt-1 ${hi ? 'text-gold-light' : ''}`}>{value}</p>
      {sub && <p className={`text-xs mt-1 ${hi ? 'text-white/60' : 'text-slate'}`}>{sub}</p>}
    </div>
  )
}
