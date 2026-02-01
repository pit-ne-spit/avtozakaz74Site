import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        // Таймауты как в production nginx
        timeout: 60000,
        proxyTimeout: 60000,
        // Настройки WebSocket и keep-alive
        ws: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // HTTP/1.1 keep-alive
            proxyReq.setHeader('Connection', 'keep-alive');
          });
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err.message);
          });
        }
      }
    }
  }
})
