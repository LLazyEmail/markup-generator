import { afterEach, describe, expect, test } from 'vitest';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadContent, loadData, writeJson } from '../src/index';

const outDir = resolve(process.cwd(), 'generated-load-read-pkg');

afterEach(() => {
  if (existsSync(outDir)) {
    rmSync(outDir, { recursive: true, force: true });
  }
});

describe('loadData', () => {
  test('loads JSON template data', async () => {
    mkdirSync(outDir, { recursive: true });
    const dataPath = resolve(outDir, 'data.json');
    writeJson(dataPath, { title: 'Issue', preview: 'Hi' });
    await expect(loadData(dataPath)).resolves.toEqual({
      title: 'Issue',
      preview: 'Hi',
    });
  });
});

describe('loadContent', () => {
  test('returns null when path is omitted', () => {
    expect(loadContent(undefined, outDir)).toBeNull();
  });

  test('reads a content file relative to cwd', () => {
    mkdirSync(outDir, { recursive: true });
    writeFileSync(resolve(outDir, 'body.html'), '<p>hi</p>', 'utf8');
    expect(loadContent('body.html', outDir)).toBe('<p>hi</p>');
  });
});
