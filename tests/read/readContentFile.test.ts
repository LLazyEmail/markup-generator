import { mkdtempSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { readContentFile } from '../../src/read';
import { MarkupGeneratorError } from '../../src/errors';

describe('readContentFile', () => {
  let dir: string;
  let originalCwd: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'markup-generator-read-'));
    originalCwd = process.cwd();
    process.chdir(dir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    rmSync(dir, { recursive: true, force: true });
  });

  it('reads an existing file as UTF-8, resolved from cwd', () => {
    writeFileSync(join(dir, 'content.html'), '<p>hello</p>', 'utf8');

    expect(readContentFile('content.html')).toBe('<p>hello</p>');
  });

  it('accepts an already-absolute path', () => {
    const absolutePath = join(dir, 'content.html');
    writeFileSync(absolutePath, '<p>abs</p>', 'utf8');

    expect(readContentFile(absolutePath)).toBe('<p>abs</p>');
  });

  it('throws MarkupGeneratorError with code ENOENT for a missing file', () => {
    expect(() => readContentFile('missing.html')).toThrow(MarkupGeneratorError);
    try {
      readContentFile('missing.html');
    } catch (error) {
      expect((error as MarkupGeneratorError).code).toBe('ENOENT');
    }
  });

  it('throws MarkupGeneratorError with code EINVAL for an empty path', () => {
    expect(() => readContentFile('')).toThrow(MarkupGeneratorError);
    try {
      readContentFile('   ');
    } catch (error) {
      expect((error as MarkupGeneratorError).code).toBe('EINVAL');
    }
  });
});
