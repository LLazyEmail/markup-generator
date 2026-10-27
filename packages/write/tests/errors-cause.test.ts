import { afterEach, describe, expect, test } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { MarkupGeneratorError as FsError } from '@llazyemail/fs';
import { MarkupGeneratorError, writeGeneratedFile } from '../src/index';

let dir: string | undefined;
afterEach(() => {
  if (dir) rmSync(dir, { recursive: true, force: true });
  dir = undefined;
});

describe('MarkupGeneratorError', () => {
  test('is the same class as the one exported by @llazyemail/fs', () => {
    expect(MarkupGeneratorError).toBe(FsError);
  });

  test('stores cause when given and omits it otherwise', () => {
    const cause = new Error('root');
    expect(new MarkupGeneratorError('EREAD', 'x', { cause }).cause).toBe(cause);
    expect('cause' in new MarkupGeneratorError('EREAD')).toBe(false);
  });
});

describe('WRITE_FAILED', () => {
  test('preserves the underlying fs error as cause', async () => {
    dir = mkdtempSync(join(tmpdir(), 'mg-write-'));
    // A regular file where a directory is expected makes the write fail.
    writeFileSync(join(dir, 'blocker'), 'x');
    const err = await writeGeneratedFile({
      content: '<p>x</p>',
      dir,
      fileName: 'blocker/inner.html',
    }).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(MarkupGeneratorError);
    expect((err as MarkupGeneratorError).code).toBe('WRITE_FAILED');
    expect((err as MarkupGeneratorError).cause).toBeInstanceOf(Error);
    expect(((err as MarkupGeneratorError).cause as NodeJS.ErrnoException).code).toBeTruthy();
  });
});
