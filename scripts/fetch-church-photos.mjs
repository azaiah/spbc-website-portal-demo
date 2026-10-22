// Downloads any of the church's own photos listed in src/data/photos.json that are missing from public/images/church.
// The photos are committed to the repo, so this is normally a no-op. Warns (never fails) when offline.
import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const list = JSON.parse(await readFile(join(root, 'src/data/photos.json'), 'utf8'))
let got = 0
for (const p of list) {
  const out = join(root, 'public/images/church', `${p.name}.${p.ext}`)
  try { await access(out); continue } catch {}
  try {
    const r = await fetch(p.src); if (!r.ok) throw new Error(`HTTP ${r.status}`)
    await mkdir(dirname(out), { recursive: true }); await writeFile(out, Buffer.from(await r.arrayBuffer())); got++
  } catch (e) { console.warn(`[photos] could not fetch ${p.name}: ${e.message}`) }
}
if (got) console.log(`[photos] downloaded ${got} photo(s)`)
