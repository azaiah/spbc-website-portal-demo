/** @type {import('tailwindcss').Config} */
// The Saint Paul's Baptist Church — tokens from DESIGN.md ("People on the GROW").
// Legacy token names (midnight, plum, gold, royal, linen...) are kept as aliases so the
// ChurchConnect portal and staff hub re-theme automatically. New code uses the SPBC names.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // SPBC names
        morning: '#FFFBF5',
        parchment: '#F6EEE3',
        ink: '#17131C',
        stone: '#5B5560',
        line: '#E8DFD2',
        orange: { DEFAULT: '#F3801F', soft: '#FDE3CB', 50: '#FFF4EA' },
        ember: '#B5520A',
        grow: { DEFAULT: '#006C3A', 50: '#E6F2EC' },
        canopy: { DEFAULT: '#00492A', 2: '#0B3B26' },
        possibility: { DEFAULT: '#673391', 50: '#F4ECFA' },
        lilac: '#F4ECFA',
        night: { DEFAULT: '#121212', 2: '#1B1820' },
        glow: '#FFD7A3',
        paper: '#FFFFFF',
        // Legacy aliases (portal + staff hub)
        midnight: { DEFAULT: '#0F2419', 2: '#16352A' },
        plum: { DEFAULT: '#00492A', 2: '#005C35' },
        amethyst: '#673391',
        linen: '#FFFBF5',
        gold: { DEFAULT: '#B5520A', bright: '#F3801F', light: '#FFC58A', 50: '#FFF1E3' },
        royal: { DEFAULT: '#673391', 50: '#F4ECFA' },
        slate: '#5B5560',
        success: '#1E7A4C',
        warning: '#9A5B00',
        danger: '#B42318',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', '"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        caps: ['"Bricolage Grotesque Variable"', 'system-ui', 'sans-serif'],
        sans: ['"Atkinson Hyperlegible Next"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(23,19,28,0.05), 0 10px 30px -12px rgba(23,19,28,0.18)',
        lift: '0 14px 40px -12px rgba(23,19,28,0.28)',
        glow: '0 0 0 1px rgba(243,128,31,0.25), 0 12px 32px -10px rgba(243,128,31,0.55)',
      },
      // Readability floor: the smallest utility is 14px (seniors read the hub on phones too).
      fontSize: { xs: ['0.875rem', { lineHeight: '1.25rem' }] },
      borderRadius: { '4xl': '2rem' },
      keyframes: {
        pulseDot: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.35' } },
        shimmer: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } },
        rays: { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
        drift: { '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' }, '50%': { transform: 'translate3d(3%,-2%,0) scale(1.08)' } },
        twinkle: { '0%,100%': { opacity: '0.25' }, '50%': { opacity: '1' } },
        glint: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        pulseDot: 'pulseDot 1.2s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
        rays: 'rays 120s linear infinite',
        drift: 'drift 18s ease-in-out infinite',
        twinkle: 'twinkle 3.2s ease-in-out infinite',
        glint: 'glint 6s linear infinite',
      },
    },
  },
  plugins: [],
}
