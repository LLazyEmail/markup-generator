import { afterEach, describe, expect, test } from 'vitest';
import { existsSync, rmSync } from 'fs';
import { resolve } from 'path';
import { readJson, writeJson, MarkupGeneratorError } from '../src/index';

const outDir = resolve(process.cwd(), 'generated-json');
const filePath = resolve(outDir, 'sample.json');

afterEach(() => {
  if (existsSync(outDir)) {
    rmSync(outDir, { recursive: true, force: true });
  }
});

describe('json-io', () => {
  test('writes and reads pretty JSON', () => {
    writeJson(filePath, { title: 'Weekly', preview: 'Hello' });
    expect(readJson<{ title: string }>(filePath)).toEqual({
      title: 'Weekly',
      preview: 'Hello',
    });
  });

  test('throws JSON_READ when the file is missing', () => {
    expect(() => readJson(resolve(outDir, 'missing.json'))).toThrow(
      MarkupGeneratorError
    );
    try {
      readJson(resolve(outDir, 'missing.json'));
    } catch (error) {
      expect((error as MarkupGeneratorError).code).toBe('JSON_READ');
    }
  });
});
