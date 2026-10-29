import { defineConfig } from 'tsup';

// Root package.json has "type": "module", but force the extensions that
// package.json `main` / `module` / `exports` / `bin` point at.
const outExtension = ({ format }: { format: string }) => ({
  js: format === 'cjs' ? '.cjs' : '.js',
});

/** Bundle internal workspace packages so the published tarball has zero @llazyemail/* runtime deps. */
const noExternal = [/^@llazyemail\//];

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
    outExtension,
    platform: 'node',
    noExternal,
    // gray-matter stays external (listed in root dependencies).
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
    outExtension,
    platform: 'browser',
    // browser.ts imports only generateFileName from packages/write/src (no Node APIs).
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
    outExtension,
    platform: 'node',
    noExternal,
  },
]);
