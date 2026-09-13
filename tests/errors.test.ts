import { afterEach, describe, expect, test } from '@jest/globals';
import { existsSync, rmSync } from 'fs';
import { resolve } from 'path';
import {
  writeHTML,
  writeGeneratedFile,
  MarkupGeneratorError,
} from '../src/index';

const outDir = resolve(process.cwd(), 'generated-errors');

afterEach(() => {
  if (existsSync(outDir)) {
    rmSync(outDir, { recursive: true, force: true });
  }
});

describe('typed errors', () => {
  test('empty content uses EMPTY_CONTENT', async () => {
    await expect(writeHTML('x.html', '', outDir)).rejects.toBeInstanceOf(
      MarkupGeneratorError
    );
    await expect(writeHTML('x.html', '', outDir)).rejects.toMatchObject({
      code: 'EMPTY_CONTENT',
    });
  });

  test('overwrite error uses FILE_EXISTS', async () => {
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
    ).rejects.toBeInstanceOf(MarkupGeneratorError);

    await expect(
      writeGeneratedFile({
        content: 'second',
        fileName: 'exists.html',
        dir: outDir,
        overwrite: 'error',
      })
    ).rejects.toMatchObject({
      code: 'FILE_EXISTS',
    });
  });
});
