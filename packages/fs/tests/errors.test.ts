import { afterEach, describe, expect, test } from 'vitest';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { listTemplateFiles, MarkupGeneratorError } from '../src/index';

const dir = resolve(process.cwd(), 'generated-fs-errors-pkg');

afterEach(() => {
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
});

describe('listTemplateFiles errors', () => {
  test('readdir failure throws EREAD with cause', () => {
    mkdirSync(dir, { recursive: true });
    const notADir = resolve(dir, 'file.ts');
    writeFileSync(notADir, '');
    let err: unknown;
    try {
      listTemplateFiles(notADir);
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(MarkupGeneratorError);
    expect((err as MarkupGeneratorError).code).toBe('EREAD');
    expect(((err as MarkupGeneratorError).cause as NodeJS.ErrnoException).code).toBe('ENOTDIR');
  });
});
