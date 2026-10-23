import { resolve } from 'node:path';

/** Resolve a path from process.cwd() unless it is already absolute. */
export const resolveFromCwd = (filePath: string): string =>
  resolve(process.cwd(), filePath);
