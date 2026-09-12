import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
      browser: 'src/browser.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    splitting: false,
    sourcemap: true,
    target: 'node18',
    outDir: 'dist',
    platform: 'neutral',
    external: ['gray-matter'],
  },
  {
    entry: {
      cli: 'src/cli.ts',
    },
    format: ['cjs'],
    dts: false,
    splitting: false,
    sourcemap: false,
    target: 'node18',
    outDir: 'dist',
    platform: 'node',
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
]);
