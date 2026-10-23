import { describe, expect, test } from 'vitest';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFrontMatter, readSourceFile } from '../src/index';

const root = dirname(fileURLToPath(import.meta.url));
const fixture = resolve(root, 'source.md');

describe('readSourceFile', () => {
  test('reads UTF-8 contents', () => {
    const text = readSourceFile(fixture);
    expect(text).toContain('title: test');
    expect(text).toContain('# Hello');
  });
});

describe('readFrontMatter', () => {
  test('parses YAML front matter and markdown body', () => {
    const { frontMatter, markdown } = readFrontMatter(fixture);
    expect(frontMatter).toMatchObject({ title: 'test' });
    expect(markdown.trim()).toContain('# Hello');
  });
});
