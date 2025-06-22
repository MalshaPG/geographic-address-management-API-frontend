import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/tmf-api': {
        target: 'https://geographic-address-management-api.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
