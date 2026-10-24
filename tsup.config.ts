import { defineConfig } from 'tsup';

// Root package.json has no "type": "module", so force the extensions that
// package.json `main` / `module` / `exports` / `bin` point at.
const outExtension = ({ format }: { format: string }) => ({
  js: format === 'cjs' ? '.cjs' : '.js',
});

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
    // v4: @llazyemail/* are published dependencies, so keep them external
    // (gray-matter is resolved through @llazyemail/read at runtime).
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
    // src/cli.ts already starts with a shebang; tsup preserves it.
  },
]);
