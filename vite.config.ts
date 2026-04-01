import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://ratro.nichesite.org', // ⚠️ GANTI dengan domain asli kamu
      dynamicRoutes: ['/'], // Tambahkan route lain jika ada
      outDir: 'dist', // Pastikan output ke folder dist
    }),
  ],
})