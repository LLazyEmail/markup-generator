import {
  writeHTML,
  readSourceFile,
  isFolderExists,
  generateTemplateName,
} from './utils';

import {
  displayCLIErrors,
  checkErrors,
  checkWarnings,
  checkHtml,
  printMessage,
  stateInit,
} from './command-line-methods';

import { writingFile } from './write';

export {
  writeHTML,
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
};
