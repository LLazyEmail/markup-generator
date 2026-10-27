import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { listTemplateFiles as fsListTemplateFiles } from '@llazyemail/fs';
import { loadData } from '@llazyemail/read';
import type { TemplateData } from '@llazyemail/read';
import { writeGeneratedFile } from '@llazyemail/write';
import { buildFallbackContent } from './generate-template';
import type { RenderTemplate } from './generate-template';

const DEFAULT_SKIP = ['index.js', 'index2.js', 'registry.ts', 'registry.js'];

/** Default file extensions for `listTemplateFiles` (modules + HTML templates). */
export const DEFAULT_TEMPLATE_EXTENSIONS = /\.(ts|js|html)$/;

/** Extensions tried, in order, when a payload is looked up in `dataDir`. */
const DATA_EXTENSIONS = ['.json', '.js', '.mjs', '.cjs'];

export type TemplateCatalogEntry = {
  ids: string[];
  [key: string]: unknown;
};

export type GeneratorConfig = {
  /**
   * Template metadata (opaque to the generator). Each entry lists the
   * template ids it applies to; look one up with `findCatalogEntry(id)`.
   */
  catalog?: TemplateCatalogEntry[];
  samplePayloads?: Record<string, unknown>;
  root?: string;
  templatesDir?: string;
  /** Directory searched for `<templateId>.json|.js|.mjs|.cjs` payloads. */
  dataDir?: string;
  /** Output directory, resolved against `root`. */
  outDir?: string;
  skipFiles?: string[];
  /** Filter used by `listTemplateFiles`. Default: `.ts`, `.js`, `.html`. */
  extensions?: RegExp;
  /** Custom renderer (same signature as `generateTemplate`'s `render`). */
  renderTemplate?: RenderTemplate;
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function lookup(data: unknown, keyPath: string): unknown {
  return keyPath.split('.').reduce<unknown>((acc, key) => {
    if (acc !== null && typeof acc === 'object' && key in (acc as object)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, data);
}

/**
 * Replace `{{key}}` / `{{nested.key}}` (HTML-escaped) and `{{{key}}}` (raw)
 * placeholders. Missing keys render as an empty string.
 */
export function interpolate(template: string, data: unknown): string {
  const toText = (value: unknown): string =>
    value === undefined || value === null
      ? ''
      : typeof value === 'object'
        ? JSON.stringify(value)
        : String(value);

  return template
    .replace(/\{\{\{\s*([\w.$-]+)\s*\}\}\}/g, (_m, key: string) => toText(lookup(data, key)))
    .replace(/\{\{\s*([\w.$-]+)\s*\}\}/g, (_m, key: string) =>
      escapeHtml(toText(lookup(data, key)))
    );
}

/** Wrap an HTML fragment in a minimal email-safe document. */
export function wrapHtmlDocument(body: string, title = ''): string {
  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${escapeHtml(title)}</title>`,
    '</head>',
    '<body>',
    body,
    '</body>',
    '</html>',
    '',
  ].join('\n');
}

export class TemplateGenerator {
  readonly catalog: TemplateCatalogEntry[];
  readonly samplePayloads: Record<string, unknown>;
  readonly root: string;
  readonly templatesDir: string;
  readonly dataDir: string;
  readonly outDir: string;
  readonly skipFiles: Set<string>;
  readonly extensions: RegExp;
  readonly renderTemplate?: RenderTemplate;

  constructor(config: GeneratorConfig = {}) {
    this.catalog = config.catalog ?? [];
    this.samplePayloads = config.samplePayloads ?? {};
    this.root = path.resolve(config.root ?? process.cwd());
    this.templatesDir = path.resolve(this.root, config.templatesDir ?? path.join('src', 'templates'));
    this.dataDir = path.resolve(this.root, config.dataDir ?? path.join('src', 'data'));
    this.outDir = config.outDir ?? DEFAULT_OUT_DIR;
    this.skipFiles = new Set(config.skipFiles ?? DEFAULT_SKIP);
    this.extensions = config.extensions ?? DEFAULT_TEMPLATE_EXTENSIONS;
    this.renderTemplate = config.renderTemplate;
  }

  /** Delegates to `@llazyemail/fs` `listTemplateFiles` (sorted, skip list, LATER.* excluded). */
  listTemplateFiles(): string[] {
    return fsListTemplateFiles(this.templatesDir, {
      skipFiles: this.skipFiles,
      extensions: this.extensions,
    });
  }

  /** First catalog entry whose `ids` include `templateId`, if any. */
  findCatalogEntry(templateId: string): TemplateCatalogEntry | undefined {
    return this.catalog.find((entry) => entry.ids.includes(templateId));
  }

  /**
   * Payload resolution order:
   * 1. `dataPath` (resolved against `root`) via `@llazyemail/read` `loadData`
   * 2. `samplePayloads[templateId]`
   * 3. `<dataDir>/<templateId>.json|.js|.mjs|.cjs`, when such a file exists
   * 4. `undefined`
   */
  async loadPayload(templateId: string, dataPath?: string): Promise<unknown> {
    if (dataPath) {
      return loadData(path.resolve(this.root, dataPath));
    }

    if (templateId in this.samplePayloads) {
      return this.samplePayloads[templateId];
    }

    for (const ext of DATA_EXTENSIONS) {
      const candidate = path.join(this.dataDir, `${templateId}${ext}`);
      if (existsSync(candidate)) return loadData(candidate);
    }

    return undefined;
  }

  /**
   * Render a full HTML document:
   * - `renderTemplate` (config) when given, called with
   *   `{ string: <fallback fragment>, data }` (raw payload); output returned as-is
   * - else `<templatesDir>/<templateId>.html` with `{{key}}` placeholders
   *   (`interpolate`); returned as-is
   * - else `buildFallbackContent` (title/preview HTML-escaped) wrapped in a
   *   minimal HTML document
   */
  async render(templateId: string, options: RenderOptions = {}): Promise<string> {
    const payload =
      options.payload !== undefined
        ? options.payload
        : await this.loadPayload(templateId, options.dataPath);
    const data = (payload && typeof payload === 'object' ? payload : {}) as TemplateData;
    const fragment = buildFallbackContent({
      title: typeof data.title === 'string' ? escapeHtml(data.title) : undefined,
      preview: typeof data.preview === 'string' ? escapeHtml(data.preview) : undefined,
    });

    if (this.renderTemplate) {
      return this.renderTemplate(templateId, { string: fragment, data });
    }

    const htmlTemplate = path.join(this.templatesDir, `${templateId}.html`);
    if (existsSync(htmlTemplate)) {
      return interpolate(readFileSync(htmlTemplate, 'utf-8'), {
        templateId,
        ...data,
      });
    }

    const title = typeof data.title === 'string' ? data.title : templateId;
    return wrapHtmlDocument(fragment, title);
  }

  /**
   * Render then persist via `@llazyemail/write` (`writeGeneratedFile`).
   * Relative `out` / `outDir` are resolved against `root`.
   */
  async write(templateId: string, options: WriteOptions = {}): Promise<string> {
    const html = await this.render(templateId, options);
    const outPath = options.out || path.join(this.outDir, `${templateId}.html`);
    const resolvedOutPath = path.resolve(this.root, outPath);

    return writeGeneratedFile({
      content: html,
      fileName: path.basename(resolvedOutPath),
      dir: path.dirname(resolvedOutPath),
    });
  }
}

export function createGenerator(config: GeneratorConfig = {}): TemplateGenerator {
  return new TemplateGenerator(config);
}
