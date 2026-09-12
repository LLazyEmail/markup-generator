import { randomUUID } from 'crypto';
import { existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import { resolve as pathResolve } from 'path';
import { ensureDir } from './fileSystem';
import { MarkupGeneratorError } from './errors';
import type { WriteGeneratedFileOptions } from './types';

/**
 * Unique filename: `{suffix}-{uuid}.{ext}`.
 * Safe to call in parallel. Does not touch the filesystem.
 */
const generateFileName = (suffix: string, ext: string = 'html'): string => {
  if (ext === '') ext = 'html';
  return `${suffix}-${randomUUID()}.${ext}`;
};

/**
 * Writes UTF-8 text to `{cwd}/{dir}/{fileName}`.
 *
 * Contract:
 * - `dir` is resolved from `process.cwd()`
 * - missing directories are created
 * - existing files are overwritten unless a caller uses writeGeneratedFile({ overwrite: 'error' })
 * - empty content throws EMPTY_CONTENT
 * - non-string content throws NOT_A_STRING
 */
const writeHTML = async (
  fileName: string,
  data: string,
  dir: string = 'generated',
  message: string = ''
): Promise<void> => {
  if (!data) {
    throw new MarkupGeneratorError('EMPTY_CONTENT', 'content variable is empty');
  }

  if (typeof data !== 'string') {
    throw new MarkupGeneratorError(
      'NOT_A_STRING',
      'content variable is not a string'
    );
  }

  if (dir === '') {
    dir = 'generated';
  }

  ensureDir(pathResolve(dir));
  const fullPath = pathResolve(`${dir}/${fileName}`);

  try {
    await writeFile(fullPath, data, 'utf-8');
    if (message) {
      console.log(message);
    }
  } catch {
    throw new MarkupGeneratorError('WRITE_FAILED', 'file not written');
  }
};

const writingFile = async (content: string, name: string = 'prefix'): Promise<void> => {
  if (name === '') name = 'prefix';

  if (!content) {
    throw new MarkupGeneratorError(
      'EMPTY_CONTENT',
      'no content was passed into writingFile method'
    );
  }

  await writeHTML(generateFileName(name), content);
};

/**
 * Preferred writer. Returns the absolute path that was written.
 * Default overwrite policy is replace. Use overwrite: 'error' to refuse.
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

  await writeHTML(fileName, options.content, dir);
  return fullPath;
};

export {
  writingFile,
  writeHTML,
  generateFileName,
  writeGeneratedFile,
};
export type { WriteGeneratedFileOptions };
