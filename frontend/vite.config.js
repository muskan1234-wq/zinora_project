import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@mui/x-data-grid', '@mui/material', '@emotion/react'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
  }
})