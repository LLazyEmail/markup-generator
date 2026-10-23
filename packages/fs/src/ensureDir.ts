import { existsSync, mkdirSync } from 'node:fs';

/** Creates the directory if it does not exist. */
export function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/** @deprecated Use ensureDir. */
export const isFolderExists = ensureDir;
