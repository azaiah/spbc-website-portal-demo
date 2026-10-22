import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Users, CalendarDays, Minus, Plus } from 'lucide-react'
import { lifeStages, stageForAge, type LifeStage } from '@/config/site'
import { Leaf } from './ui'

/**
 * Life Stage Finder: "How old are you (or your child)?" → your stage, your Life Stage Pastor and this week's study.
 * Recognition over recall: the eight stages stay visible as a row of chips you can also tap directly.
 */
export function LifeStageFinder({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  const [age, setAge] = useState<number | ''>('')
  const [chosen, setChosen] = useState<LifeStage | null>(null)
  const stage = useMemo(() => chosen ?? (age === '' ? null : stageForAge(age)), [age, chosen])
  const step = (d: number) => { setChosen(null); setAge((a) => Math.max(0, Math.min(110, (a === '' ? 30 : a) + d))) }
  const text = dark ? 'text-white' : 'text-ink'
  const sub = dark ? 'text-white/80' : 'text-stone'
  return (
    <div className={`rounded-[28px] ${dark ? 'bg-white/[0.06] border border-white/15' : 'bg-paper border border-line shadow-card'} p-5 sm:p-8`}>
      <div className={`grid gap-6 ${compact ? '' : 'lg:grid-cols-[0.9fr_1.1fr]'} items-start`}>
        <div>
          <label htmlFor="lsf-age" className={`block font-display font-bold text-2xl sm:text-3xl ${text}`}>How old are you, or your child?</label>
          <p className={`mt-2 ${sub}`}>Saint Paul’s cares for people by life stage. Each stage has its own pastor, Bible study and friends.</p>
          <div className="mt-5 flex items-center gap-2">
            <button type="button" onClick={() => step(-1)} aria-label="One year younger" className={`h-14 w-14 shrink-0 rounded-full border-2 ${dark ? 'border-white/30 text-white hover:bg-white/10' : 'border-line text-ink hover:bg-parchment'} inline-flex items-center justify-center`}><Minus size={22} /></button>
            <input id="lsf-age" inputMode="numeric" pattern="[0-9]*" value={age} placeholder="Age" onChange={(e) => { setChosen(null); const v = e.target.value.replace(/\D/g, '').slice(0, 3); setAge(v === '' ? '' : Math.min(110, Number(v))) }} className="h-14 w-full max-w-[160px] rounded-2xl border-2 border-line bg-paper px-4 text-center font-display font-bold text-3xl text-ink focus:border-grow focus:outline-none focus:ring-4 focus:ring-grow/20" />
            <button type="button" onClick={() => step(1)} aria-label="One year older" className={`h-14 w-14 shrink-0 rounded-full border-2 ${dark ? 'border-white/30 text-white hover:bg-white/10' : 'border-line text-ink hover:bg-parchment'} inline-flex items-center justify-center`}><Plus size={22} /></button>
          </div>
          <p className={`mt-5 text-[16px] font-semibold ${sub}`}>Or tap a stage:</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {lifeStages.map((s) => {
              const on = stage?.id === s.id
              return (
                <li key={s.id}>
                  <button type="button" onClick={() => { setChosen(s); setAge('') }} aria-pressed={on} className={`min-h-[44px] rounded-full px-4 text-[16px] font-bold border-2 transition-colors ${on ? 'text-white border-transparent' : dark ? 'border-white/25 text-white hover:border-white/60' : 'border-line text-ink hover:border-ink/40'}`} style={on ? { background: s.color } : undefined}>
                    {s.name}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
        <div aria-live="polite" className="min-h-[220px]">
          <AnimatePresence mode="wait">
            {stage ? (
              <motion.div key={stage.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white" style={{ background: `linear-gradient(135deg, ${stage.color}, #17131C 140%)` }}>
                <Leaf size={160} className="absolute -right-6 -top-8 text-white/10" />
                <p className="font-caps font-semibold text-white/85">Ages {stage.ages}</p>
                <p className="mt-1 font-display font-bold text-5xl tracking-tight">{stage.name}</p>
                <p className="mt-3 text-white/90 text-lg leading-relaxed max-w-md">{stage.blurb}</p>
                <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/10 p-4"><dt className="flex items-center gap-2 text-[15px] text-white/80"><Users size={16} /> Life Stage Pastor</dt><dd className="mt-1 font-bold text-lg">{stage.pastor}</dd></div>
                  {stage.study && <div className="rounded-2xl bg-white/10 p-4"><dt className="flex items-center gap-2 text-[15px] text-white/80"><CalendarDays size={16} /> Bible study</dt><dd className="mt-1 font-bold text-lg">{stage.study}</dd></div>}
                </dl>
                <Link to={`/life-stages/${stage.id}`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-ink font-bold px-6 min-h-[52px] hover:bg-glow">Explore {stage.name} <ArrowRight size={18} /></Link>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`h-full min-h-[220px] rounded-3xl border-2 border-dashed ${dark ? 'border-white/20 text-white/75' : 'border-line text-stone'} flex flex-col items-center justify-center text-center p-6`}>
                <Leaf size={40} className="text-orange" />
                <p className="mt-3 text-lg max-w-xs">Enter an age or tap a stage to meet your pastor and see this week’s Bible study.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
