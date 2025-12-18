import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // WARNING: API keys should NOT be exposed to the client
        // These will be visible in the browser bundle
        // TODO: Move API calls to backend server to protect keys
        // For now, keeping for development only - DO NOT use in production
        ...(mode === 'development' && {
          'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
          'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        }),

        // Safe to expose - these are meant for client-side
        'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://localhost:4000'),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // Build optimizations
      build: {
        sourcemap: mode === 'development',
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom', 'react-router-dom'],
              'chart-vendor': ['recharts', 'chart.js', 'react-chartjs-2'],
            }
          }
        }
      }
    };
});
