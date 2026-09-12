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

function isFolderExists(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export {
  readSourceFile,
  isFolderExists,
  readFrontMatter,
};
