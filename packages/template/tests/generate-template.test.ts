import { afterEach, describe, expect, test } from 'vitest';
import { existsSync, readFileSync, rmSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { writeJson } from '@llazyemail/read';
import { buildFallbackContent, generateTemplate } from '../src/index';

const outDir = resolve(process.cwd(), 'generated-template-pkg');
const dataPath = resolve(outDir, 'data.json');

afterEach(() => {
  if (existsSync(outDir)) {
    rmSync(outDir, { recursive: true, force: true });
  }
});

describe('generate-template helpers', () => {
  test('buildFallbackContent uses title and preview', () => {
    const html = buildFallbackContent({
      title: 'Issue 12',
      preview: 'This week',
    });
    expect(html).toContain('Issue 12');
    expect(html).toContain('This week');
  });

  test('generateTemplate writes HTML using the provided render function', async () => {
    mkdirSync(outDir, { recursive: true });
    writeJson(dataPath, { title: 'HN', preview: 'News' });

    const outPath = await generateTemplate({
      cwd: process.cwd(),
      argv: [
        'node',
        'generate-template',
        '--template',
        'hn',
        '--data',
        dataPath,
        '--out',
        resolve(outDir, 'hn.html'),
      ],
      render: (templateId, input) =>
        `<html data-template="${templateId}">${input.string}</html>`,
    });

    expect(existsSync(outPath)).toBe(true);
    expect(readFileSync(outPath, 'utf-8')).toContain('data-template="hn"');
    expect(readFileSync(outPath, 'utf-8')).toContain('HN');
  });
});
