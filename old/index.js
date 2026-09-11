import {
  
  
  catchErrorTraceOutput,
} from './utils';


import {
  // readFileSync,
  readSourceFile,
  isFolderExists,
} from './fileSystem'

import {
  displayCLIErrors,
  checkErrors,
  checkWarnings,
  checkHtml,
  printMessage,
  stateInit,
} from './command-line-methods';

import { writeHTML, writingFile, generateFileName } from './write';

export {
  writeHTML,
  // readFileSync,
  readSourceFile,
  isFolderExists,
  generateFileName,
  displayCLIErrors,
  checkErrors,
  checkWarnings,
  checkHtml,
  printMessage,
  stateInit,
  //-----
  writingFile,
  catchErrorTraceOutput,
};
