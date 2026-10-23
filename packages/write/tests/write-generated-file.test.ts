import { afterEach, describe, expect, test } from 'vitest';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  writeGeneratedFile,
  writeHTML,
  MarkupGeneratorError,
  DEFAULT_MESSAGES,
} from '../src/index';

const outDir = resolve(process.cwd(), 'generated-write-pkg');

afterEach(() => {
  if (existsSync(outDir)) {
    rmSync(outDir, { recursive: true, force: true });
  }
});

describe('writeGeneratedFile', () => {
  test('writes content and returns an absolute path', async () => {
    const outputPath = await writeGeneratedFile({
      content: '<html>ok</html>',
      fileName: 'from-options.html',
      dir: outDir,
    });

    expect(outputPath).toBe(resolve(outDir, 'from-options.html'));
    expect(existsSync(outputPath)).toBe(true);
    expect(readFileSync(outputPath, 'utf-8')).toBe('<html>ok</html>');
  });

  test('throws when overwrite is error and the file exists', async () => {
    await writeGeneratedFile({
      content: 'first',
      fileName: 'exists.html',
      dir: outDir,
    });

    await expect(
      writeGeneratedFile({
        content: 'second',
        fileName: 'exists.html',
        dir: outDir,
        overwrite: 'error',
      })
    ).rejects.toThrow(/file already exists/);
  });
});

describe('writeHTML', () => {
  test('writes content to disk', async () => {
    const fileName = 'test-output.html';
    await writeHTML(fileName, '<html>ok</html>', outDir);
    const written = readFileSync(resolve(outDir, fileName), 'utf-8');
    expect(written).toBe('<html>ok</html>');
  });

  test('throws EMPTY_CONTENT when content is empty', async () => {
    await expect(writeHTML('empty.html', '', outDir)).rejects.toBeInstanceOf(
      MarkupGeneratorError
    );
    await expect(writeHTML('empty.html', '', outDir)).rejects.toMatchObject({
      code: 'EMPTY_CONTENT',
    });
  });

  test('throws NOT_A_STRING when content is not a string', async () => {
    await expect(
      writeHTML('bad.html', 123 as unknown as string, outDir)
    ).rejects.toThrow(DEFAULT_MESSAGES.NOT_A_STRING);
  });
});

describe('DEFAULT_MESSAGES', () => {
  test('every write-related code has a default message', () => {
    expect(new MarkupGeneratorError('EMPTY_CONTENT').message).toBe(
      DEFAULT_MESSAGES.EMPTY_CONTENT
    );
    expect(new MarkupGeneratorError('WRITE_FAILED').message).toBe(
      DEFAULT_MESSAGES.WRITE_FAILED
    );
    expect(new MarkupGeneratorError('FILE_EXISTS').message).toBe(
      DEFAULT_MESSAGES.FILE_EXISTS
    );
  });

  test('explicit message still wins', () => {
    expect(new MarkupGeneratorError('FILE_EXISTS', 'custom').message).toBe(
      'custom'
    );
  });
});
