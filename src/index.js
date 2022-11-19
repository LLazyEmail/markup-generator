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

import { writeHTML, writingFile, generateTemplateName } from './write';

export {
  writeHTML,
  // readFileSync,
  readSourceFile,
  isFolderExists,
  generateTemplateName,
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
