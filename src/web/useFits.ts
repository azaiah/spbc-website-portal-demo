import { useEffect, useState } from 'react'

/**
 * True when the window is large enough to show a full-screen pinned scroll scene without cutting
 * anything off. Small laptop windows, split screens and landscape phones get the simple layout.
 */
export function useFits(minHeight = 700, minWidth = 0) {
  const get = () => typeof window !== 'undefined' && window.innerHeight >= minHeight && window.innerWidth >= minWidth
  const [fits, setFits] = useState(get)
  useEffect(() => {
    const on = () => setFits(get())
    on()
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minHeight, minWidth])
  return fits
}
