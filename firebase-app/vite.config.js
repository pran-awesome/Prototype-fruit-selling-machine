import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// JS-only, client-side app (no backend). Builds to ./dist for Firebase Hosting.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5174,
  },
})
