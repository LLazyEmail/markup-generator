import { readFileSync, existsSync, mkdirSync } from 'fs';

function readSourceFile(fileName:string) {
    return readFileSync(fileName, { encoding: 'utf-8' });
}


  // https://www.npmjs.com/package/directory-exists
// https://www.npmjs.com/package/path-exists this is better

function isFolderExists(dir:string) {
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }
}
  

export {
    readSourceFile, isFolderExists
}