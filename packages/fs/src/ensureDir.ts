import { existsSync, mkdirSync } from 'node:fs';

/** Creates the directory if it does not exist. */
export function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * @deprecated since 4.0.0 — use `ensureDir`. The name suggests a boolean check,
 * but it creates the directory. Kept as an alias; will be removed in v5.
 */
export const isFolderExists = ensureDir;
