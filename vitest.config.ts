import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    fileParallelism: false,
    include: ['src/**/*.{test,spec}.ts', 'tests/**/*.{test,spec}.ts'],
  },
});
