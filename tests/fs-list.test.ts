import { afterEach, describe, expect, test } from 'vitest';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs';
import { resolve } from 'path';
import { listTemplateFiles, pathExists } from '../src/index';

const dir = resolve(process.cwd(), 'generated-fs-list');

afterEach(() => {
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
});

describe('fs-list', () => {
  test('pathExists is false for a missing path', () => {
    expect(pathExists(resolve(dir, 'nope.ts'))).toBe(false);
  });

  test('listTemplateFiles returns [] when the directory is missing', () => {
    expect(listTemplateFiles(dir)).toEqual([]);
  });

  test('listTemplateFiles skips index and LATER files', () => {
    mkdirSync(dir, { recursive: true });
    writeFileSync(resolve(dir, 'hello.ts'), 'export {}');
    writeFileSync(resolve(dir, 'index.js'), '');
    writeFileSync(resolve(dir, 'LATER.foo.ts'), '');
    writeFileSync(resolve(dir, 'readme.md'), '');
    expect(listTemplateFiles(dir)).toEqual(['hello.ts']);
  });
});
