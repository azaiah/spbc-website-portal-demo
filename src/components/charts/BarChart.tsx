/** Tiny dependency-free bar chart. Accessible: data also rendered as sr-only list. */
export function BarChart({ data, height = 120, color = '#C9A24B', format = (n: number) => n.toLocaleString(), labelEvery = 1 }: { data: { label: string; value: number }[]; height?: number; color?: string; format?: (n: number) => string; labelEvery?: number }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  return (
    <div>
      <div className="flex items-end gap-1" style={{ height }} role="img" aria-label="Bar chart">
        {data.map((d, i) => (
          <div key={d.label + i} className="flex-1 flex flex-col items-center justify-end h-full group relative min-w-0">
            <div className="w-full rounded-t-sm transition-colors" style={{ height: `${(d.value / max) * 100}%`, background: color, opacity: 0.85 }} />
            <span className="pointer-events-none absolute -top-6 opacity-0 group-hover:opacity-100 rounded bg-midnight px-1.5 py-0.5 text-[13px] text-white whitespace-nowrap">{format(d.value)}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-1 mt-1">
        {data.map((d, i) => (
          <div key={d.label + i} className="flex-1 text-center font-mono text-[13px] text-slate truncate">{i % labelEvery === 0 ? d.label : ''}</div>
        ))}
      </div>
      <ul className="sr-only">{data.map((d) => <li key={d.label}>{d.label}: {format(d.value)}</li>)}</ul>
    </div>
  )
}

export function Sparkline({ values, color = '#C9A24B', width = 120, height = 32 }: { values: number[]; color?: string; width?: number; height?: number }) {
  if (values.length < 2) return null
  const max = Math.max(...values); const min = Math.min(...values); const span = max - min || 1
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * width},${height - ((v - min) / span) * (height - 4) - 2}`).join(' ')
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ maxWidth: width, display: 'block' }} aria-hidden="true">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export function Donut({ segments, size = 120, thickness = 16 }: { segments: { label: string; value: number; color: string }[]; size?: number; thickness?: number }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  let offset = 0
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Donut chart">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E1DBD0" strokeWidth={thickness} />
      {segments.map((s) => {
        const len = (s.value / total) * c
        const el = <circle key={s.label} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color} strokeWidth={thickness} strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
        offset += len
        return el
      })}
    </svg>
  )
}
