import { afterEach, describe, expect, test } from 'vitest';
import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  readJson,
  writeJson,
} from '../src/index';
import { MarkupGeneratorError } from '@llazyemail/write';

const outDir = resolve(process.cwd(), 'generated-json-read-pkg');
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

  test('writeJson wraps failures as JSON_WRITE with cause', () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    try {
      writeJson(filePath, circular);
      throw new Error('expected throw');
    } catch (error) {
      expect(error).toBeInstanceOf(MarkupGeneratorError);
      expect((error as MarkupGeneratorError).code).toBe('JSON_WRITE');
      expect((error as MarkupGeneratorError).cause).toBeInstanceOf(TypeError);
    }
  });

});
