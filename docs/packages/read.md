# @llazyemail/read

Helpers for reading text, front matter, JSON and data/content files. This is
the **only** package that depends on `gray-matter`. It also depends on
`@llazyemail/write` for `MarkupGeneratorError`. It is Node-only.

```bash
pnpm add @llazyemail/read
```

```ts
import { readSourceFile, readFrontMatter, readJson, writeJson, loadData, loadContent, importEsm } from '@llazyemail/read';
const { readFrontMatter } = require('@llazyemail/read'); // CJS
```

## Exports

### `readSourceFile(fileName: string): string`
Synchronous UTF-8 read. Native `fs` errors (such as ENOENT) are thrown as they are.

### `readFrontMatter(filename: string): { frontMatter: Record<string, unknown>; markdown: string }`
Reads the file synchronously and parses it with `gray-matter`. `frontMatter` is
the YAML `data`, and `markdown` is the body. A file with no front matter returns
`frontMatter: {}`. Errors from `fs` and from YAML parsing are thrown as they are.

```ts
const { frontMatter, markdown } = readFrontMatter('content/post.md');
```

### `readJson<T = unknown>(filePath: string): T`
- If the read fails, it throws `MarkupGeneratorError('JSON_READ', 'Failed to read JSON file "<path>": …')`.
- If parsing fails, it throws `MarkupGeneratorError('JSON_PARSE', 'Failed to parse JSON file "<path>": …')`.
- The result is not checked against `T`. The type parameter is only a cast.

### `writeJson(filePath: string, value: unknown, pretty = true): void`
Creates the parent directories, then writes JSON. With `pretty`, it uses
2-space indentation and a trailing newline. With `pretty = false`, it writes a
single line with no newline. Errors are **not** wrapped in
`MarkupGeneratorError`, and the function is synchronous. (It lives in "read"
for historical reasons.)

### `loadData(dataPath: string): Promise<TemplateData>`
- `.json` (case-insensitive): it calls `readJson`, so it can throw `JSON_READ` or `JSON_PARSE`.
- Anything else: it runs `import(pathToFileURL(dataPath).href)` and returns
  `mod.default ?? mod` (the module namespace if there is no default export).
  Import failures (missing file, syntax error, module that throws) are thrown as
  `MarkupGeneratorError` with code `EIMPORT` and the original error as `cause`.
- Pass absolute paths. `pathToFileURL` resolves relative paths against the cwd.

### `loadContent(contentPath?: string, cwd = process.cwd()): string | null`
Returns `null` when `contentPath` is falsy. Otherwise it reads `resolve(cwd, contentPath)` as UTF-8.
Read failures throw `MarkupGeneratorError` `EREAD` with the original error as `cause` (same for `readSourceFile`).

### `importEsm(specifier: string): Promise<{ default?: unknown }>`
A thin wrapper around native `import()`. The bundler preserves it as-is, so it
also works from the CJS build.

### `type TemplateData = { title?: string; preview?: string; [key: string]: unknown }`

## Testing and building
```bash
pnpm --filter @llazyemail/read test
pnpm --filter @llazyemail/read build
```

Used by: template and the root barrel. Since v4, `gray-matter` comes in
transitively through this package. If your own code imports `gray-matter`
directly, add it to your own `package.json`.
