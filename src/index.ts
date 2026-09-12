import {
  readSourceFile,
  isFolderExists,
  readFrontMatter,
} from './fileSystem';

import {
  writeHTML,
  writingFile,
  generateFileName,
  writeGeneratedFile,
} from './write';

export type { WriteGeneratedFileOptions } from './types';

export {
  readSourceFile,
  readFrontMatter,
  isFolderExists,
  writeHTML,
  writingFile,
  generateFileName,
  writeGeneratedFile,
};
