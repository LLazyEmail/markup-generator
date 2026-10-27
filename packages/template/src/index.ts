/**
 * @llazyemail/template — template generation extracted in Phase 3.
 * Write paths go through `@llazyemail/write` (not raw fs.writeFileSync).
 */
export {
  buildFallbackContent,
  generateTemplate,
  loadData,
  loadContent,
} from './generate-template';
export type {
  TemplateData,
  RenderTemplate,
  GenerateTemplateOptions,
} from './generate-template';
export {
  TemplateGenerator,
  createGenerator,
  DEFAULT_OUT_DIR,
  DEFAULT_TEMPLATE_EXTENSIONS,
  interpolate,
  wrapHtmlDocument,
} from './templateGenerator';
export type {
  TemplateCatalogEntry,
  GeneratorConfig,
  RenderOptions,
  WriteOptions,
} from './templateGenerator';
