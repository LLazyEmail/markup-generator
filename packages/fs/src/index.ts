/**
 * @llazyemail/fs — FS primitives extracted in Phase 1.
 * Pure path/dir helpers only (no gray-matter / front-matter).
 */
export { ensureDir, isFolderExists } from './ensureDir';
export { resolveFromCwd } from './resolveFromCwd';
export { pathExists, listTemplateFiles } from './fs-list';
export type { ListTemplateFilesOptions } from './fs-list';
