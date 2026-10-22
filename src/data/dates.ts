export function todayIso() { return new Date().toISOString().slice(0, 10) }
export function iso(d: Date) { return d.toISOString().slice(0, 10) }
export function daysFromNow(n: number) { const d = new Date(); d.setDate(d.getDate() + n); return iso(d) }
export function fmtDate(s: string, opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!s) return ''
  const d = new Date(s.length === 10 ? s + 'T12:00:00' : s)
  return d.toLocaleDateString('en-US', opts)
}
export function fmtShort(s: string) { return fmtDate(s, { month: 'short', day: 'numeric' }) }
export function fmtLong(s: string) { return fmtDate(s, { weekday: 'long', month: 'long', day: 'numeric' }) }
export function fmtTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${ampm}`
}
export function money(n: number, cents = false) { return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: cents ? 2 : 0 }) }
export function daysUntil(s: string) { return Math.round((new Date(s + 'T12:00:00').getTime() - new Date().getTime()) / 86400000) }
export function relDays(s: string) {
  if (!s) return 'Never'
  const n = daysUntil(s)
  if (n === 0) return 'Today'
  if (n === 1) return 'Tomorrow'
  if (n === -1) return 'Yesterday'
  return n > 0 ? `In ${n} days` : `${-n} days ago`
}
export function monthKey(s: string) { return s.slice(0, 7) }
export function monthLabel(key: string) { const [y, m] = key.split('-').map(Number); return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'short' }) }
