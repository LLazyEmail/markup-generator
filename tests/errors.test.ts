import { writeHTML, writeGeneratedFile, MarkupGeneratorError } from '../src/index';
import { existsSync, rmSync } from 'fs';
import { resolve } from 'path';

const generatedDir = resolve(process.cwd(), 'generated');

afterEach(() => {
  if (existsSync(generatedDir)) {
    rmSync(generatedDir, { recursive: true, force: true });
  }
});

describe('typed errors', () => {
  test('empty content uses EMPTY_CONTENT', async () => {
    await expect(writeHTML('x.html', '')).rejects.toMatchObject({
      name: 'MarkupGeneratorError',
      code: 'EMPTY_CONTENT',
    });
  });

  test('overwrite error uses FILE_EXISTS', async () => {
    await writeGeneratedFile({ content: 'first', fileName: 'exists.html' });
    try {
      await writeGeneratedFile({
        content: 'second',
        fileName: 'exists.html',
        overwrite: 'error',
      });
      throw new Error('expected failure');
    } catch (error) {
      expect(error).toBeInstanceOf(MarkupGeneratorError);
      expect((error as MarkupGeneratorError).code).toBe('FILE_EXISTS');
    }
  });
});
