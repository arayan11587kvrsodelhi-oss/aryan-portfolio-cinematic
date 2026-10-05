import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        border: 'var(--border)',
        surface: 'var(--surface)',
        // shadcn tokens (mapped to existing portfolio CSS vars)
        primary: {
          DEFAULT: 'var(--accent)',
          foreground: '#05080a',
        },
        secondary: {
          DEFAULT: 'var(--surface)',
          foreground: 'var(--foreground)',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        input: 'var(--border)',
        ring: 'var(--accent)',
        card: 'var(--surface-card)',
        popover: 'var(--surface)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      maxWidth: {
        container: 'var(--container-width)',
      },
    },
  },
  plugins: [],
} satisfies Config
