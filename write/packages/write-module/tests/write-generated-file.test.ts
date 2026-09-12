import { existsSync, readFileSync, rmSync } from 'fs';
import { resolve } from 'path';
import { writeGeneratedFile } from '../src/index';

const generatedDir = resolve(process.cwd(), 'generated');

afterEach(() => {
  if (existsSync(generatedDir)) {
    rmSync(generatedDir, { recursive: true, force: true });
  }
});

describe('writeGeneratedFile', () => {
  test('writes content and returns an absolute path', async () => {
    const path = await writeGeneratedFile({
      content: '<html>ok</html>',
      fileName: 'from-options.html',
      dir: 'generated',
    });

    expect(path).toBe(resolve(generatedDir, 'from-options.html'));
    expect(readFileSync(path, 'utf-8')).toBe('<html>ok</html>');
  });

  test('throws when overwrite is error and the file exists', async () => {
    await writeGeneratedFile({
      content: 'first',
      fileName: 'exists.html',
    });

    await expect(
      writeGeneratedFile({
        content: 'second',
        fileName: 'exists.html',
        overwrite: 'error',
      })
    ).rejects.toThrow(/file already exists/);
  });
});
