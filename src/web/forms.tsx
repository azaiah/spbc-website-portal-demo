import { useState, type FormEvent, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { church } from '@/config/site'

/** Encodes and posts a form to Netlify Forms. Resolves true on success (or when running locally without Netlify). */
export async function postNetlify(formName: string, data: Record<string, string>) {
  const body = new URLSearchParams({ 'form-name': formName, ...data }).toString()
  try {
    const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
    // Local dev / preview servers answer 404/405 to POST "/"; treat as accepted so the demo flow continues.
    return res.ok || res.status === 404 || res.status === 405
  } catch {
    return false
  }
}

export function formData(e: FormEvent<HTMLFormElement>) {
  const fd = new FormData(e.currentTarget)
  const out: Record<string, string> = {}
  fd.forEach((v, k) => { if (typeof v === 'string') out[k] = v.trim() })
  return out
}

/**
 * Website form wrapper: honeypot field, Netlify form name, success state.
 * `onSubmitted` lets the page also record the request in Saint Paul’s Everywhere (the demo's shared store).
 */
export function SiteForm({ name, children, onSubmitted, submitLabel, success, className = '' }: { name: string; children: ReactNode; onSubmitted?: (d: Record<string, string>) => void; submitLabel: string; success: { title: string; text: ReactNode }; className?: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const d = formData(e)
    if (d['bot-field']) return
    setState('sending')
    const ok = await postNetlify(name, d)
    if (ok) { onSubmitted?.(d); setState('done') } else setState('error')
  }
  if (state === 'done') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className={`rounded-3xl border border-grow/30 bg-grow-50 p-8 text-center ${className}`} role="status">
        <CheckCircle2 size={48} className="mx-auto text-grow" />
        <h3 className="mt-4 font-display text-3xl font-bold">{success.title}</h3>
        <div className="mt-2 text-stone leading-relaxed">{success.text}</div>
      </motion.div>
    )
  }
  return (
    <form name={name} method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={submit} className={`grid gap-4 ${className}`} noValidate={false}>
      <input type="hidden" name="form-name" value={name} />
      <p className="hidden"><label>Leave empty <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
      {children}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button type="submit" disabled={state === 'sending'} className="inline-flex items-center justify-center gap-2 rounded-full bg-orange px-8 min-h-[56px] text-lg font-bold text-ink shadow-glow hover:bg-[#ff9440] disabled:opacity-60 w-full sm:w-auto">
          {state === 'sending' && <Loader2 size={18} className="animate-spin" />}{state === 'sending' ? 'Sending' : submitLabel}
        </button>
        {state === 'error' && <p className="text-sm text-danger" role="alert">That did not send. Please call {church.phone} or try again.</p>}
      </div>
    </form>
  )
}

const fieldCls = 'w-full rounded-2xl border-2 border-line bg-paper px-4 py-3 text-lg text-ink placeholder:text-stone/70 focus:border-grow focus:outline-none focus:ring-4 focus:ring-grow/15 min-h-[56px]'

export function F({ label, name, type = 'text', required, placeholder, autoComplete, hint, className = '', as, options, rows }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string; autoComplete?: string; hint?: string; className?: string; as?: 'textarea' | 'select'; options?: string[]; rows?: number }) {
  const id = `f-${name}`
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-base font-bold text-ink mb-1.5">{label}{required && <span className="text-ember" aria-hidden="true"> *</span>}{hint && <span className="ml-1 font-normal text-stone">{hint}</span>}</label>
      {as === 'textarea' ? <textarea id={id} name={name} required={required} placeholder={placeholder} rows={rows ?? 4} className={`${fieldCls} min-h-[120px]`} />
        : as === 'select' ? <select id={id} name={name} required={required} className={fieldCls} defaultValue="">{<option value="" disabled>Choose one</option>}{options?.map((o) => <option key={o} value={o}>{o}</option>)}</select>
        : <input id={id} name={name} type={type} required={required} placeholder={placeholder} autoComplete={autoComplete} className={fieldCls} />}
    </div>
  )
}

export function Check({ name, label, defaultChecked }: { name: string; label: ReactNode; defaultChecked?: boolean }) {
  return (
    <label className="flex items-start gap-3 text-base text-stone cursor-pointer min-h-[44px] py-1">
      <input type="checkbox" name={name} value="yes" defaultChecked={defaultChecked} className="mt-0.5 h-5 w-5 shrink-0 accent-[#006C3A]" />
      <span>{label}</span>
    </label>
  )
}
