import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['fast-xml-parser']
    }
  },
  optimizeDeps: {
    include: ['fast-xml-parser']
  }
})
