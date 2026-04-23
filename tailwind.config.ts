import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0a0f1e',
        navy: '#0d1b2a',
        cyan: '#006666',
        teal: '#008080',
      },
      backgroundImage: {
        glass: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'pulse-glow': {
          '0%, 100%': { filter: 'drop-shadow(0 0 0px #006666)' },
          '50%': { filter: 'drop-shadow(0 0 24px #006666)' },
        },
        scan: {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        marquee: 'marquee 18s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        scan: 'scan 1.5s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
