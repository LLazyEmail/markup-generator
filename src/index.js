import {
  writeHTML,
  readFileSync,
  readSourceFile,
  isFolderExists,
  generateTemplateName,
  catchErrorTraceOutput,
} from './utils';

import {
  displayCLIErrors,
  checkErrors,
  checkWarnings,
  checkHtml,
  printMessage,
  stateInit,
} from './command-line-methods';

import writingFile from './write';

export {
  writeHTML,
  readFileSync,
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
