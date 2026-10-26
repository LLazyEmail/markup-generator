# @llazyemail/fs

Filesystem and path primitives. This package has no workspace dependencies and
uses only `node:fs` and `node:path`. It is Node-only.

```bash
pnpm add @llazyemail/fs
```

```ts
import { ensureDir, resolveFromCwd, pathExists, listTemplateFiles } from '@llazyemail/fs'; // ESM
const { ensureDir } = require('@llazyemail/fs');                                            // CJS
```

## Exports

### `ensureDir(dir: string): void`
Creates `dir` recursively (`mkdirSync(dir, { recursive: true })`) if it does not
exist. If it already exists, nothing happens. A relative `dir` is resolved
against `process.cwd()`. Errors from `mkdirSync` (for example EACCES, or a file
already sitting at that path) are thrown as they are.

### `isFolderExists` (deprecated)
`export const isFolderExists = ensureDir`. This alias **creates** the directory
and returns `void`. It does not return a boolean. It is deprecated since 4.0.0
and will be removed in v5.

### `resolveFromCwd(filePath: string): string`
`path.resolve(process.cwd(), filePath)`. Absolute inputs come back normalised
and otherwise unchanged.

### `pathExists(filePath: string): boolean`
`existsSync(resolveFromCwd(filePath))`. Works for files and directories. It
never throws.

### `listTemplateFiles(dir: string, options?: ListTemplateFilesOptions): string[]`

```ts
type ListTemplateFilesOptions = {
  skipFiles?: Iterable<string>; // default: index.js, index2.js, registry.ts, registry.js
  extensions?: RegExp;          // default: /\.(ts|js)$/
};
```

- `dir` is resolved from the cwd. **If the directory is missing, it returns `[]`**
  instead of throwing.
- It excludes names in `skipFiles` and any name matching `/LATER\./i`.
- It keeps only names that match `extensions`. The result is sorted
  lexicographically (`Array.prototype.sort`).
- Only the top level is listed, and directory entries are not filtered by type.
- If `readdirSync` fails, it throws a **plain `Error`**:
  `Failed to read directory "<abs>": <reason>`. It does not throw
  `MarkupGeneratorError`, because that would create a dependency cycle.
- Passing `skipFiles` **replaces** the default skip list. It does not add to it.

```ts
listTemplateFiles('src/templates');                                   // ['a.ts', 'b.js']
listTemplateFiles('src/templates', { extensions: /\.mjml$/, skipFiles: [] });
```

## Testing and building
```bash
pnpm --filter @llazyemail/fs test        # vitest run (packages/fs/tests)
pnpm --filter @llazyemail/fs build
pnpm --filter @llazyemail/fs typecheck
```

Used by: `@llazyemail/write` (`ensureDir`) and the root barrel.
