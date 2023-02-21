// import { readFileSync, existsSync, mkdirSync } from 'fs';
import { printMessage } from './command-line-methods';

// ---
const CONST_FILE_CREATED = '';

// @TODO enable it later
// const CONST_FILE_NOT_WRITTEN = 'file not written';

const ERROR_NO_TITLE = '`title` is a required option for `renderTemplate`';
const ERROR_NO_BODY_CONTENT =
  '`bodyContent` is a required option for `renderTemplate`';
const ERROR_NO_PREVIEW_TEXT =
  '`previewText` is a required option for `renderTemplate`';

// @TODO enable it later
// const ERROR_NO_CONTENT = 'content variable is empty';

// @TODO enable it later
// const ERROR_TYPE_NOT_STRING = 'content variable is not a string';

// const WARNING_EMAIL_LENGTH = `Email output is ${Math.round(bytes / 1024)}KB. ` +
// 'It is recommended to keep the delivered HTML to smaller ' +
// 'than 100KB, to avoid getting emails cut off or rejected due to spam.';

// ---

const catchErrorTraceOutput = (error) => {
  // we need to test how it actually work
  const callerLine = error.stack.split('\n')[4];
  const index = callerLine.indexOf('at ');
  // eslint-disable-next-line no-unused-vars
  const clean = callerLine.slice(index + 2, callerLine.length);

  throw error;
};



function checkWarnings(warnings) {
  forEach(warnings, (index, element) => {
    if (index) {
      const message = `WARNING source.md has ${index} ${element}. Replace it with memes`;

      printMessage(message, 'yellow');
    }
  });
}

function checkErrors(errors) {
  if (Object.values(errors).includes(false)) {
    // TODO replace with lodash
    forEach(errors, (_, error) => {
      if (!errors[error]) {
        const message = `ERROR source.md doesn't have ${error}`;

        printMessage(message, 'red');
      }
    });

    const message = 'The full template has not been parsed!';
    printMessage(message, 'red2');

    return true;
  }
  return false;
}

function displayCLIErrors(errors, warnings) {
  if (checkErrors(errors)) {
    // there should be something in here
  } else {
    checkWarnings(warnings);
  }
}

const FULL_SOURCE = 'tests/methods/source.md';

//-----------

export {
  // writeHTML,
  catchErrorTraceOutput,
  // readFileSync,
  // readSourceFile,
  // isFolderExists,
  // generateTemplateName,
  checkWarnings,
  checkErrors,
  displayCLIErrors,
  FULL_SOURCE,
  ERROR_NO_TITLE,
  ERROR_NO_BODY_CONTENT,
  ERROR_NO_PREVIEW_TEXT,
};
