import { Link } from 'react-router-dom'

/**
 * The Saint Paul's Baptist Church logo: the church's own artwork (a canopy of leaves over people with raised arms),
 * self-hosted from myspbc.events as SVG. Ink and white versions are recolors of the same file; the mark is a crop.
 */
const MARK_RATIO = 1560 / 1255.58
const LOGO_RATIO = 4884.17 / 1255.58

export function Mark({ size = 32, light = false, green = false, className = '' }: { size?: number; light?: boolean; green?: boolean; className?: string }) {
  const src = light ? '/images/church/spbc-mark-white.svg' : green ? '/images/church/spbc-mark-green.svg' : '/images/church/spbc-mark-ink.svg'
  return <img src={src} alt="" aria-hidden="true" width={Math.round(size * MARK_RATIO)} height={size} style={{ width: Math.round(size * MARK_RATIO), height: size }} className={`select-none max-w-none ${className}`} draggable={false} />
}

/** Full logo lockup from the church's artwork. */
export function FullLogo({ height = 44, light = false, className = '' }: { height?: number; light?: boolean; className?: string }) {
  return <img src={light ? '/images/church/spbc-logo-white.svg' : '/images/church/spbc-logo-ink.svg'} alt="The Saint Paul’s Baptist Church" width={Math.round(height * LOGO_RATIO)} height={height} style={{ aspectRatio: `${LOGO_RATIO}` }} className={`select-none ${className}`} draggable={false} />
}

/** Website lockup */
export function SiteLogo({ light = false, compact = false, to = '/' }: { light?: boolean; compact?: boolean; to?: string }) {
  return (
    <Link to={to} className="inline-flex items-center min-h-[44px] group shrink-0" aria-label="The Saint Paul’s Baptist Church home">
      <FullLogo height={compact ? 38 : 46} light={light} className={`transition-all duration-500 w-auto max-w-none ${compact ? 'h-[34px] sm:h-[38px]' : 'h-[38px] sm:h-[46px]'}`} />
    </Link>
  )
}

/** Portal and staff hub lockup: Saint Paul's Everywhere */
export function Logo({ light = false, size = 'md', compact = false, to = '/admin' }: { light?: boolean; size?: 'sm' | 'md'; compact?: boolean; to?: string }) {
  const text = light ? 'text-white' : 'text-ink'
  const sub = light ? 'text-glow' : 'text-ember'
  return (
    <Link to={to} className="inline-flex items-center justify-center gap-2.5 min-h-[44px] min-w-[44px]" aria-label="Saint Paul’s Everywhere home">
      <Mark size={size === 'sm' ? 28 : 34} light={light} />
      {!compact && (
        <span className="leading-none">
          <span className={`block font-display font-bold tracking-tight ${size === 'sm' ? 'text-lg' : 'text-xl'} ${text}`}>Saint Paul’s Everywhere</span>
          <span className={`block font-caps text-[13px] font-semibold tracking-[0.08em] mt-1 ${sub}`}>Members &amp; staff hub</span>
        </span>
      )}
    </Link>
  )
}

export function PoweredBy({ light = false, className = '' }: { light?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.12em] ${light ? 'text-white/65' : 'text-stone'} ${className}`}>
      <img src="/dataisdata-icon.png" alt="" width={16} height={16} className="rounded-sm" />
      ChurchConnect by DataIsData
    </span>
  )
}
