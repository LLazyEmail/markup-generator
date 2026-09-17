import { readFileSync } from 'fs';
import { resolve, extname } from 'path';
import { pathToFileURL } from 'url';
import { MarkupGeneratorError } from './errors';

/**
 * Resolves a path relative to process.cwd() unless it is already absolute.
 * Shared by every read/write helper so path handling stays consistent.
 */
export const resolveFromCwd = (filePath: string): string => resolve(process.cwd(), filePath);

/**
 * Reads a plain content file (HTML, text, markdown, etc.) as a UTF-8 string.
 * Resolved relative to process.cwd() unless filePath is already absolute.
 *
 * @throws {MarkupGeneratorError} code 'ENOENT' if the file does not exist,
 *   or 'EREAD' for any other read failure.
 */
export const readContentFile = (filePath: string): string => {
  if (typeof filePath !== 'string' || filePath.trim() === '') {
    throw new MarkupGeneratorError('EINVAL', 'readContentFile: filePath must be a non-empty string');
  }

  const absolutePath = resolveFromCwd(filePath);

  try {
    return readFileSync(absolutePath, 'utf8');
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === 'ENOENT') {
      throw new MarkupGeneratorError('ENOENT', `readContentFile: no such file: ${absolutePath}`, { cause: error });
    }
    throw new MarkupGeneratorError('EREAD', `readContentFile: failed to read ${absolutePath}: ${nodeError.message}`, { cause: error });
  }
};

/**
 * Loads a data module — .json is parsed directly; .js/.mjs/.cjs are loaded
 * via dynamic import and return the module's default export if present,
 * otherwise the whole module namespace. Resolved relative to process.cwd()
 * unless filePath is already absolute.
 *
 * @throws {MarkupGeneratorError} code 'ENOENT' if the file does not exist,
 *   'EPARSE' if JSON parsing fails, or 'EIMPORT' if the module import fails.
 */
export const loadDataModule = async (filePath: string): Promise<unknown> => {
  if (typeof filePath !== 'string' || filePath.trim() === '') {
    throw new MarkupGeneratorError('EINVAL', 'loadDataModule: filePath must be a non-empty string');
  }

  const absolutePath = resolveFromCwd(filePath);
  const ext = extname(absolutePath).toLowerCase();

  if (ext === '.json') {
    let raw: string;
    try {
      raw = readFileSync(absolutePath, 'utf8');
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;
      if (nodeError.code === 'ENOENT') {
        throw new MarkupGeneratorError('ENOENT', `loadDataModule: no such file: ${absolutePath}`, { cause: error });
      }
      throw new MarkupGeneratorError('EREAD', `loadDataModule: failed to read ${absolutePath}: ${nodeError.message}`, { cause: error });
    }

    try {
      return JSON.parse(raw);
    } catch (error) {
      throw new MarkupGeneratorError('EPARSE', `loadDataModule: invalid JSON in ${absolutePath}`, { cause: error });
    }
  }

  try {
    const mod = (await import(pathToFileURL(absolutePath).href)) as { default?: unknown };
    return mod.default ?? mod;
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === 'ERR_MODULE_NOT_FOUND' || nodeError.code === 'MODULE_NOT_FOUND') {
      throw new MarkupGeneratorError('ENOENT', `loadDataModule: no such module: ${absolutePath}`, { cause: error });
    }
    throw new MarkupGeneratorError('EIMPORT', `loadDataModule: failed to import ${absolutePath}: ${nodeError.message}`, { cause: error });
  }
};
