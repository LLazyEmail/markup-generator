import {
  readSourceFile,
  isFolderExists,
  ensureDir,
  readFrontMatter,
} from './fileSystem';

import {
  writeHTML,
  writingFile,
  generateFileName,
  writeGeneratedFile,
} from './write';

import { writeGeneratedEmail } from './writeGeneratedEmail';

export type { WriteGeneratedFileOptions } from './types';
export type { WriteGeneratedEmailOptions } from './writeGeneratedEmail';

export { readContentFile, loadDataModule, resolveFromCwd } from './read';
export { MarkupGeneratorError } from './errors';
export type { MarkupGeneratorErrorCode } from './errors';

export {
  readSourceFile,
  readFrontMatter,
  ensureDir,
  isFolderExists,
  writeHTML,
  writingFile,
  generateFileName,
  writeGeneratedFile,
  writeGeneratedEmail,
};
