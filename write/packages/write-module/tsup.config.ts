import { defineConfig } from 'tsup';

export default defineConfig({
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
});
