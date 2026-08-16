import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ilova production'da saytning /app/ yo'li ostida tarqatiladi,
// shuning uchun asset havolalari ham shu prefiks bilan yasaladi.
export default defineConfig({
  base: '/app/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
})
