import { readFileSync, existsSync, mkdirSync } from 'fs';
import matter from 'gray-matter';

function readSourceFile(fileName:string) {
    return readFileSync(fileName, { encoding: 'utf-8' });
}

function readFrontMatter(filename:string){

  const fileContents = readFileSync(filename, { encoding: 'utf-8' });

  const { data, content } = matter(fileContents);

  return {
    frontMatter: data,
    markdown: content,
  }

}

// https://www.npmjs.com/package/directory-exists
// https://www.npmjs.com/package/path-exists this is better

function isFolderExists(dir:string) {
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
}


export {
    readSourceFile, isFolderExists, readFrontMatter
}