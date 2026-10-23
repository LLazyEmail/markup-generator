export { resolveFromCwd } from '@llazyemail/fs';

/**
 * TypeScript can rewrite `import()` to `require()` in CJS builds.
 * This keeps a real dynamic import at runtime.
 */
export const importEsm = new Function(
  'specifier',
  'return import(specifier)'
) as (specifier: string) => Promise<{ default?: unknown }>;
