import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Mark } from '@/components/Logo'
import { GoldButton, GlassButton } from '../ui'

export default function NotFound() {
  useDocumentMeta('Page not found | The Saint Paul’s Baptist Church', 'This page could not be found.')
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-night text-white grid place-items-center px-4 text-center">
      <div aria-hidden="true" className="absolute inset-0 -z-10 lights opacity-40" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_45%,rgba(243,128,31,0.25),transparent_70%)]" />
      <div className="max-w-xl">
        <Mark size={64} light className="mx-auto" />
        <p className="mt-6 font-caps font-semibold text-glow">Luke 15:24</p>
        <h1 className="display text-5xl sm:text-7xl mt-3">Lost, but never too far to be found.</h1>
        <p className="mt-5 text-xl text-white/85">The page you were looking for is not here. Let us help you find your way home.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><GoldButton to="/">Go home</GoldButton><GlassButton to="/visit">Plan a visit</GlassButton></div>
      </div>
    </section>
  )
}
