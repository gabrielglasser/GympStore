import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://gymp-store-backend.vercel.app',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
