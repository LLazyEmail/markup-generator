/**
 * @llazyemail/read — read helpers extracted in Phase 2.
 * Owns gray-matter; root markup-generator must not depend on it directly.
 */
export { readSourceFile } from './readSourceFile';
export { readFrontMatter } from './readFrontMatter';
export { readJson, writeJson } from './json-io';
export { loadData, loadContent } from './load';
export { importEsm } from './importEsm';
export type { TemplateData } from './types';
