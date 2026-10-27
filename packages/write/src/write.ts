import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { resolve as pathResolve } from 'node:path';
import { ensureDir } from '@llazyemail/fs';
import { MarkupGeneratorError } from './errors';
import { generateFileName } from './generateFileName';
import type { WriteGeneratedFileOptions } from './types';

/**
 * @deprecated since 4.0.0 — use `writeGeneratedFile({ fileName, content, dir })`,
 * which validates the same way, supports `overwrite: 'error'` and returns the
 * absolute path. `writeHTML` stays only as a compatibility shim and will be
 * removed in v5.
 *
 * Writes UTF-8 text to `{cwd}/{dir}/{fileName}`.
 *
 * Contract:
 * - `dir` is resolved from `process.cwd()`
 * - missing directories are created
 * - existing files are overwritten unless a caller uses writeGeneratedFile({ overwrite: 'error' })
 * - empty content throws EMPTY_CONTENT
 * - non-string content throws NOT_A_STRING
 * - write failures throw WRITE_FAILED (default message from DEFAULT_MESSAGES)
 * - optional 4th arg `_message` is retained for API compatibility but is not logged
 *   (callers such as writeGeneratedEmail / CLI own success output; avoids console in shared surface)
 */
const writeHTML = (
  fileName: string,
  data: string,
  dir = 'generated',
  _message = ''
): Promise<void> => writeText(fileName, data, dir);

const writeText = async (
  fileName: string,
  data: string,
  dir = 'generated'
): Promise<void> => {
  if (!data) {
    throw new MarkupGeneratorError('EMPTY_CONTENT');
  }

  if (typeof data !== 'string') {
    throw new MarkupGeneratorError('NOT_A_STRING');
  }

  if (dir === '') {
    dir = 'generated';
  }

  ensureDir(pathResolve(dir));
  const fullPath = pathResolve(`${dir}/${fileName}`);

  try {
    await writeFile(fullPath, data, 'utf-8');
  } catch (err) {
    throw new MarkupGeneratorError('WRITE_FAILED', undefined, { cause: err });
  }
};

/**
 * Preferred writer. Returns the absolute path that was written.
 * Default overwrite policy is replace. Use overwrite: 'error' to throw FILE_EXISTS.
 */
const writeGeneratedFile = async (
  options: WriteGeneratedFileOptions
): Promise<string> => {
  const dir = options.dir && options.dir !== '' ? options.dir : 'generated';
  const fileName =
    options.fileName && options.fileName !== ''
      ? options.fileName
      : generateFileName(options.prefix || 'file', options.ext || 'html');

  const fullPath = pathResolve(dir, fileName);

  if (options.overwrite === 'error' && existsSync(fullPath)) {
    throw new MarkupGeneratorError(
      'FILE_EXISTS',
      `file already exists: ${fullPath}`
    );
  }

  await writeText(fileName, options.content, dir);
  return fullPath;
};

export {
  writeHTML,
  generateFileName,
  writeGeneratedFile,
};
export type { WriteGeneratedFileOptions };
