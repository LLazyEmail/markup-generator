import { afterEach, describe, expect, test } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { MarkupGeneratorError, writeGeneratedFile } from '../src/index';

let dir: string | undefined;
afterEach(() => {
  if (dir) rmSync(dir, { recursive: true, force: true });
  dir = undefined;
});

describe('writeGeneratedFile edge cases', () => {
  test('rejects empty content with EMPTY_CONTENT', async () => {
    dir = mkdtempSync(join(tmpdir(), 'mg-edge-'));
    const err = await writeGeneratedFile({
      content: '',
      fileName: 'empty.html',
      dir,
    }).catch((e: unknown) => e);

    expect(err).toBeInstanceOf(MarkupGeneratorError);
    expect((err as MarkupGeneratorError).code).toBe('EMPTY_CONTENT');
  });

  test('rejects non-string content with NOT_A_STRING', async () => {
    dir = mkdtempSync(join(tmpdir(), 'mg-edge-'));
    const err = await writeGeneratedFile({
      content: 123 as unknown as string,
      fileName: 'bad.html',
      dir,
    }).catch((e: unknown) => e);

    expect(err).toBeInstanceOf(MarkupGeneratorError);
    expect((err as MarkupGeneratorError).code).toBe('NOT_A_STRING');
  });

  test('handles filenames with spaces and special characters', async () => {
    dir = mkdtempSync(join(tmpdir(), 'mg-edge-'));
    const fileName = 'hello world & friends.html';
    const out = await writeGeneratedFile({
      content: '<p>ok</p>',
      fileName,
      dir,
    });
    expect(out).toContain(fileName);
  });
});
