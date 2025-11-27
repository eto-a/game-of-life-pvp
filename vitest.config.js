/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setupTests.js'],
    globals: true,
    css: true,
    pool: 'threads',
    minWorkers: 1,
    maxWorkers: 1,
    testTimeout: 30000,
    hookTimeout: 30000,
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      thresholds: { lines: 80, branches: 80, functions: 80, statements: 80 },
      exclude: [
        '**/src/test/**',
        '**/src/main.jsx',
        '**/src/app/router.jsx',
        '**/src/app/layout/**',
        '**/src/shared/ui/**',
        '**/src/shared/config/**',
        '**/src/shared/api/**',
        '**/src/shared/ws/**',
        '**/src/workers/**',
        '**/*.config.js',
        '**/src/features/rooms/rooms.api.js',
        '**/src/features/room/useRoomSocket.js',
        '**/src/features/**/*.api.js',
        '**/src/pages/Arena.jsx',
      ],
    },
  },
  resolve: {
    alias: {
      // add aliases here if you use absolute imports
    },
  },
});
