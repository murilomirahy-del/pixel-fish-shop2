import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/pixel-fish-shop2/', // ESTA É A CORREÇÃO
  plugins: [react()],
})
