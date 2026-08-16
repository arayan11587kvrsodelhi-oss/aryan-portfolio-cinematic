import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/aryan-portfolio-cinematic/',
  build: {
    target: 'esnext',
    sourcemap: false,
  },
})
