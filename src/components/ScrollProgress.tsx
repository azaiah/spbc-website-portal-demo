import { motion, useScroll, useSpring } from 'framer-motion'

/** Thin top-of-page progress bar: a gold line that fills as the reader moves through the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  return (
    <div className="fixed top-0 left-0 right-0 z-[70] h-[4px] pointer-events-none" aria-hidden="true">
      <motion.div className="absolute inset-y-0 left-0 w-full origin-left bg-gold" style={{ scaleX }} />
    </div>
  )
}
