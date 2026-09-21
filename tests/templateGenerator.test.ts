import { afterEach, describe, expect, test } from 'vitest';
import { existsSync, readFileSync, rmSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { TemplateGenerator, createGenerator } from '../src/index';

const testDir = resolve(process.cwd(), 'test-template-generator');
const templatesDir = resolve(testDir, 'templates');
const dataDir = resolve(testDir, 'data');
const outDir = resolve(testDir, 'generated');

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

  test('loadPayload loads data from JS file with default export', async () => {
    mkdirSync(dataDir, { recursive: true });
    const jsPath = resolve(dataDir, 'test.js');
    writeFileSync(jsPath, 'export default { title: "JS Title", value: 100 }');

    const generator = new TemplateGenerator({ dataDir });
    const payload = await generator.loadPayload('test-id', jsPath);
    
    expect(payload).toEqual({ title: 'JS Title', value: 100 });
  });

  test('loadPayload loads data from JS file without default export', async () => {
    mkdirSync(dataDir, { recursive: true });
    const jsPath = resolve(dataDir, 'test.js');
    writeFileSync(jsPath, 'export const title = "Direct Title"; export const value = 200;');

    const generator = new TemplateGenerator({ dataDir });
    const payload = await generator.loadPayload('test-id', jsPath);
    
    expect(payload).toHaveProperty('title', 'Direct Title');
    expect(payload).toHaveProperty('value', 200);
  });

  test('loadPayload uses samplePayloads when dataPath is not provided', async () => {
    const generator = new TemplateGenerator({
      samplePayloads: { 'test-id': { fromSample: true } }
    });
    const payload = await generator.loadPayload('test-id');
    
    expect(payload).toEqual({ fromSample: true });
  });

  test('render uses provided payload when available', async () => {
    const generator = new TemplateGenerator();
    const customPayload = { custom: 'data' };
    const result = await generator.render('test-id', { payload: customPayload });
    
    const parsed = JSON.parse(result);
    expect(parsed.templateId).toBe('test-id');
    expect(parsed.payload).toEqual(customPayload);
  });

  test('render loads payload from samplePayloads when not provided', async () => {
    const generator = new TemplateGenerator({
      samplePayloads: { 'test-id': { fromSample: true } }
    });
    const result = await generator.render('test-id');
    
    const parsed = JSON.parse(result);
    expect(parsed.payload).toEqual({ fromSample: true });
  });

  test('write creates directory and writes HTML file', async () => {
    const generator = new TemplateGenerator({ outDir });
    const result = await generator.write('test-template');
    
    expect(existsSync(result)).toBe(true);
    expect(result).toContain('test-template.html');
    
    const content = readFileSync(result, 'utf-8');
    const parsed = JSON.parse(content);
    expect(parsed.templateId).toBe('test-template');
  });

  test('write uses custom output path when provided', async () => {
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
