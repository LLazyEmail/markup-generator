import path from 'node:path';
import { defineConfig } from 'vitest/config';

const root = path.resolve(import.meta.dirname);

/** Resolve workspace packages to their TypeScript sources so coverage
 *  instruments the code that actually runs (instead of the built dist/). */
const sourceAliases = {
  '@llazyemail/fs': path.join(root, 'packages/fs/src/index.ts'),
  '@llazyemail/write': path.join(root, 'packages/write/src/index.ts'),
  '@llazyemail/read': path.join(root, 'packages/read/src/index.ts'),
  '@llazyemail/email': path.join(root, 'packages/email/src/index.ts'),
  '@llazyemail/cli': path.join(root, 'packages/cli/src/index.ts'),
  '@llazyemail/template': path.join(root, 'packages/template/src/index.ts'),
};

export default defineConfig({
  resolve: {
    alias: sourceAliases,
  },
  test: {
    environment: 'node',
    fileParallelism: false,
    include: ['src/**/*.{test,spec}.ts', 'tests/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts', 'packages/*/src/**/*.ts'],
      exclude: ['**/*.d.ts', '**/tests/**', '**/dist/**'],
      thresholds: {
        lines: 50,
        functions: 50,
        branches: 40,
        statements: 50,
      },
    },
  },
});
