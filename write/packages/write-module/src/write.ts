import { randomUUID } from 'crypto';
import { existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import { resolve as pathResolve } from 'path';
import { isFolderExists } from './fileSystem';
import {
  CONST_FILE_NOT_WRITTEN,
  ERROR_NO_CONTENT,
  ERROR_TYPE_NOT_STRING,
} from './constants';
import type { WriteGeneratedFileOptions } from './types';

const generateFileName = (suffix: string, ext: string = 'html'): string => {
  if (ext === '') ext = 'html';
  return `${suffix}-${randomUUID()}.${ext}`;
};

const writeHTML = async (
  fileName: string,
  data: string,
  dir: string = 'generated',
  message: string = ''
): Promise<void> => {
  if (!data) {
    throw new Error(ERROR_NO_CONTENT);
  }

  if (typeof data !== 'string') {
    throw new Error(ERROR_TYPE_NOT_STRING);
  }

  if (dir === '') {
    dir = 'generated';
  }

  isFolderExists(pathResolve(dir));
  const fullPath = pathResolve(`${dir}/${fileName}`);

  try {
    await writeFile(fullPath, data, 'utf-8');
    if (message) {
      console.log(message);
    }
  } catch (error) {
    throw new Error(CONST_FILE_NOT_WRITTEN);
  }
};

const writingFile = async (content: string, name: string = 'prefix'): Promise<void> => {
  if (name === '') name = 'prefix';

  if (!content) {
    throw new Error('no content was passed into writingFile method');
  }

  await writeHTML(generateFileName(name), content);
};

/**
 * Preferred public writer for new consumers.
 * Returns the absolute path that was written.
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
    throw new Error(`file already exists: ${fullPath}`);
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
