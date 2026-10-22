import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react'

/**
 * A plain-language, step-by-step tour for people who are not comfortable with technology.
 * Each step can point at an element marked with data-tour="name" (the first visible match wins,
 * so a step can name both the desktop and the phone version of a control). Steps without a
 * visible target show as a centered card. Big text, big buttons, Esc or "Skip tour" to leave.
 */
export type TourStep = { target?: string | string[]; title: string; body: ReactNode; icon?: ReactNode }

const visible = (el: Element) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' }
function findTarget(t?: string | string[]) {
  if (!t) return null
  for (const name of ([] as string[]).concat(t)) {
    const el = [...document.querySelectorAll(`[data-tour="${name}"]`)].find(visible)
    if (el) return el as HTMLElement
  }
  return null
}

export function Tour({ steps, open, onClose, label = 'Tour' }: { steps: TourStep[]; open: boolean; onClose: (finished: boolean) => void; label?: string }) {
  const [i, setI] = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const [vw, setVw] = useState(() => window.innerWidth)
  const nextRef = useRef<HTMLButtonElement>(null)
  const step = steps[i]
  const last = i === steps.length - 1

  useEffect(() => { if (open) setI(0) }, [open])

  const measure = useCallback(() => {
    setVw(window.innerWidth)
    const el = findTarget(step?.target)
    setRect(el ? el.getBoundingClientRect() : null)
  }, [step])

  // Bring the target into view, then measure (and keep measuring while the page settles).
  useLayoutEffect(() => {
    if (!open) return
    const el = findTarget(step?.target)
    if (el) {
      const r = el.getBoundingClientRect()
      let fixed = false
      for (let n: HTMLElement | null = el; n; n = n.parentElement) { const pos = getComputedStyle(n).position; if (pos === 'fixed' || pos === 'sticky') { fixed = true; break } }
      if (!fixed && (r.top < 90 || r.bottom > window.innerHeight - 260)) window.scrollTo({ top: window.scrollY + r.top - Math.max(100, window.innerHeight * 0.22), behavior: 'instant' as ScrollBehavior })
    }
    measure()
    const t1 = window.setTimeout(measure, 120), t2 = window.setTimeout(measure, 400)
    return () => { window.clearTimeout(t1); window.clearTimeout(t2) }
  }, [open, i, measure, step])

  useEffect(() => {
    if (!open) return
    const on = () => measure()
    window.addEventListener('resize', on); window.addEventListener('scroll', on, { passive: true })
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose(false)
      if (e.key === 'ArrowRight') setI((x) => Math.min(steps.length - 1, x + 1))
      if (e.key === 'ArrowLeft') setI((x) => Math.max(0, x - 1))
    }
    document.addEventListener('keydown', key)
    return () => { window.removeEventListener('resize', on); window.removeEventListener('scroll', on); document.removeEventListener('keydown', key) }
  }, [open, measure, onClose, steps.length])

  useEffect(() => { if (open) nextRef.current?.focus({ preventScroll: true }) }, [open, i])

  if (!open || !step) return null
  const pad = 8
  const hole = rect ? { top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 } : null
  const phone = vw < 640
  // Card placement: phones get a bottom sheet (or a top sheet if the target sits low); larger screens sit next to the target.
  let card: React.CSSProperties
  if (phone) {
    const low = hole && hole.top + hole.height / 2 > window.innerHeight * 0.55
    card = low ? { top: 12, left: 12, right: 12 } : { bottom: 12, left: 12, right: 12 }
  } else if (hole) {
    const w = 400
    const below = hole.top + hole.height + 16
    const fitsBelow = below + 260 < window.innerHeight
    const left = Math.min(Math.max(16, hole.left + hole.width / 2 - w / 2), window.innerWidth - w - 16)
    const sideLeft = hole.left + hole.width + 16
    if (hole.height > window.innerHeight * 0.5 && sideLeft + w < window.innerWidth) card = { top: Math.max(16, Math.min(hole.top, window.innerHeight - 320)), left: sideLeft, width: w }
    else card = fitsBelow ? { top: below, left, width: w } : { top: Math.max(16, hole.top - 16 - 280), left, width: w }
  } else {
    card = { top: '50%', left: '50%', width: 460, transform: 'translate(-50%, -50%)' }
  }

  return createPortal(
    <div className="fixed inset-0 z-[300]" role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-body">
      {/* Dimmed page with a spotlight on the target */}
      {hole ? (
        <motion.div aria-hidden="true" className="absolute rounded-2xl ring-4 ring-gold-bright pointer-events-none" initial={false} animate={{ top: hole.top, left: hole.left, width: hole.width, height: hole.height }} transition={{ type: 'spring', stiffness: 260, damping: 30 }} style={{ boxShadow: '0 0 0 9999px rgba(15,36,25,0.72)' }} />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 bg-midnight/75" />
      )}
      {/* Blocks the page while the tour is open (no click-to-dismiss, so a stray tap doesn't end it). */}
      <div className="absolute inset-0" aria-hidden="true" />
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="absolute rounded-3xl bg-paper text-midnight shadow-2xl border border-line p-5 sm:p-6" style={card}>
          <div className="flex items-center justify-between gap-3">
            <p className="font-caps text-[14px] font-semibold text-gold"><span className="max-sm:hidden">{label} · </span>Step {i + 1} of {steps.length}</p>
            <button type="button" onClick={() => onClose(false)} className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 min-h-[44px] text-[15px] text-slate hover:bg-linen"><X size={16} /> Skip tour</button>
          </div>
          <div className="mt-1 flex items-start gap-3">
            {step.icon && <span className="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold-50 text-gold">{step.icon}</span>}
            <div className="min-w-0">
              <h2 id="tour-title" className="font-display text-2xl font-semibold leading-tight">{step.title}</h2>
              <div id="tour-body" className="mt-2 text-[17px] leading-relaxed text-slate">{step.body}</div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1.5 max-sm:hidden" aria-hidden="true">{steps.map((_, k) => <span key={k} className={`h-2 rounded-full transition-all ${k === i ? 'w-6 bg-gold' : 'w-2 bg-line'}`} />)}</div>
            <div className="flex gap-2 ml-auto">
              {i > 0 && <button type="button" onClick={() => setI(i - 1)} className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 min-h-[48px] font-semibold hover:border-slate"><ArrowLeft size={18} /> Back</button>}
              <button ref={nextRef} type="button" onClick={() => (last ? onClose(true) : setI(i + 1))} className="inline-flex items-center gap-1.5 rounded-full bg-plum text-white px-5 min-h-[48px] font-semibold hover:bg-plum-2">{last ? <><Check size={18} /> Done</> : <>Next <ArrowRight size={18} /></>}</button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body,
  )
}

/** Remembers per browser whether a tour was finished or skipped, and opens it once on first visit. */
export function useFirstVisitTour(key: string, delay = 700) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    let seen = false
    try { seen = localStorage.getItem(key) === '1' } catch { /* private mode: show once per load */ }
    if (seen) return
    const t = window.setTimeout(() => setOpen(true), delay)
    return () => window.clearTimeout(t)
  }, [key, delay])
  const close = useCallback(() => { setOpen(false); try { localStorage.setItem(key, '1') } catch { /* noop */ } }, [key])
  return { open, start: () => setOpen(true), close }
}
