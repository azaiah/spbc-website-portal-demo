import type { ReactNode } from 'react'

export type Tone = 'neutral' | 'royal' | 'gold' | 'success' | 'warning' | 'danger' | 'midnight'

const tones: Record<Tone, string> = {
  neutral: 'bg-linen text-slate border-line',
  royal: 'bg-royal-50 text-royal border-royal/20',
  gold: 'bg-gold-50 text-gold border-gold/30',
  success: 'bg-[#E6F3EC] text-success border-success/30',
  warning: 'bg-[#FBF2E0] text-warning border-warning/30',
  danger: 'bg-[#FBE9E7] text-danger border-danger/30',
  midnight: 'bg-midnight text-white border-midnight',
}

export function Badge({ tone = 'neutral', children, className = '', mono = false }: { tone?: Tone; children: ReactNode; className?: string; mono?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${mono ? 'font-mono tracking-wide' : ''} ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}
