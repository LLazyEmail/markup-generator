import { readFileSync } from 'node:fs';

/** Read a UTF-8 text file from disk. */
export function readSourceFile(fileName: string): string {
  return readFileSync(fileName, { encoding: 'utf-8' });
}
