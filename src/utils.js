import { readFileSync, existsSync, mkdirSync } from 'fs';
import write from 'write';

// ---
const CONST_FILE_CREATED = '';
const CONST_FILE_NOT_WRITTEN = 'file not written';

const ERROR_NO_TITLE = '`title` is a required option for `renderTemplate`';
const ERROR_NO_BODY_CONTENT =
  '`bodyContent` is a required option for `renderTemplate`';
const ERROR_NO_PREVIEW_TEXT =
  '`previewText` is a required option for `renderTemplate`';

const ERROR_NO_CONTENT = 'content variable is empty';

const ERROR_TYPE_NOT_STRING = 'content variable is not a string';

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




function writeHTML(fileName, content, dir = 'generated', message) {
  const _path = `${dir}/${fileName}`; // @todo it's not an ideal thing

  if (!content) {
    throw new Error(ERROR_NO_CONTENT);
  }

  if (typeof content !== 'string') {
    throw new Error(ERROR_TYPE_NOT_STRING);
  }

  // promise
  write(_path, content)
    .then(() => {
      // i dont like this line @TODO change it
      message && console.log(`file has been written successfully ${fileName}`);
    })
    .catch((error) => {
      catchErrorTraceOutput(error);
      throw new Error(CONST_FILE_NOT_WRITTEN);
    });
}




function readSourceFile(fileName) {
  return readFileSync(fileName, { encoding: 'utf-8' });
}

// https://www.npmjs.com/package/directory-exists
// https://www.npmjs.com/package/path-exists this is better

function isFolderExists(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
}

// can be renamed into a generateFileName
// https://befused.com/javascript/get-filename-url/
const generateTemplateName = (suffix, ext = 'html') =>
  `${suffix}-${Date.now()}.${ext}`;

//--------

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
  writeHTML,
  catchErrorTraceOutput,
  readFileSync,
  readSourceFile,
  isFolderExists,
  generateTemplateName,
  checkWarnings,
  checkErrors,
  displayCLIErrors,
  FULL_SOURCE,
  ERROR_NO_TITLE,
  ERROR_NO_BODY_CONTENT,
  ERROR_NO_PREVIEW_TEXT,
};
