import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],              // ⬅️ включает automatic JSX runtime для тестов
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setupTests.js'],
    css: true,
    globals: true,
    pool: 'threads',
    minWorkers: 1,
    maxWorkers: 1,
    testTimeout: 30000,
    hookTimeout: 30000,
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
});
