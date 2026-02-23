import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Employee-App/',
  server: {
    proxy: {
      '/api': {
        target: 'https://backend.jotish.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/backend_dev'),
        secure: false,
      }
    }
  }
})
