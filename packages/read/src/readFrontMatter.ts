import { readFileSync } from 'node:fs';
import matter from 'gray-matter';

/** Parse YAML front matter and body from a markdown (or text) file. */
export function readFrontMatter(filename: string): {
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
