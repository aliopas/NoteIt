import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // ⬅️ مهم جداً لـ Vercel
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      // Proxy API requests to backend during development
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    emptyOutDir: true // ⬅️ أضفت دي كمان علشان تنضف الفولدر قبل البيلد
  }
})