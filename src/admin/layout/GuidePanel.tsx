import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, ChevronLeft, ChevronRight, ArrowRight, UserCheck, ListChecks, X, Lightbulb } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useDemo } from '@/data/store'
import { Button } from '@/components/Button'
import { guideFor } from '../guides'

/** Plain-language walkthrough shown above every module when Guide mode is on. */
export function GuidePanel() {
  const { state, set } = useDemo()
  const loc = useLocation()
  const nav = useNavigate()
  const guide = guideFor(loc.pathname)
  const [step, setStep] = useState(0)
  const [collapsed, setCollapsed] = useState(false)
  useEffect(() => { setStep(0); setCollapsed(false) }, [guide.path])
  if (!state.settings.guideOn) return null
  const s = guide.steps[step]
  const off = () => set('settings', { ...state.settings, guideOn: false, tourDone: true })

  return (
    <AnimatePresence initial={false}>
      <motion.aside key={guide.path} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 rounded-2xl border-2 border-gold/40 bg-gold-50/60 overflow-hidden" aria-label={`Guide: ${guide.title}`}>
        <div className="flex items-center gap-3 px-4 py-2.5 bg-gold text-white">
          <BookOpen size={16} />
          <p className="text-sm font-semibold flex-1">Guide: {guide.title}</p>
          <button type="button" onClick={() => setCollapsed((c) => !c)} className="text-xs underline-offset-2 hover:underline min-h-[44px] px-1">{collapsed ? 'Show' : 'Hide for this page'}</button>
          <button type="button" onClick={off} className="inline-flex items-center gap-1 text-xs hover:underline min-h-[44px] px-1" title="Turn guide mode off"><X size={14} /> Turn off</button>
        </div>
        {!collapsed && (
          <div className="grid gap-4 p-4 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="text-sm leading-relaxed">{guide.plain}</p>
              <p className="mt-3 text-xs flex items-start gap-1.5"><UserCheck size={14} className="text-gold shrink-0 mt-0.5" /><span><span className="font-semibold">Usually owned by:</span> {guide.owner}</span></p>
              {guide.handoff.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold flex items-center gap-1.5"><ListChecks size={14} className="text-gold" /> Tasks you can hand to someone</p>
                  <ul className="mt-1 text-xs space-y-1 text-slate">{guide.handoff.map((h) => <li key={h} className="flex gap-1.5"><span className="text-gold">&#8226;</span> {h}</li>)}</ul>
                </div>
              )}
            </div>
            <div className="rounded-xl bg-paper border border-line p-4 flex flex-col">
              <div className="flex items-center justify-between"><p className="stamp">Step {step + 1} of {guide.steps.length}</p><div className="flex -mr-2">{guide.steps.map((_, i) => <button key={i} type="button" onClick={() => setStep(i)} className="h-8 w-8 shrink-0 inline-flex items-center justify-center rounded-full hover:bg-midnight/5" aria-label={`Step ${i + 1}`} aria-current={i === step ? 'step' : undefined}><span className={`h-2.5 w-2.5 rounded-full ${i === step ? 'bg-gold' : 'bg-line'}`} /></button>)}</div></div>
              <h3 className="font-semibold mt-1 flex items-start gap-2"><Lightbulb size={16} className="text-gold mt-0.5 shrink-0" /> {s.title}</h3>
              <p className="text-sm text-slate mt-1.5 leading-relaxed flex-1">{s.text}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" icon={<ChevronLeft size={14} />} onClick={() => setStep((x) => Math.max(0, x - 1))} disabled={step === 0}>Back</Button>
                {step < guide.steps.length - 1 ? <Button size="sm" variant="dark" onClick={() => setStep((x) => x + 1)}>Next <ChevronRight size={14} /></Button> : <Button size="sm" variant="dark" onClick={() => setCollapsed(true)}>Done</Button>}
                {s.to && <Button size="sm" icon={<ArrowRight size={14} />} onClick={() => nav(s.to!)}>{s.cta ?? 'Take me there'}</Button>}
              </div>
            </div>
          </div>
        )}
      </motion.aside>
    </AnimatePresence>
  )
}
