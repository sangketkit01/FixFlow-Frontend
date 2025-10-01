import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from "dotenv";


dotenv.config()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.VITE_PORT,
  },
})
