# markup-generator AKA WRITE!

Simple TypeScript helper for generating unique filenames and writing HTML (or any text) to disk.
# markup-generator

A small, dependency-light module for writing generated content to files — handles directory creation, UTF-8 defaults, stable/unique filenames, and typed errors, so consuming projects don't have to hand-roll `mkdirSync`/`writeFileSync` logic.

## Installation

```bash
npm install markup-generator
```

Requires **Node 20+**. Ships as a dual CJS/ESM build with bundled TypeScript types.

## Why

Several sibling projects independently reinvented the same file-writing boilerplate — manual directory creation, raw `fs` calls, and ad-hoc error handling. This module centralizes that logic so every consumer gets the same guarantees: missing directories are created automatically, content is validated before writing, and failures come back as a single typed error instead of inconsistent thrown exceptions.

## API

### `writeGeneratedFile({ content, fileName, dir })`

Writes `content` to `dir/fileName`, creating `dir` if it doesn't exist. Defaults to UTF-8 encoding.

```js
const { writeGeneratedFile } = require('markup-generator');

const outPath = await writeGeneratedFile({
  content: '<html>...</html>',
  fileName: 'newsletter.html',
  dir: 'generated',
});
```

Resolves with the absolute path written to. Throws `MarkupGeneratorError` on failure (see [Error handling](#error-handling)).

### `writeGeneratedEmail({ content, fileName, label, dir })`

A higher-level wrapper around `writeGeneratedFile`, purpose-built for email-generation scripts. Adds friendly console logging and graceful failure handling.

```js
const { writeGeneratedEmail } = require('markup-generator');

await writeGeneratedEmail({
  content: renderedHtml,
  fileName: 'hackernoon-email.html',
  label: 'Hackernoon',
});
```

- On success: writes the file and logs a confirmation.
- On `MarkupGeneratorError`: logs `❌ Failed to write <file> [<code>]: <message>`, sets `process.exitCode = 1`, and resolves `undefined` — **does not throw**.
- Any other error type still throws, so unexpected failures aren't silently swallowed.

### `generateFileName(prefix)`

Generates a unique filename by appending a UUID to `prefix`.

```js
const { generateFileName } = require('markup-generator');

generateFileName('hackernoon-email');
// → 'hackernoon-email-3f9c2a10-....html' (illustrative — check exact format in source)
```

> ⚠️ Because this appends a UUID, it produces a **different filename on every call**. Don't use it where a caller expects a stable, predictable filename — pass `fileName` explicitly to `writeGeneratedFile`/`writeGeneratedEmail` instead in that case.

### `readJson(path)` / `writeJson(path, data)`

Typed JSON read/write helpers (`src/json-io.ts`).

```js
const { readJson, writeJson } = require('markup-generator');

const config = await readJson('config.json');
await writeJson('output.json', { updated: true });
```

Throws `MarkupGeneratorError` with code `JSON_READ` (file couldn't be read) or `JSON_PARSE` (invalid JSON) on failure.

### `loadData(path)`

Loads a data module — `.json` files are parsed via `readJson`; `.js`/`.mjs`/`.cjs` files are loaded via dynamic import (CJS-safe, so it works correctly even when bundled/transpiled to CommonJS). Resolved relative to `process.cwd()` unless the path is already absolute.

```js
const { loadData } = require('markup-generator');

const data = await loadData('content/data.js');
```

### `loadContent(path)`

Reads a plain content file (HTML, text, markdown) as a UTF-8 string. Resolved relative to `process.cwd()` unless already absolute.

```js
const { loadContent } = require('markup-generator');

const html = loadContent('templates/fallback.html');
```

### `resolveFromCwd(path)`

Resolves a path relative to `process.cwd()`, unless it's already absolute. Used internally by the read/write helpers above; exported for consumers who want the same resolution behavior in their own scripts.

```js
const { resolveFromCwd } = require('markup-generator');

resolveFromCwd('output/file.html'); // → absolute path
```

### `generateTemplate({ render, argv, cwd, defaultTemplateId, defaultDataPath })`

An end-to-end CLI helper for "render a template, write the result" scripts — parses CLI arguments, loads data/content, calls your `render` function, and writes the output, all in one call.

```js
const { generateTemplate } = require('markup-generator');
const { renderTemplate } = require('./dist/index.cjs.js');

generateTemplate({
  render: renderTemplate,
  argv: process.argv,
  defaultDataPath: 'content/content2.js',
}).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
```

> This bundles CLI parsing, data loading, and rendering-orchestration into one call. If your script's argument format or fallback-content logic diverges from the built-in defaults, use the lower-level `parseArgv`/`loadData`/`loadContent`/`writeGeneratedFile` pieces directly instead.

## Error handling

Every failure from this module is a `MarkupGeneratorError` — a single error class with a `code` field, so callers can branch on failure type without parsing message strings.

```ts
import { MarkupGeneratorError } from 'markup-generator';

try {
  await writeGeneratedFile({ content: '', fileName: 'out.html', dir: 'generated' });
} catch (error) {
  if (error instanceof MarkupGeneratorError) {
    console.error(`[${error.code}] ${error.message}`);
  } else {
    throw error;
  }
}
```

| Code | Meaning |
|---|---|
| `EMPTY_CONTENT` | `content` was an empty string |
| `NOT_A_STRING` | `content` was not a string |
| `FILE_EXISTS` | Target file already exists and wasn't expected to |
| `WRITE_FAILED` | The underlying file write failed |
| `JSON_READ` | A JSON file couldn't be read from disk |
| `JSON_PARSE` | A file's contents were not valid JSON |

## Development

```bash
npm install
npm test        # Vitest
npm run build   # tsup — outputs dual CJS/ESM + type declarations to dist/
npm run lint
```

Test runner: **Vitest** (migrated from Jest). Build tool: **tsup**.

## Migration

See `MIGRATION.md` for breaking-change notes between major versions.

## License

See `LICENSE`.
See [MIGRATION.md](./MIGRATION.md) for 3.0.0 notes.

## License

MIT
