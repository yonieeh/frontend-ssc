import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      plugins: [{
        name: 'copy-redirects',
        writeBundle () {
          copyFileSync('public/_redirects', 'dist/_redirects');
        }
      }]
    }
  },
})
