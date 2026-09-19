import { afterEach, describe, expect, test } from 'vitest';
import { existsSync, readFileSync, rmSync } from 'fs';
import { resolve } from 'path';
import { writeGeneratedEmail } from '../src/index';

const outDir = resolve(process.cwd(), 'generated-email');

afterEach(() => {
  if (existsSync(outDir)) {
    rmSync(outDir, { recursive: true, force: true });
  }
  process.exitCode = 0;
});

describe('writeGeneratedEmail', () => {
  test('writes a stable filename without a UUID', async () => {
    const outPath = await writeGeneratedEmail({
      content: '<html>hackernoon</html>',
      fileName: 'hackernoon-email.html',
      label: 'Hackernoon',
      dir: outDir,
    });

    expect(outPath).toBe(resolve(outDir, 'hackernoon-email.html'));
    expect(readFileSync(outPath as string, 'utf-8')).toBe(
      '<html>hackernoon</html>'
    );
  });

  test('sets exitCode on MarkupGeneratorError and does not throw', async () => {
    const result = await writeGeneratedEmail({
      content: '',
      fileName: 'empty.html',
      label: 'Empty',
      dir: outDir,
    });

    expect(result).toBeUndefined();
    expect(process.exitCode).toBe(1);
  });
});
