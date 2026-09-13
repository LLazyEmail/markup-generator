import { afterEach, describe, expect, test } from '@jest/globals';
import { existsSync, readFileSync, rmSync } from 'fs';
import { resolve } from 'path';
import {
  generateFileName,
  readSourceFile,
  writeHTML,
  writingFile,
} from '../src/index';
import { ERROR_NO_CONTENT, ERROR_TYPE_NOT_STRING } from '../src/constants';

const UUID_RE = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

const root = resolve(__dirname);
const markdown = readSourceFile(resolve(root, 'source.md'));
const outDir = resolve(process.cwd(), 'generated-index');

afterEach(() => {
  if (existsSync(outDir)) {
    rmSync(outDir, { recursive: true, force: true });
  }
});

describe('generateFileName', () => {
  test('creates a unique html filename by default', () => {
    const name = generateFileName('newsletter');
    expect(name).toMatch(new RegExp(`^newsletter-${UUID_RE}\\.html$`));
  });

  test('uses a custom extension', () => {
    const name = generateFileName('newsletter', 'md');
    expect(name).toMatch(new RegExp(`^newsletter-${UUID_RE}\\.md$`));
  });

  test('does not collide when called twice', () => {
    const first = generateFileName('newsletter');
    const second = generateFileName('newsletter');
    expect(first).not.toBe(second);
  });
});

describe('writeHTML', () => {
  test('writes content to disk', async () => {
    const fileName = 'test-output.html';
    await writeHTML(fileName, '<html>ok</html>', outDir);
    const written = readFileSync(resolve(outDir, fileName), 'utf-8');
    expect(written).toBe('<html>ok</html>');
  });

  test('throws when content is empty', async () => {
    await expect(writeHTML('empty.html', '', outDir)).rejects.toThrow(
      ERROR_NO_CONTENT
    );
  });

  test('throws when content is not a string', async () => {
    await expect(
      writeHTML('bad.html', 123 as unknown as string, outDir)
    ).rejects.toThrow(ERROR_TYPE_NOT_STRING);
  });
});

describe('writingFile', () => {
  test('writes markdown content with a generated name', async () => {
    await writingFile(markdown, 'this-is-my-name');
    expect(
      existsSync(resolve(process.cwd(), 'generated')) || existsSync(outDir)
    ).toBe(true);
  });
});
