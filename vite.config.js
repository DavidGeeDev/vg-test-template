import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // CRITICAL for SCORM: ensures assets are loaded relatively
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
