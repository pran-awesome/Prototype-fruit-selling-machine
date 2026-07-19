import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The Vite dev server proxies /api to the Flask backend so the browser sees a
// single origin (cookies / sessions work without CORS headaches).
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
