import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'

export function PageHeader({ eyebrow, title, text, actions }: { eyebrow?: string; title: string; text?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div className="min-w-0">
        {eyebrow && <p className="stamp">{eyebrow}</p>}
        <h1 className="display text-3xl mt-1">{title}</h1>
        {text && <p className="text-slate mt-1 max-w-2xl">{text}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function Kpi({ label, value, sub, icon: Icon, tone = 'paper', to }: { label: string; value: ReactNode; sub?: ReactNode; icon?: LucideIcon; tone?: 'paper' | 'midnight' | 'gold'; to?: string }) {
  const cls = tone === 'midnight' ? 'bg-midnight text-white border-midnight' : tone === 'gold' ? 'bg-gold text-white border-gold' : 'card'
  const body = (
    <div className={`rounded-xl border p-4 h-full ${cls}`}>
      <div className={`flex items-center justify-between text-xs ${tone === 'paper' ? 'text-slate' : 'text-white/70'}`}><span>{label}</span>{Icon && <Icon size={16} className={tone === 'paper' ? 'text-gold' : 'text-white/70'} />}</div>
      <p className={`font-display text-2xl sm:text-3xl font-semibold mt-1.5 ${tone === 'midnight' ? 'text-gold-light' : ''}`}>{value}</p>
      {sub && <p className={`text-xs mt-1 ${tone === 'paper' ? 'text-slate' : 'text-white/70'}`}>{sub}</p>}
    </div>
  )
  return to ? <Link to={to} className="block hover:-translate-y-0.5 transition-transform">{body}</Link> : body
}

export function Panel({ title, subtitle, action, children, className = '', to, tour }: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; to?: string; tour?: string }) {
  return (
    <section data-tour={tour} className={`card ${className}`}>
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-2">
        <div className="min-w-0"><h2 className="font-semibold break-words">{title}</h2>{subtitle && <p className="text-xs text-slate mt-0.5">{subtitle}</p>}</div>
        {action ?? (to && <Link to={to} className="text-sm text-royal font-medium inline-flex items-center gap-1 shrink-0 min-h-[32px]">Open <ArrowRight size={14} /></Link>)}
      </div>
      <div className="px-4 pb-4">{children}</div>
    </section>
  )
}

export function Progress({ value, max, color = 'bg-gold', className = '' }: { value: number; max: number; color?: string; className?: string }) {
  const pct = Math.min(100, Math.round((value / (max || 1)) * 100))
  return <div className={`h-2 rounded-full bg-linen overflow-hidden ${className}`} role="progressbar" aria-valuenow={value} aria-valuemax={max}><div className={`h-full ${color}`} style={{ width: `${pct}%` }} /></div>
}

export function Restricted({ what }: { what: string }) {
  return <div className="rounded-xl border border-dashed border-line bg-paper p-6 text-center text-sm text-slate">Your account does not have access to {what}. In this demo, switch accounts from the menu at the top right to compare what each person sees.</div>
}

export function Row({ label, children }: { label: string; children: ReactNode }) {
  return <div className="flex items-start justify-between gap-4 py-2 border-b border-line last:border-0 text-sm"><dt className="text-slate shrink-0">{label}</dt><dd className="text-right break-words">{children}</dd></div>
}
