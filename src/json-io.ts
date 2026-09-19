import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { MarkupGeneratorError } from './errors';

/** Read + parse a JSON file. */
export function readJson<T = unknown>(filePath: string): T {
  let text: string;
  try {
    text = readFileSync(filePath, 'utf-8');
  } catch (err) {
    throw new MarkupGeneratorError(
      'JSON_READ',
      `Failed to read JSON file "${filePath}": ${(err as Error).message}`
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch (err) {
    throw new MarkupGeneratorError(
      'JSON_PARSE',
      `Failed to parse JSON file "${filePath}": ${(err as Error).message}`
    );
  }
}

/** Serialize a value and write it as JSON, creating parent dirs as needed. */
export function writeJson(filePath: string, value: unknown, pretty = true): void {
  mkdirSync(dirname(filePath), { recursive: true });
  const text = pretty ? JSON.stringify(value, null, 2) + '\n' : JSON.stringify(value);
  writeFileSync(filePath, text, 'utf-8');
}
