import { readFileSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { MarkupGeneratorError } from '@llazyemail/write';
import { readJson } from './json-io';
import { importEsm } from './importEsm';
import type { TemplateData } from './types';

function asAbsolute(cwd: string, value: string): string {
  return resolve(cwd, value);
}

/**
 * Load template data from a `.json` file or a JS module (`.js` / `.mjs` / `.cjs`).
 * Paths should already be absolute (or will be used as-is for import).
 *
 * Errors: JSON files throw JSON_READ / JSON_PARSE; module import failures
 * (missing file, syntax error, throwing module) throw EIMPORT. All carry the
 * original error as `cause`.
 */
export async function loadData(dataPath: string): Promise<TemplateData> {
  const ext = extname(dataPath).toLowerCase();
  if (ext === '.json') {
    return readJson<TemplateData>(dataPath);
  }

  let mod: { default?: TemplateData } & TemplateData;
  try {
    mod = (await importEsm(pathToFileURL(dataPath).href)) as {
      default?: TemplateData;
    } & TemplateData;
  } catch (err) {
    throw new MarkupGeneratorError(
      'EIMPORT',
      `Failed to import data module "${dataPath}": ${(err as Error).message}`,
      { cause: err }
    );
  }
  return (mod.default ?? mod) as TemplateData;
}

/**
 * Read a content file relative to `cwd`, or return null when no path is given.
 * Read failures throw EREAD with the original error as `cause`.
 */
export function loadContent(contentPath?: string, cwd = process.cwd()): string | null {
  if (!contentPath) return null;
  const absolute = asAbsolute(cwd, contentPath);
  try {
    return readFileSync(absolute, 'utf8');
  } catch (err) {
    throw new MarkupGeneratorError(
      'EREAD',
      `Failed to read content file "${absolute}": ${(err as Error).message}`,
      { cause: err }
    );
  }
}
