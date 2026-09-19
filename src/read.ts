import { resolve } from 'path';

/** Resolve a path from process.cwd() unless it is already absolute. */
export const resolveFromCwd = (filePath: string): string =>
  resolve(process.cwd(), filePath);

/**
 * TypeScript can rewrite `import()` to `require()` in CJS builds.
 * This keeps a real dynamic import at runtime.
 */
export const importEsm = new Function(
  'specifier',
  'return import(specifier)'
) as (specifier: string) => Promise<{ default?: unknown }>;
