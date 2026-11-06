import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    fileParallelism: false,
    include: ['src/**/*.{test,spec}.ts', 'tests/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts', 'packages/*/src/**/*.ts'],
      exclude: ['**/*.d.ts', '**/tests/**', '**/dist/**'],
      // Thresholds disabled for now. Root vitest resolves workspace packages to their
      // built dist/ entries, so source-level instrumentation currently reports ~0%.
      // Re-enable and raise once coverage is collected from the executed sources
      // (or once package tests are included in this run).
      // thresholds: {
      //   lines: 60,
      //   functions: 60,
      //   branches: 50,
      //   statements: 60,
      // },
    },
  },
});
