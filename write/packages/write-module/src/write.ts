import { randomUUID } from 'crypto';
import { writeFile } from 'fs/promises';
import { resolve as pathResolve } from 'path';
import { isFolderExists } from './fileSystem';

import {
  CONST_FILE_NOT_WRITTEN,
  ERROR_NO_CONTENT,
  ERROR_TYPE_NOT_STRING,
} from './constants';

/**
 * Generates a unique filename based on a suffix and optional extension.
 * Uses crypto.randomUUID() so parallel calls do not collide.
 */
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

  const directoryPath = pathResolve(dir);
  isFolderExists(directoryPath);

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

  const fileName = generateFileName(name);

  await writeHTML(fileName, content);
};

const writeFileParticle = async (string: string, suffix: string): Promise<boolean> => {
  await writingFile(string, suffix);
  return true;
};

export {
  writingFile,
  writeHTML,
  writeFileParticle,
  generateFileName,
};
