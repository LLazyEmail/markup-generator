import write from 'write';
import {
  generateTemplateName,
  
  catchErrorTraceOutput,
} from './utils';
import { ERROR_NO_CONTENT, ERROR_TYPE_NOT_STRING, CONST_FILE_NOT_WRITTEN } from './utils';

// can be renamed into a generateFileName
// https://befused.com/javascript/get-filename-url/
const generateTemplateName = (suffix, ext = 'html') =>
  `${suffix}-${Date.now()}.${ext}`;

//--------

const writeHTML = (fileName, content, dir = 'generated', message) => {
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

const writingFile = (content, name = 'prefix') => {
  if (!content) {
    throw new Error('no content was passed into writingFile method');
  }

  const fileName = generateTemplateName(name);

  try {
    writeHTML(fileName, content);
  } catch (error) {
    catchErrorTraceOutput(error);
  }
};






export {
  writingFile, 
  writeHTML,
  generateTemplateName
}
