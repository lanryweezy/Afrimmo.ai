import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable in production for security
    minify: 'terser', // Use terser for better minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true, // Remove debugger statements
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ai-vendor': ['@google/generative-ai'],
          'ui-vendor': ['@headlessui/react', '@heroicons/react'], // Add if using these libraries
        },
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
  },
  preview: {
    port: 3000,
    strictPort: true,
    host: true,
  },
  css: {
    postcss: './postcss.config.cjs'
  }
});