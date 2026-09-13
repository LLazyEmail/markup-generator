import { afterEach, describe, expect, test } from '@jest/globals';
import { existsSync, readFileSync, rmSync } from 'fs';
import { resolve } from 'path';
import { writeGeneratedFile } from '../src/index';

const outDir = resolve(process.cwd(), 'generated-write-options');

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
