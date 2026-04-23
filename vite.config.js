import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/portfolio-git-2026/',
  plugins: [react()],
  server: {
    proxy: {
      '/padelfip': {
        target: 'https://www.padelfip.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/padelfip/, ''),
      },
      '/wikimedia': {
        target: 'https://upload.wikimedia.org',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/wikimedia/, ''),
      },
    },
  },
  preview: {
    proxy: {
      '/padelfip': {
        target: 'https://www.padelfip.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/padelfip/, ''),
      },
      '/wikimedia': {
        target: 'https://upload.wikimedia.org',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/wikimedia/, ''),
      },
    },
  },
})
