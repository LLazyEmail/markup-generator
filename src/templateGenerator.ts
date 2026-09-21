import fs from 'node:fs';
import path from 'node:path';
import { readJson } from './json-io';
import { importEsm } from './read';
import { pathToFileURL } from 'node:url';

const DEFAULT_SKIP = new Set(['index.js', 'index2.js', 'registry.ts', 'registry.js']);

export type TemplateCatalogEntry = {
  ids: string[];
  [key: string]: unknown;
};

export type GeneratorConfig = {
  catalog?: TemplateCatalogEntry[];
  samplePayloads?: Record<string, unknown>;
  root?: string;
  templatesDir?: string;
  dataDir?: string;
  outDir?: string;
  skipFiles?: string[];
};

export type RenderOptions = {
  payload?: unknown;
  dataPath?: string;
};

export type WriteOptions = {
  out?: string;
  payload?: unknown;
  dataPath?: string;
};

export const DEFAULT_OUT_DIR = 'generated';

export class TemplateGenerator {
  readonly catalog: TemplateCatalogEntry[];
  readonly samplePayloads: Record<string, unknown>;
  readonly root: string;
  readonly templatesDir: string;
  readonly dataDir: string;
  readonly outDir: string;
  readonly skipFiles: Set<string>;

  constructor(config: GeneratorConfig = {}) {
    this.catalog = config.catalog ?? [];
    this.samplePayloads = config.samplePayloads ?? {};
    this.root = path.resolve(config.root ?? process.cwd());
    this.templatesDir = path.resolve(this.root, config.templatesDir ?? path.join('src', 'templates'));
    this.dataDir = path.resolve(this.root, config.dataDir ?? path.join('src', 'data'));
    this.outDir = config.outDir ?? DEFAULT_OUT_DIR;
    this.skipFiles = new Set(config.skipFiles ?? [...DEFAULT_SKIP]);
  }

  listTemplateFiles(): string[] {
    if (!fs.existsSync(this.templatesDir)) return [];
    return fs
      .readdirSync(this.templatesDir)
      .filter((name) => {
        if (this.skipFiles.has(name)) return false;
        if (/LATER\./i.test(name)) return false;
        return /\.(ts|js)$/.test(name);
      })
      .sort();
  }

  async loadPayload(templateId: string, dataPath?: string): Promise<unknown> {
    if (dataPath) {
      const absolutePath = path.resolve(this.root, dataPath);
      const ext = path.extname(absolutePath).toLowerCase();
      
      if (ext === '.json') {
        return readJson(absolutePath);
      }
      
      const mod = (await importEsm(pathToFileURL(absolutePath).href)) as {
        default?: unknown;
      } & unknown;
      return mod.default ?? mod;
    }
    
    return this.samplePayloads[templateId];
  }

  async render(templateId: string, options: RenderOptions = {}): Promise<string> {
    const payload = options.payload !== undefined 
      ? options.payload 
      : await this.loadPayload(templateId, options.dataPath);
    
    // This is a placeholder - you'll need to implement the actual rendering logic
    // based on your project's template system
    return JSON.stringify({ templateId, payload });
  }

  async write(templateId: string, options: WriteOptions = {}): Promise<string> {
    const html = await this.render(templateId, options);
    const fileName = `${templateId}.html`;
    const outPath = options.out || path.join(this.outDir, fileName);
    
    const resolvedOutPath = path.resolve(process.cwd(), outPath);
    fs.mkdirSync(path.dirname(resolvedOutPath), { recursive: true });
    fs.writeFileSync(resolvedOutPath, html, 'utf8');
    
    return resolvedOutPath;
  }
}

export function createGenerator(config: GeneratorConfig = {}): TemplateGenerator {
  return new TemplateGenerator(config);
}
