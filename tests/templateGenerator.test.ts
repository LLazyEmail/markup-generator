import { afterEach, describe, expect, test } from 'vitest';
import { existsSync, readFileSync, rmSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { TemplateGenerator, createGenerator } from '../src/index';

const testDir = resolve(process.cwd(), 'test-template-generator');
const templatesDir = resolve(testDir, 'templates');
const dataDir = resolve(testDir, 'data');

afterEach(() => {
  if (existsSync(testDir)) {
    rmSync(testDir, { recursive: true, force: true });
  }
});

describe('TemplateGenerator', () => {
  test('constructor uses default values when config is not provided', () => {
    const generator = new TemplateGenerator();
    expect(generator.outDir).toBe('generated');
    expect(generator.skipFiles).toContain('index.js');
    expect(generator.skipFiles).toContain('registry.ts');
  });

  test('constructor uses provided config values', () => {
    const generator = new TemplateGenerator({
      outDir: 'custom-output',
      templatesDir: 'custom-templates',
      dataDir: 'custom-data',
    });
    expect(generator.outDir).toBe('custom-output');
    expect(generator.templatesDir).toContain('custom-templates');
    expect(generator.dataDir).toContain('custom-data');
  });

  test('listTemplateFiles returns empty array when templates directory does not exist', () => {
    const generator = new TemplateGenerator({ templatesDir: 'non-existent-dir' });
    const files = generator.listTemplateFiles();
    expect(files).toEqual([]);
  });

  test('listTemplateFiles filters out skipped files and LATER files', () => {
    mkdirSync(templatesDir, { recursive: true });
    writeFileSync(resolve(templatesDir, 'index.js'), 'console.log("index")');
    writeFileSync(resolve(templatesDir, 'template.ts'), 'export const template = {}');
    writeFileSync(resolve(templatesDir, 'LATER.feature.ts'), 'export const feature = {}');
    writeFileSync(resolve(templatesDir, 'valid.js'), 'export const valid = {}');
    writeFileSync(resolve(templatesDir, 'registry.ts'), 'export const registry = {}');

    const generator = new TemplateGenerator({ templatesDir });
    const files = generator.listTemplateFiles();
    
    expect(files).not.toContain('index.js');
    expect(files).not.toContain('LATER.feature.ts');
    expect(files).not.toContain('registry.ts');
    expect(files).toContain('template.ts');
    expect(files).toContain('valid.js');
  });

  test('listTemplateFiles returns sorted list of valid template files', () => {
    mkdirSync(templatesDir, { recursive: true });
    writeFileSync(resolve(templatesDir, 'z-last.ts'), 'export const z = {}');
    writeFileSync(resolve(templatesDir, 'a-first.js'), 'export const a = {}');
    writeFileSync(resolve(templatesDir, 'm-middle.ts'), 'export const m = {}');

    const generator = new TemplateGenerator({ templatesDir });
    const files = generator.listTemplateFiles();
    
    expect(files).toEqual(['a-first.js', 'm-middle.ts', 'z-last.ts']);
  });

  test('loadPayload loads data from JSON file', async () => {
    mkdirSync(dataDir, { recursive: true });
    const jsonPath = resolve(dataDir, 'test.json');
    writeFileSync(jsonPath, JSON.stringify({ title: 'Test Title', value: 42 }));

    const generator = new TemplateGenerator({ dataDir });
    const payload = await generator.loadPayload('test-id', jsonPath);
    
    expect(payload).toEqual({ title: 'Test Title', value: 42 });
  });

  test('loadPayload uses samplePayloads when dataPath is not provided', async () => {
    const generator = new TemplateGenerator({
      samplePayloads: { 'test-id': { fromSample: true } }
    });
    const payload = await generator.loadPayload('test-id');
    
    expect(payload).toEqual({ fromSample: true });
  });

  test('listTemplateFiles includes .html templates and honours custom extensions', () => {
    mkdirSync(templatesDir, { recursive: true });
    writeFileSync(resolve(templatesDir, 'a.html'), '<p></p>');
    writeFileSync(resolve(templatesDir, 'b.ts'), '');
    writeFileSync(resolve(templatesDir, 'c.mjml'), '');

    expect(new TemplateGenerator({ templatesDir }).listTemplateFiles()).toEqual(['a.html', 'b.ts']);
    expect(
      new TemplateGenerator({ templatesDir, extensions: /\.mjml$/ }).listTemplateFiles()
    ).toEqual(['c.mjml']);
  });

  test('loadPayload resolves relative dataPath against root (via loadData)', async () => {
    mkdirSync(dataDir, { recursive: true });
    writeFileSync(resolve(dataDir, 'mod.mjs'), 'export default { title: "From module" };');
    const generator = new TemplateGenerator({ root: testDir });
    await expect(generator.loadPayload('x', 'data/mod.mjs')).resolves.toEqual({
      title: 'From module',
    });
  });

  test('loadPayload falls back to <dataDir>/<templateId>.json', async () => {
    mkdirSync(dataDir, { recursive: true });
    writeFileSync(resolve(dataDir, 'news.json'), JSON.stringify({ title: 'From dataDir' }));
    const generator = new TemplateGenerator({ root: testDir, dataDir: 'data' });
    await expect(generator.loadPayload('news')).resolves.toEqual({ title: 'From dataDir' });
    await expect(generator.loadPayload('missing')).resolves.toBeUndefined();
  });

  test('render produces an HTML document (fallback content) instead of JSON', async () => {
    const generator = new TemplateGenerator({ root: testDir });
    const html = await generator.render('test-id', {
      payload: { title: 'Hello <World>', preview: 'Preview & more' },
    });

    expect(html.startsWith('<!DOCTYPE html>')).toBe(true);
    expect(html).toContain('<title>Hello &lt;World&gt;</title>');
    expect(html).toContain('<h1 style="margin: 0 0 8px 0;">Hello &lt;World&gt;</h1>');
    expect(html).toContain('Preview &amp; more');
    expect(() => JSON.parse(html)).toThrow();
  });

  test('render loads payload from samplePayloads when not provided', async () => {
    const generator = new TemplateGenerator({
      root: testDir,
      samplePayloads: { 'test-id': { title: 'Sample' } },
    });
    const html = await generator.render('test-id');
    expect(html).toContain('>Sample</h1>');
  });

  test('render uses <templatesDir>/<id>.html with {{placeholders}}', async () => {
    mkdirSync(templatesDir, { recursive: true });
    writeFileSync(
      resolve(templatesDir, 'news.html'),
      '<html><body data-id="{{templateId}}"><h1>{{title}}</h1><p>{{meta.author}}</p>{{{rawHtml}}}{{missing}}</body></html>'
    );
    const generator = new TemplateGenerator({ templatesDir });
    const html = await generator.render('news', {
      payload: { title: 'A & B', meta: { author: 'Arthur' }, rawHtml: '<b>x</b>' },
    });
    expect(html).toBe(
      '<html><body data-id="news"><h1>A &amp; B</h1><p>Arthur</p><b>x</b></body></html>'
    );
  });

  test('render delegates to config.renderTemplate', async () => {
    const generator = new TemplateGenerator({
      root: testDir,
      renderTemplate: (id, { string, data }) => `<main id="${id}">${data.title}|${string.includes('<table')}</main>`,
    });
    await expect(generator.render('x', { payload: { title: 'T' } })).resolves.toBe(
      '<main id="x">T|true</main>'
    );
  });

  test('findCatalogEntry returns the entry listing the id', () => {
    const entry = { ids: ['a', 'b'], label: 'AB' };
    const generator = new TemplateGenerator({ catalog: [entry] });
    expect(generator.findCatalogEntry('b')).toBe(entry);
    expect(generator.findCatalogEntry('z')).toBeUndefined();
  });

  test('write resolves outDir against root and writes HTML', async () => {
    const generator = new TemplateGenerator({ root: testDir });
    const result = await generator.write('test-template', { payload: { title: 'Hi' } });

    expect(result).toBe(resolve(testDir, 'generated', 'test-template.html'));
    expect(readFileSync(result, 'utf-8')).toContain('>Hi</h1>');
  });

  test('write resolves a relative out against root, not process.cwd()', async () => {
    const generator = new TemplateGenerator({ root: testDir });
    const result = await generator.write('x', { out: 'custom/out.html' });
    expect(result).toBe(resolve(testDir, 'custom', 'out.html'));
    expect(existsSync(result)).toBe(true);
  });

  test('write uses custom absolute output path when provided', async () => {
    const customOutPath = resolve(testDir, 'custom', 'output.html');
    const generator = new TemplateGenerator();
    const result = await generator.write('test-id', { out: customOutPath });

    expect(result).toBe(customOutPath);
    expect(existsSync(customOutPath)).toBe(true);
  });

  test('write creates parent directories if they do not exist', async () => {
    const nestedPath = resolve(testDir, 'deep', 'nested', 'path.html');
    const generator = new TemplateGenerator();
    const result = await generator.write('test-id', { out: nestedPath });

    expect(existsSync(result)).toBe(true);
    expect(existsSync(resolve(testDir, 'deep', 'nested'))).toBe(true);
  });
});

describe('createGenerator', () => {
  test('returns a TemplateGenerator instance', () => {
    const generator = createGenerator();
    expect(generator).toBeInstanceOf(TemplateGenerator);
  });

  test('passes config to TemplateGenerator constructor', () => {
    const generator = createGenerator({ outDir: 'factory-output' });
    expect(generator.outDir).toBe('factory-output');
  });
});
