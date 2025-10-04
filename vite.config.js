import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from "dotenv";


dotenv.config()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 1. Convert the port from a string to a number
    port: Number(process.env.VITE_PORT) || 3000,
    
    // 2. Add a proxy to forward API requests
    proxy: {
      '/api': {
        target: process.env.VITE_BASE_URL, // Use the URL from your .env
        changeOrigin: true,
      }
    }
  },
})