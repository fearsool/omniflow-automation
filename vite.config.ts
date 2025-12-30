import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const hfToken = env.VITE_HUGGINGFACE_TOKEN || '';

  return {
    server: {
      port: 3003,
      host: '0.0.0.0',
      proxy: {
        '/api/hf': {
          target: 'https://router.huggingface.co',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/hf/, '/v1'),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              if (hfToken) {
                proxyReq.setHeader('Authorization', `Bearer ${hfToken}`);
              }
              proxyReq.setHeader('Content-Type', 'application/json');
            });
            proxy.on('error', (err, req, res) => {
              console.error('[Proxy Error]', err.message);
            });
          }
        }
      }
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.VITE_HUGGINGFACE_TOKEN': JSON.stringify(env.VITE_HUGGINGFACE_TOKEN),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
