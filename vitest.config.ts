import { defineConfig } from 'vite';
import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const sharedConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      '@': new URL('./', import.meta.url).pathname,
    },
  },
};

const viteConfig = defineConfig(sharedConfig);

const testConfig = defineTestConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'src/**/*.stories.{js,jsx,ts,tsx}',
        'src/**/types.ts',
        'src/**/interfaces.ts',
        'src/**/constants.ts',
        'src/vitest.setup.ts',
        'src/main.tsx',
        'src/index.tsx',
        'src/App.tsx',
        'src/AppContent.tsx',
        'src/contexts/**',
        'src/services/geminiService.ts',
        'src/components/ui/ErrorBoundary.tsx'
      ]
    }
  },
});

export default mergeConfig(viteConfig, testConfig);