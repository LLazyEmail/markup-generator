import { readFileSync, existsSync, mkdirSync } from 'fs';
import matter from 'gray-matter';

/**
 * Reads a source file as UTF-8 string.
 */
function readSourceFile(fileName: string): string {
  return readFileSync(fileName, { encoding: 'utf-8' });
}

/**
 * Reads a markdown file and returns both front-matter and content.
 */
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

/**
 * Ensures the given directory exists (creates it if missing).
 */
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
