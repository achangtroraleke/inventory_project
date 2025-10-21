import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  server:{
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://localhost:8001', // Replace with your Django backend URL and port
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: remove /api prefix if not needed by backend
      },
    },
  }

})
