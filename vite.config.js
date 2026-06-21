import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Changed from 'react-plugin' to 'plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://pocketbiz-backend-1.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});