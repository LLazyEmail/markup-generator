import { readFileSync, existsSync, mkdirSync } from 'fs';
import matter from 'gray-matter';

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

/** Creates the directory if it does not exist. */
function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/** @deprecated Use ensureDir. */
const isFolderExists = ensureDir;

export {
  readSourceFile,
  readFrontMatter,
  ensureDir,
  isFolderExists,
};
