import { readFileSync } from 'node:fs';
import { MarkupGeneratorError } from '@llazyemail/write';

/** Read a UTF-8 text file from disk. Failures throw EREAD with `cause`. */
export function readSourceFile(fileName: string): string {
  try {
    return readFileSync(fileName, { encoding: 'utf-8' });
  } catch (err) {
    throw new MarkupGeneratorError(
      'EREAD',
      `Failed to read file "${fileName}": ${(err as Error).message}`,
      { cause: err }
    );
  }
}
