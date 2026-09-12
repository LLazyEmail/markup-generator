import { existsSync, readFileSync, rmSync } from 'fs';
import { resolve } from 'path';
import {
  generateFileName,
  readSourceFile,
  writeHTML,
  writingFile,
} from '../src/index';
import { ERROR_NO_CONTENT, ERROR_TYPE_NOT_STRING } from '../src/constants';

const UUID_RE =
  '[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';

const root = resolve(__dirname, '');
const markdown = readSourceFile(`${root}/source.md`);
const generatedDir = resolve(process.cwd(), 'generated');

afterEach(() => {
  if (existsSync(generatedDir)) {
    rmSync(generatedDir, { recursive: true, force: true });
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
    await writeHTML(fileName, '<html>ok</html>');
    const written = readFileSync(resolve(generatedDir, fileName), 'utf-8');
    expect(written).toBe('<html>ok</html>');
  });

  test('throws when content is empty', async () => {
    await expect(writeHTML('empty.html', '')).rejects.toThrow(ERROR_NO_CONTENT);
  });

  test('throws when content is not a string', async () => {
    await expect(
      writeHTML('bad.html', 123 as unknown as string)
    ).rejects.toThrow(ERROR_TYPE_NOT_STRING);
  });
});

describe('writingFile', () => {
  test('writes markdown content with a generated name', async () => {
    await writingFile(markdown, 'this-is-my-name');
    expect(existsSync(generatedDir)).toBe(true);
  });
});
