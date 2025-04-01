import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3030',
        changeOrigin: true
      }
    }
  },
  optimizeDeps: {
    exclude: ['punycode']
  },
  build: {
    rollupOptions: {
      external: ['punycode']
    }
  }
}) 