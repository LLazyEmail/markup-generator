/**
 * Native dynamic import helper. This package is ESM (`"type": "module"`,
 * `module: ESNext`), so TypeScript preserves `import()` as-is at runtime.
 */
export const importEsm = (specifier: string): Promise<{ default?: unknown }> =>
  import(specifier) as Promise<{ default?: unknown }>;
