import { writeFile } from 'fs/promises';
import { resolve as pathResolve } from 'path';
import { isFolderExists } from './fileSystem';
// import catchErrorTraceOutput from './utils';


import { 
  CONST_FILE_NOT_WRITTEN, ERROR_NO_CONTENT, ERROR_TYPE_NOT_STRING 
} from './constants';

// can be renamed into a generateFileName
// https://befused.com/javascript/get-filename-url/
const generateTemplateName = (suffix:string, ext:string) => {
  if (ext === '') ext = 'html';
  return `${suffix}-${Date.now()}.${ext}`;
}
  

//--------

const writeHTML = (fileName:string, data:string, dir:string, message:string) => {

  if (!data) {
    throw new Error(ERROR_NO_CONTENT);
  }

  if (typeof data !== 'string') {
    throw new Error(ERROR_TYPE_NOT_STRING);
  }

  if (dir === ''){ dir = 'generated'; }

  const directory_path = pathResolve(dir);
  isFolderExists(directory_path);

  // TODO it's not an ideal thing
  const path = pathResolve(`${dir}/${fileName}`); 


  // console.log(pathResolve(dir));

  // isFolderExists(pathResolve(dir));
  // console.log(path);


  const result = writeFile(path, data);

  // console.log(result);

  // promise
  // writeFile(path, data)
  //   .then(results => {
  //     if(message) console.log(message);
  //     console.log(results);
  //     console.log(`file has been written successfully ${fileName}`);
  //   })
  //   .catch((error:any) => {
  //     // catchErrorTraceOutput(error);
  //     throw new Error(CONST_FILE_NOT_WRITTEN);
  //   });

}

const writingFile = (content:string, name:string) => {

  if (name === '') name = 'prefix';

  if (!content) {
    throw new Error('no content was passed into writingFile method');
  }

  const fileName = generateTemplateName(name, '');

  try {
    writeHTML(fileName, content, '', '');
  } catch (error) {
    // catchErrorTraceOutput(error);
    throw error;
  }
};


const writeFileParticle = (string:string, suffix:string) => {

  writingFile(string, suffix);
  // TODO add a function that will display an output in console.  
  return true;
}



export {
  writingFile, 
  writeHTML,
  writeFileParticle,
  generateTemplateName
}
