import { afterEach, describe, expect, test } from 'vitest';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { MarkupGeneratorError } from '@llazyemail/write';
import { loadContent, loadData, readJson, readSourceFile } from '../src/index';

const outDir = resolve(process.cwd(), 'generated-read-errors-pkg');

afterEach(() => {
  if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
});

function codeAndCause(fn: () => unknown): { code?: string; cause?: unknown } {
  try {
    fn();
  } catch (e) {
    expect(e).toBeInstanceOf(MarkupGeneratorError);
    return { code: (e as MarkupGeneratorError).code, cause: (e as MarkupGeneratorError).cause };
  }
  throw new Error('expected a throw');
}

describe('read error codes', () => {
  test('loadData: missing module -> EIMPORT with cause', async () => {
    const err = await loadData(resolve(outDir, 'missing.mjs')).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(MarkupGeneratorError);
    expect((err as MarkupGeneratorError).code).toBe('EIMPORT');
    expect((err as MarkupGeneratorError).cause).toBeInstanceOf(Error);
  });

  test('loadData: module that throws -> EIMPORT with original error as cause', async () => {
    mkdirSync(outDir, { recursive: true });
    const p = resolve(outDir, 'boom.mjs');
    writeFileSync(p, "throw new Error('boom');\n");
    const err = await loadData(p).catch((e: unknown) => e);
    expect((err as MarkupGeneratorError).code).toBe('EIMPORT');
    expect(((err as MarkupGeneratorError).cause as Error).message).toBe('boom');
  });

  test('loadData: missing JSON keeps JSON_READ, now with cause', async () => {
    const err = await loadData(resolve(outDir, 'missing.json')).catch((e: unknown) => e);
    expect((err as MarkupGeneratorError).code).toBe('JSON_READ');
    expect((err as MarkupGeneratorError).cause).toBeInstanceOf(Error);
  });

  test('readJson: invalid JSON -> JSON_PARSE with SyntaxError cause', () => {
    mkdirSync(outDir, { recursive: true });
    const p = resolve(outDir, 'bad.json');
    writeFileSync(p, '{nope');
    const { code, cause } = codeAndCause(() => readJson(p));
    expect(code).toBe('JSON_PARSE');
    expect(cause).toBeInstanceOf(SyntaxError);
  });

  test('loadContent: missing file -> EREAD with cause', () => {
    const { code, cause } = codeAndCause(() => loadContent('nope.html', outDir));
    expect(code).toBe('EREAD');
    expect((cause as NodeJS.ErrnoException).code).toBe('ENOENT');
  });

  test('readSourceFile: missing file -> EREAD with cause', () => {
    const { code, cause } = codeAndCause(() => readSourceFile(resolve(outDir, 'nope.md')));
    expect(code).toBe('EREAD');
    expect((cause as NodeJS.ErrnoException).code).toBe('ENOENT');
  });
});
