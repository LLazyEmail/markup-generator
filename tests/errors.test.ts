import { afterEach, describe, expect, test } from '@jest/globals';
import { existsSync, rmSync } from 'fs';
import { resolve } from 'path';
import {
  writeHTML,
  writeGeneratedFile,
  MarkupGeneratorError,
} from '../src/index';

const generatedDir = resolve(process.cwd(), 'generated');

afterEach(() => {
  if (existsSync(generatedDir)) {
    rmSync(generatedDir, { recursive: true, force: true });
  }
});

describe('typed errors', () => {
  test('empty content uses EMPTY_CONTENT', async () => {
    await expect(writeHTML('x.html', '')).rejects.toBeInstanceOf(
      MarkupGeneratorError
    );
    await expect(writeHTML('x.html', '')).rejects.toMatchObject({
      code: 'EMPTY_CONTENT',
    });
  });

  test('overwrite error uses FILE_EXISTS', async () => {
    await writeGeneratedFile({ content: 'first', fileName: 'exists.html' });

    await expect(
      writeGeneratedFile({
        content: 'second',
        fileName: 'exists.html',
        overwrite: 'error',
      })
    ).rejects.toBeInstanceOf(MarkupGeneratorError);

    await expect(
      writeGeneratedFile({
        content: 'second',
        fileName: 'exists.html',
        overwrite: 'error',
      })
    ).rejects.toMatchObject({
      code: 'FILE_EXISTS',
    });
  });
});
