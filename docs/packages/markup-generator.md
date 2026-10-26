# markup-generator (root barrel)

The root package re-exports every `@llazyemail/*` package. It also provides a
browser-safe subpath and the `markup-generator` bin. It depends on fs, write,
read, email, cli and template (`workspace:^`, published as `^4.0.0`). These
dependencies are kept external and are not bundled.

```bash
pnpm add markup-generator
```

```ts
import { writeGeneratedFile, writeGeneratedEmail, readFrontMatter, generateTemplate } from 'markup-generator'; // ESM
const { writeGeneratedFile } = require('markup-generator');                                                  // CJS
import { generateFileName } from 'markup-generator/browser';                                                 // browser
```

## Entry points (`package.json` `exports`)
| Subpath | Files | Contents |
|---------|-------|----------|
| `.` | `dist/index.{js,cjs,d.ts}` | everything below |
| `./browser` | `dist/browser.{js,cjs,d.ts}` (platform `browser`, target es2020) | `generateFileName` **only**, bundled from source |
| bin `markup-generator` | `dist/cli.cjs` | `runCli()` from `@llazyemail/cli`. Errors print the message and exit with code 1. |

Deep imports into `markup-generator/dist/*` are not supported.

## What `.` re-exports
- `export *` from `@llazyemail/fs`, `@llazyemail/write`, `@llazyemail/read`,
  `@llazyemail/email` and `@llazyemail/cli`.
- From `@llazyemail/template` it re-exports these names explicitly:
  `buildFallbackContent`, `generateTemplate`, `TemplateGenerator`,
  `createGenerator`, `DEFAULT_OUT_DIR`, and the types `RenderTemplate`,
  `GenerateTemplateOptions`, `TemplateCatalogEntry`, `GeneratorConfig`,
  `RenderOptions` and `WriteOptions`. This avoids duplicate
  `loadData`/`loadContent`/`TemplateData` exports, which already come from read.

See each package doc for signatures. The deprecated `writeHTML` and
`isFolderExists` are still exported and will be removed in v5. `writingFile`
was removed. See [MIGRATION.md](../../MIGRATION.md).

## Scripts
```bash
pnpm build        # tsup (root tsup.config.ts: index, browser, cli)
pnpm test         # vitest run (root tests/)
pnpm typecheck
pnpm example      # tsx examples/write-newsletter.ts
pnpm turbo:build / turbo:test / turbo:lint
pnpm publish:dry
```
`prepublishOnly` runs `turbo run build test`.
