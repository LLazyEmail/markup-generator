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

export type { WriteGeneratedFileOptions } from './types';
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
};
