import { defineConfig } from 'tsup';

const inlineWorkspace = [/^@llazyemail\//] as const;

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    splitting: false,
    sourcemap: true,
    target: 'node20',
    outDir: 'dist',
    platform: 'node',
    // Workspace packages are private; inline them. Bundle gray-matter too so root
    // package.json need not list it (owned by @llazyemail/read).
    noExternal: [...inlineWorkspace],
  },
  {
    entry: {
      browser: 'src/browser.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    target: 'es2020',
    outDir: 'dist',
    platform: 'browser',
  },
  {
    entry: {
      cli: 'src/cli.ts',
    },
    format: ['cjs'],
    dts: false,
    splitting: false,
    sourcemap: false,
    target: 'node20',
    outDir: 'dist',
    platform: 'node',
    banner: {
      js: '#!/usr/bin/env node',
    },
    noExternal: [...inlineWorkspace],
  },
]);
