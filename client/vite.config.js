import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const target = process.env.VITE_API_URL|| 'http://localhost:4000'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: target,
        changeOrigin: true
      }
    }
  }

})
