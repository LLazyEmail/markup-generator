import { readFileSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readJson } from './json-io';
import { importEsm } from './importEsm';
import type { TemplateData } from './types';

function asAbsolute(cwd: string, value: string): string {
  return resolve(cwd, value);
}

/**
 * Load template data from a `.json` file or a JS module (`.js` / `.mjs` / `.cjs`).
 * Paths should already be absolute (or will be used as-is for import).
 */
export async function loadData(dataPath: string): Promise<TemplateData> {
  const ext = extname(dataPath).toLowerCase();
  if (ext === '.json') {
    return readJson<TemplateData>(dataPath);
  }

  const mod = (await importEsm(pathToFileURL(dataPath).href)) as {
    default?: TemplateData;
  } & TemplateData;
  return (mod.default ?? mod) as TemplateData;
}

/** Read a content file relative to `cwd`, or return null when no path is given. */
export function loadContent(contentPath?: string, cwd = process.cwd()): string | null {
  if (!contentPath) return null;
  return readFileSync(asAbsolute(cwd, contentPath), 'utf8');
}
