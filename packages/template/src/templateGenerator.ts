import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readJson, importEsm } from '@llazyemail/read';
import { writeGeneratedFile } from '@llazyemail/write';

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
    const payload =
      options.payload !== undefined
        ? options.payload
        : await this.loadPayload(templateId, options.dataPath);

    // Placeholder — project-specific template rendering plugs in here.
    return JSON.stringify({ templateId, payload });
  }

  /**
   * Render then persist via `@llazyemail/write` (`writeGeneratedFile`).
   */
  async write(templateId: string, options: WriteOptions = {}): Promise<string> {
    const html = await this.render(templateId, options);
    const fileName = `${templateId}.html`;
    const outPath = options.out || path.join(this.outDir, fileName);

    const resolvedOutPath = path.resolve(process.cwd(), outPath);
    const dir = path.dirname(resolvedOutPath);
    const name = path.basename(resolvedOutPath);

    return writeGeneratedFile({
      content: html,
      fileName: name,
      dir,
    });
  }
}

export function createGenerator(config: GeneratorConfig = {}): TemplateGenerator {
  return new TemplateGenerator(config);
}
