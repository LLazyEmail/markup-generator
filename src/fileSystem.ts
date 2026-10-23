import { readFileSync } from 'fs';
import matter from 'gray-matter';

export { ensureDir, isFolderExists } from '@llazyemail/fs';

function readSourceFile(fileName: string): string {
  return readFileSync(fileName, { encoding: 'utf-8' });
}

function readFrontMatter(filename: string): {
  frontMatter: Record<string, unknown>;
  markdown: string;
} {
  const fileContents = readFileSync(filename, { encoding: 'utf-8' });
  const { data, content } = matter(fileContents);

  return {
    frontMatter: data,
    markdown: content,
  };
}

export {
  readSourceFile,
  readFrontMatter,
};
