import { existsSync, readdirSync } from 'node:fs';
import { MarkupGeneratorError } from './errors';
import { resolveFromCwd } from './read';

const DEFAULT_SKIP = new Set(['index.js', 'index2.js', 'registry.ts', 'registry.js']);

export function pathExists(filePath: string): boolean {
  return existsSync(resolveFromCwd(filePath));
}

export type ListTemplateFilesOptions = {
  skipFiles?: Iterable<string>;
  extensions?: RegExp;
};

/**
 * List template-like files in a directory.
 * Missing directories return []. Used by generate-template CLI --list.
 */
export function listTemplateFiles(
  dir: string,
  options: ListTemplateFilesOptions = {}
): string[] {
  const absolute = resolveFromCwd(dir);
  if (!existsSync(absolute)) return [];

  const skip = new Set(options.skipFiles ?? DEFAULT_SKIP);
  const extensions = options.extensions ?? /\.(ts|js)$/;

  try {
    return readdirSync(absolute)
      .filter((name) => {
        if (skip.has(name)) return false;
        if (/LATER\./i.test(name)) return false;
        return extensions.test(name);
      })
      .sort();
  } catch (error) {
    throw new MarkupGeneratorError(
      'EREAD',
      `Failed to read directory "${absolute}": ${(error as Error).message}`
    );
  }
}
