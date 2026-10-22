import { useState, type ReactNode, type ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import photos from '@/data/photos.json'
import { Mark } from '@/components/Logo'

type PhotoEntry = { name: string; alt: string; ext: string }
const byName = new Map((photos as PhotoEntry[]).map((p) => [p.name, p]))

/** Path to one of the church's own photos (self-hosted in public/images/church). */
export const photoSrc = (name: string) => { const p = byName.get(name); return p ? `/images/church/${p.name}.${p.ext}` : '' }
export const photoAlt = (name: string) => byName.get(name)?.alt ?? ''
/** Generated art (Kie.ai), optimized to WebP. */
export const art = (name: string, small = false) => `/images/art/${name}${small ? '-sm' : ''}.webp`
export const flyerSrc = (file: string) => `/images/church/${file}`

/** Wrapper position: a caller that passes absolute/fixed/sticky must win. */
const anchored = (cls: string) => (/(^|\s)(absolute|fixed|sticky)(\s|$)/.test(cls) ? '' : 'relative')

/** The church's real photo, with a branded fallback so layouts never break. Lazy by default. */
export function Photo({ name, className = '', imgClassName = '', alt, eager = false, sizes }: { name: string; className?: string; imgClassName?: string; alt?: string; eager?: boolean; sizes?: string }) {
  const [failed, setFailed] = useState(false)
  const src = photoSrc(name)
  return (
    <div className={`${anchored(className)} overflow-hidden bg-gradient-to-br from-canopy via-canopy-2 to-night ${className}`}>
      {(!src || failed) ? (
        <div className="absolute inset-0 flex items-center justify-center" role="img" aria-label={alt ?? photoAlt(name)}>
          <div className="absolute inset-0 opacity-60" style={{ background: 'radial-gradient(60% 50% at 50% 40%, rgba(243,128,31,0.3), transparent 70%)' }} />
          <Mark size={56} light className="relative opacity-70" />
        </div>
      ) : (
        <img src={src} alt={alt ?? photoAlt(name)} loading={eager ? 'eager' : 'lazy'} decoding="async" sizes={sizes} onError={() => setFailed(true)} className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`} />
      )}
    </div>
  )
}

/** Generated art with a graceful fallback to a warm gradient (used until Kie.ai renders exist). */
export function Art({ name, alt, className = '', imgClassName = '', eager = false, fallback = 'dawn' }: { name: string; alt: string; className?: string; imgClassName?: string; eager?: boolean; fallback?: 'dawn' | 'night' | 'land' }) {
  const [failed, setFailed] = useState(false)
  const bg = fallback === 'night' ? 'bg-night lights' : fallback === 'land' ? 'bg-gradient-to-b from-[#ffd7a3] via-[#f6c38c] to-[#2f5d3a]' : 'bg-gradient-to-b from-[#fde3cb] via-[#ffd7a3] to-[#f3801f]'
  return (
    <div className={`${anchored(className)} overflow-hidden ${bg} ${className}`} role={failed ? 'img' : undefined} aria-label={failed ? alt : undefined}>
      {!failed && <img src={art(name)} srcSet={`${art(name, true)} 800w, ${art(name)} 2000w`} sizes="(max-width: 768px) 100vw, 60vw" alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`} />}
    </div>
  )
}

export function Eyebrow({ children, light = false, className = '' }: { children: ReactNode; light?: boolean; className?: string }) {
  return (
    <p className={`inline-flex items-center gap-3 font-caps text-[15px] sm:text-base font-semibold tracking-[0.06em] ${light ? 'text-glow' : 'text-ember'} ${className}`}>
      <Leaf className={light ? 'text-orange' : 'text-orange'} />
      {children}
    </p>
  )
}

/** A single leaf from the logo canopy, used as a bullet and ornament. */
export function Leaf({ className = '', size = 14 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M12 2C6 7 4 12 6 18c2 3 6 4 6 4s4-1 6-4c2-6 0-11-6-16Z" fill="currentColor" />
    </svg>
  )
}

/** Word-by-word rise for headlines. Readable to screen readers as one string. */
const motionTags = { span: motion.span, h1: motion.h1, h2: motion.h2, p: motion.p }
export function SplitWords({ text, className = '', delay = 0, stagger = 0.05, as: Tag = 'span' }: { text: string; className?: string; delay?: number; stagger?: number; as?: 'span' | 'h1' | 'h2' | 'p' }) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  if (reduce) return <Tag className={className}>{text}</Tag>
  const M = motionTags[Tag]
  return (
    <M className={className} aria-label={text} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={{ hidden: {}, show: { transition: { delayChildren: delay, staggerChildren: stagger } } }}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]">
          <motion.span className="inline-block" variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}>
            {w}{i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </M>
  )
}

type CtaProps = { to?: string; href?: string; children: ReactNode; icon?: ReactNode; className?: string; size?: 'md' | 'lg' } & Omit<ComponentProps<'button'>, 'children'>
const base = 'group relative inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-300 select-none text-center leading-tight max-w-full focus-visible:outline-none focus-visible:ring-4'
const sizes = { md: 'min-h-[52px] px-6 text-[17px]', lg: 'min-h-[60px] px-8 text-lg' }

function CtaInner({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return <span className="relative z-10 inline-flex items-center gap-2">{children}{icon && <span className="transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span>}</span>
}

const isExt = (h: string) => /^https?:/.test(h)
function make(variant: string) {
  return function Cta({ to, href, children, icon, className = '', size = 'md', ...rest }: CtaProps) {
    const cls = `${base} ${sizes[size]} ${variant} ${className}`
    if (to) return <Link to={to} className={cls}><CtaInner icon={icon}>{children}</CtaInner></Link>
    if (href && href.startsWith('/')) return <Link to={href} className={cls}><CtaInner icon={icon}>{children}</CtaInner></Link>
    if (href) return <a href={href} className={cls} target={isExt(href) ? '_blank' : undefined} rel={isExt(href) ? 'noopener noreferrer' : undefined}><CtaInner icon={icon}>{children}</CtaInner></a>
    return <button type="button" className={cls} {...rest}><CtaInner icon={icon}>{children}</CtaInner></button>
  }
}
/** Primary action: sunrise orange with ink text (6.9:1). One per section. */
export const PrimaryButton = make('bg-orange text-ink shadow-glow hover:bg-[#ff9440] hover:-translate-y-0.5 focus-visible:ring-orange/40')
/** Back-compat name used by portal/admin code. */
export const GoldButton = PrimaryButton
/** Secondary: GROW green. */
export const GreenButton = make('bg-grow text-white hover:bg-canopy shadow-lift focus-visible:ring-grow/30')
export const RoyalButton = GreenButton
/** Outlined, for light backgrounds. */
export const OutlineButton = make('border-2 border-grow/30 text-grow hover:border-grow hover:bg-grow hover:text-white focus-visible:ring-grow/25')
/** Frosted outline for dark or photo backgrounds. */
export const GlassButton = make('bg-white/10 text-white backdrop-blur-md border-2 border-white/40 hover:bg-white/20 hover:border-white focus-visible:ring-white/30')

export function SectionHeading({ eyebrow, title, text, light = false, center = false, className = '' }: { eyebrow?: string; title: string; text?: ReactNode; light?: boolean; center?: boolean; className?: string }) {
  return (
    <div className={`${center ? 'text-center mx-auto' : ''} max-w-3xl ${className}`}>
      {eyebrow && <Eyebrow light={light} className={center ? 'justify-center' : ''}>{eyebrow}</Eyebrow>}
      <SplitWords as="h2" text={title} className={`display text-[2.5rem] sm:text-6xl mt-4 text-balance ${light ? 'text-white' : 'text-ink'}`} />
      {text && <div className={`mt-5 text-xl leading-relaxed ${light ? 'text-white/85' : 'text-stone'}`}>{text}</div>}
    </div>
  )
}

/** Inner-page hero: light morning band with a real photo panel. */
export function PageHero({ eyebrow, title, text, photo, children, tone = 'morning' }: { eyebrow: string; title: string; text?: ReactNode; photo?: string; children?: ReactNode; tone?: 'morning' | 'canopy' | 'lilac' }) {
  const bg = tone === 'canopy' ? 'bg-canopy text-white' : tone === 'lilac' ? 'bg-lilac text-ink' : 'bg-parchment text-ink'
  const light = tone === 'canopy'
  return (
    <section className={`relative isolate overflow-hidden ${bg}`}>
      <div aria-hidden="true" className="absolute -right-24 -top-16 opacity-[0.07] pointer-events-none"><Mark size={520} light={light} /></div>
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 pt-32 sm:pt-40 pb-14 sm:pb-20 grid gap-10 ${photo ? 'lg:grid-cols-[1.15fr_0.85fr] items-end' : ''}`}>
        <div>
          <Eyebrow light={light}>{eyebrow}</Eyebrow>
          <SplitWords as="h1" text={title} className="display text-[2.8rem] sm:text-7xl mt-5 max-w-4xl text-balance" />
          {text && <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }} className={`mt-6 max-w-2xl text-xl sm:text-2xl leading-relaxed ${light ? 'text-white/85' : 'text-stone'}`}>{text}</motion.div>}
          {children && <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.7 }} className="mt-8 flex flex-wrap gap-3">{children}</motion.div>}
        </div>
        {photo && <Photo name={photo} eager className="aspect-[4/3] rounded-[28px] shadow-lift" />}
      </div>
    </section>
  )
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 ${className}`}>{children}</div>
}

/** Small chip */
export function Chip({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[15px] font-semibold ${className}`}>{children}</span>
}

/** External link that opens in a new tab with an accessible hint. */
export function Ext({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  const ext = isExt(href)
  if (href.startsWith('/')) return <Link to={href} className={className}>{children}</Link>
  return <a href={href} className={className} target={ext ? '_blank' : undefined} rel={ext ? 'noopener noreferrer' : undefined}>{children}{ext && <span className="sr-only"> (opens in a new tab)</span>}</a>
}
