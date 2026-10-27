# @llazyemail/template

Template generation. It depends on `@llazyemail/cli` (`parseArgv`),
`@llazyemail/read` (`loadData`, `loadContent`, `readJson`, `importEsm`) and
`@llazyemail/write` (`writeGeneratedFile`). It is Node-only.

```bash
pnpm add @llazyemail/template
```

```ts
import { generateTemplate, buildFallbackContent, TemplateGenerator, createGenerator, DEFAULT_OUT_DIR } from '@llazyemail/template';
```

This package also re-exports `loadData`, `loadContent` and the `TemplateData`
type from `@llazyemail/read`.

## `generateTemplate(options: GenerateTemplateOptions): Promise<string>`

```ts
type RenderTemplate = (templateId: string, input: { string: string; data: TemplateData }) => string;
type GenerateTemplateOptions = {
  render: RenderTemplate;      // required, synchronous
  argv?: string[];             // default process.argv (parsed with parseArgv)
  cwd?: string;                // default process.cwd()
  defaultTemplateId?: string;  // default 'hn'
  defaultDataPath?: string;    // default 'content/content2.js'
};
```

Flow:
1. It parses `argv` and reads `--template`, `--data`, `--content` and `--out`.
2. `templateId` is `--template`, then `defaultTemplateId`, then `'hn'`. The
   value is trimmed. An empty value throws `Error('--template must be a non-empty string')`.
3. The data path is `resolve(cwd, --data || defaultDataPath)`, and data is
   loaded with `loadData`, so `.json` files are read as JSON and anything else
   is imported as a module.
4. Content is `loadContent(--content, cwd)`. If that is empty, it uses
   `buildFallbackContent(data)`.
5. It calls `render(templateId, { string: content, data })`.
6. The output path is `--out`, or `generated/<templateId>.html` if `--out` is
   not set. If the output path **contains `/`**, the file goes to
   `resolve(cwd, out, '..')/basename`. Otherwise it goes to `cwd/generated/<out>`.
   Writes use `writeGeneratedFile` with the default overwrite policy.
7. It resolves to the absolute output path.

A flag given without a value (for example `--template` on its own) is parsed as
`true`. `--data` would then be converted to the string `"true"`.

```ts
// scripts/build.ts
await generateTemplate({
  render: (id, { string, data }) => `<html><body data-id="${id}">${string}</body></html>`,
  defaultDataPath: 'content/data.json',
});
// node scripts/build.js --template hn --content content/body.html --out dist/hn.html
```

## `buildFallbackContent(data: TemplateData): string`
Returns a centred `<table>` containing `<h1>${data.title || '[Generated Template]'}</h1>`
and `<p>${data.preview || ''}</p>`. **Values are not HTML-escaped.**

## `class TemplateGenerator` / `createGenerator(config?: GeneratorConfig): TemplateGenerator`

```ts
type TemplateCatalogEntry = { ids: string[]; [key: string]: unknown };
type GeneratorConfig = {
  catalog?: TemplateCatalogEntry[];          // default []; see findCatalogEntry
  samplePayloads?: Record<string, unknown>;  // default {}
  root?: string;                             // default process.cwd(), resolved
  templatesDir?: string;                     // default 'src/templates' (relative to root)
  dataDir?: string;                          // default 'src/data' (relative to root)
  outDir?: string;                           // default DEFAULT_OUT_DIR = 'generated' (resolved against root on write)
  skipFiles?: string[];                      // default index.js, index2.js, registry.ts, registry.js
  extensions?: RegExp;                       // default DEFAULT_TEMPLATE_EXTENSIONS = /\.(ts|js|html)$/
  renderTemplate?: RenderTemplate;           // optional custom renderer
};
type RenderOptions = { payload?: unknown; dataPath?: string };
type WriteOptions  = { out?: string; payload?: unknown; dataPath?: string };
```

The constructor stores every config value as a `readonly` property.

| Method | Behaviour |
|--------|-----------|
| `listTemplateFiles(): string[]` | Delegates to `@llazyemail/fs` `listTemplateFiles(templatesDir, { skipFiles, extensions })`: sorted, skip list and `LATER.` names excluded, `[]` if the directory is missing. |
| `loadPayload(templateId, dataPath?): Promise<unknown>` | 1. `dataPath` resolved against `root`, loaded with `@llazyemail/read` `loadData` (`.json` or module). 2. `samplePayloads[templateId]`. 3. `<dataDir>/<templateId>.json\|.js\|.mjs\|.cjs` if present. 4. `undefined`. |
| `render(templateId, options?): Promise<string>` | Payload = `options.payload` or `loadPayload`. Then: `renderTemplate(id, { string: fallbackFragment, data })` if configured; else `<templatesDir>/<templateId>.html` with `{{key}}` / `{{nested.key}}` (HTML-escaped) and `{{{key}}}` (raw) placeholders (`templateId` is also available); else `buildFallbackContent` (title/preview escaped) wrapped in a full HTML document (`wrapHtmlDocument`). |
| `write(templateId, options?): Promise<string>` | Renders, then writes to `options.out`, or `path.join(outDir, '<templateId>.html')`. Relative paths are resolved against **`root`** (changed in this release; previously `process.cwd()`). Returns the absolute path and overwrites existing files. |
| `findCatalogEntry(templateId)` | First `catalog` entry whose `ids` include `templateId`, or `undefined`. The generator does not otherwise interpret catalog entries. |

Helpers `interpolate(template, data)` and `wrapHtmlDocument(body, title?)` are exported too.

```ts
const gen = createGenerator({ root: __dirname, samplePayloads: { hn: { title: 'Hi' } } });
await gen.write('hn'); // → <root>/generated/hn.html (fallback HTML, or src/templates/hn.html if present)
```

## Testing and building
```bash
pnpm --filter @llazyemail/template test
pnpm --filter @llazyemail/template build
```
