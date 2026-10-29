# @llazyemail/write

This package writes text and HTML to disk, generates unique filenames, and
defines the shared error type. It depends on `@llazyemail/fs`, which provides
`ensureDir`. It is Node-only, except for `generateFileName`, which also works in
browsers.

```bash
npm install markup-generator
# (internal module @llazyemail/write is bundled; not published separately)
```

```ts
import { writeGeneratedFile, generateFileName, MarkupGeneratorError } from 'markup-generator'; // ESM
const { writeGeneratedFile } = require('markup-generator');                                     // CJS
```

## Exports

### `writeGeneratedFile(options: WriteGeneratedFileOptions): Promise<string>`
This is the preferred writer. It resolves to the **absolute path** of the file
it wrote.

```ts
type OverwritePolicy = 'overwrite' | 'error';
interface WriteGeneratedFileOptions {
  content: string;            // required, non-empty string
  dir?: string;               // default 'generated' ('' also → 'generated'), resolved from cwd
  fileName?: string;          // exact name; if omitted/'' a unique name is generated
  prefix?: string;            // used only when fileName is absent; default 'file'
  ext?: string;               // used only when fileName is absent; default 'html'
  overwrite?: OverwritePolicy; // default behaves as 'overwrite'
}
```

Behaviour:
- If there is no `fileName`, it uses `generateFileName(prefix || 'file', ext || 'html')`,
  which produces `prefix-<uuid>.html`.
- If `overwrite: 'error'` is set and the target exists, it throws
  `MarkupGeneratorError('FILE_EXISTS', 'file already exists: <abs>')`. **This
  check runs before content validation.**
- If `content` is empty (or falsy), it throws `EMPTY_CONTENT`. If `content` is
  not a string, it throws `NOT_A_STRING`.
- It creates missing directories through `ensureDir`.
- Any `writeFile` failure is thrown as `WRITE_FAILED` with the default message.
  The original error is discarded.
- `fileName` may contain subpaths (`a/b.html`), but only `dir` gets created
  automatically, so a missing `dir/a/` causes a `WRITE_FAILED`.

```ts
const p1 = await writeGeneratedFile({ content: html, prefix: 'newsletter' });
// /cwd/generated/newsletter-1b9d…​.html
const p2 = await writeGeneratedFile({ content: html, fileName: 'hn.html', dir: 'out', overwrite: 'error' });
```

### `generateFileName(suffix: string, ext = 'html'): string`
Returns `` `${suffix}-${crypto.randomUUID()}.${ext}` `` and uses
`globalThis.crypto`, so it runs in both Node 20+ and browsers. Passing
A leading dot is stripped (`'.txt'` → `x-uuid.txt`); an empty or dot-only `ext` falls back to `'html'`.
The same function is exposed as `markup-generator/browser`.

### `writeHTML(fileName, data, dir = 'generated', _message = ''): Promise<void>` (deprecated)
This is a compatibility shim and will be removed in v5. It validates the same
way as `writeGeneratedFile`, but it **returns `void`**, does not support
`overwrite: 'error'`, and ignores `_message` (nothing is logged). Use
`writeGeneratedFile({ fileName, content: data, dir })` instead.

### `MarkupGeneratorError`
```ts
class MarkupGeneratorError extends Error {
  readonly code: MarkupGeneratorErrorCode;
  readonly cause?: unknown; // underlying error, when there is one
  constructor(code: MarkupGeneratorErrorCode, message?: string, options?: { cause?: unknown }); // default DEFAULT_MESSAGES[code]
  // name === 'MarkupGeneratorError'
}
type MarkupGeneratorErrorCode =
  'EMPTY_CONTENT' | 'NOT_A_STRING' | 'FILE_EXISTS' | 'WRITE_FAILED' |
  'JSON_READ' | 'JSON_PARSE' | 'EIMPORT' | 'EREAD';
```

### `DEFAULT_MESSAGES: Record<MarkupGeneratorErrorCode, string>`
| Code | Default message | Thrown by |
|------|-----------------|-----------|
| EMPTY_CONTENT | content variable is empty | write |
| NOT_A_STRING | content variable is not a string | write |
| FILE_EXISTS | file already exists | write (`overwrite: 'error'`) |
| WRITE_FAILED | file not written | write (`cause` = fs error) |
| JSON_READ | failed to read JSON file | read (`readJson`, `cause` set) |
| JSON_PARSE | failed to parse JSON file | read (`readJson`, `cause` set) |
| EIMPORT | failed to import module | read (`loadData` for non-JSON modules) |
| EREAD | failed to read path | read (`loadContent`, `readSourceFile`), fs (`listTemplateFiles`) |

```ts
try { await writeGeneratedFile({ content: '' }); }
catch (e) { if (e instanceof MarkupGeneratorError && e.code === 'EMPTY_CONTENT') { /* … */ } }
```

## Testing and building
```bash
pnpm --filter @llazyemail/write test
pnpm --filter @llazyemail/write build
```

Used by: read, email, cli, template and the root barrel.
