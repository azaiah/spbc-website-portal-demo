import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionProps } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'

/** Rise-in on scroll. Motif: elements gather upward softly, like a congregation standing. */
export function Rise({ children, delay = 0, className = '', y = 24 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const reduce = useReducedMotion()
  const props: MotionProps = reduce ? {} : {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-10% 0px' },
    transition: { duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] },
  }
  return <motion.div className={className} {...props}>{children}</motion.div>
}

/** Staggered children. Use with `item` variants on each child. */
export function Stagger({ children, className = '', step = 0.08 }: { children: ReactNode; className?: string; step?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div className={className} initial={reduce ? undefined : 'hidden'} whileInView={reduce ? undefined : 'show'} viewport={{ once: true, margin: '-10% 0px' }} variants={{ hidden: {}, show: { transition: { staggerChildren: step } } }}>
      {children}
    </motion.div>
  )
}
export const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
}

/** Heading whose gold underline draws in when visible. */
export function Underline({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  return <span ref={ref} className={`underline-draw ${inView ? 'is-visible' : ''} ${className}`}>{children}</span>
}

/** Gentle parallax for decorative layers. */
export function Parallax({ children, speed = 0.2, className = '' }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [speed * 120, -speed * 120])
  return <motion.div ref={ref} style={reduce ? undefined : { y }} className={className}>{children}</motion.div>
}

function Ticker({ to, duration }: { to: number; duration: number }) {
  const [v, setV] = useState(duration === 0 ? to : 0)
  useEffect(() => {
    if (duration === 0) { setV(to); return }
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000))
      const eased = 1 - Math.pow(1 - p, 3)
      setV(Math.round(to * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, duration])
  return <>{v.toLocaleString()}</>
}

/** Counts up a number when scrolled into view. */
export function CountUp({ to, prefix = '', suffix = '', duration = 1.4, className = '' }: { to: number; prefix?: string; suffix?: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduce = useReducedMotion()
  return (
    <span ref={ref} className={className}>
      {prefix}{inView || reduce ? <Ticker to={to} duration={reduce ? 0 : duration} /> : 0}{suffix}
    </span>
  )
}
