export const STORAGE_KEY = 'spbc-everywhere-demo-v2'
let memory: string | null = null
export function loadRaw(): string | null {
  try { const v = window.localStorage.getItem(STORAGE_KEY); if (v !== null) return v } catch { /* fall through */ }
  return memory
}
export function saveRaw(value: string): boolean {
  memory = value
  try { window.localStorage.setItem(STORAGE_KEY, value); return true } catch { return false }
}
export function clearRaw() {
  memory = null
  try { window.localStorage.removeItem(STORAGE_KEY) } catch { /* noop */ }
}
