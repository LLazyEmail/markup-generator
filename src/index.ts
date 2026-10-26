/**
 * markup-generator v4 — core barrel.
 *
 * Re-exports every scoped package so `import { … } from 'markup-generator'`
 * keeps working. Import from the scoped package directly when you only need
 * one slice (e.g. `@llazyemail/read` for gray-matter front-matter parsing).
 *
 * Legacy APIs:
 * - `writeHTML`      — deprecated (use `writeGeneratedFile`), removed in v5
 * - `isFolderExists` — deprecated (use `ensureDir`), removed in v5
 * - `writingFile`    — removed in v4 (use `writeGeneratedFile({ content, prefix })`)
 */
export * from '@llazyemail/fs';
export * from '@llazyemail/write';
export * from '@llazyemail/read';
export * from '@llazyemail/email';
export * from '@llazyemail/cli';
// `@llazyemail/template` re-exports loadData / loadContent / TemplateData from
// `@llazyemail/read`; list its own symbols explicitly to avoid duplicate exports.
export {
  buildFallbackContent,
  generateTemplate,
  TemplateGenerator,
  createGenerator,
  DEFAULT_OUT_DIR,
} from '@llazyemail/template';
export type {
  RenderTemplate,
  GenerateTemplateOptions,
  TemplateCatalogEntry,
  GeneratorConfig,
  RenderOptions,
  WriteOptions,
} from '@llazyemail/template';
