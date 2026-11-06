# Using markup-generator as the core of a larger project

`markup-generator` is intentionally small and dependency-light. It owns the
boring, error-prone parts of "render something → write a file with a stable
name, create directories, surface typed errors". Everything else (template
engines, data sources, email APIs, design systems) stays in the consuming
project.

This guide shows the recommended shape when you want to build a separate
project (newsletter pipeline, static site generator, report renderer, etc.)
that treats this module as critical infrastructure.

## Recommended architecture

```
your-project/
├── src/
│   ├── render/          # your templates / components
│   ├── data/            # loaders that call markup-generator's loadData / loadContent
│   ├── pipeline.ts      # orchestrates: load → render → writeGeneratedFile / writeGeneratedEmail
│   └── cli.ts           # thin wrapper around generateTemplate or runCli
├── generated/           # output (gitignored)
└── package.json         # depends on markup-generator
```

### Key pieces you should use

| Need | Function | Notes |
|------|----------|-------|
| Write HTML / text | `writeGeneratedFile` | Throws `MarkupGeneratorError`. Prefer this in libraries. |
| Write from a CLI script | `writeGeneratedEmail` | Optional logger; sets `process.exitCode` on failure. |
| Stable unique names | `generateFileName` | UUID suffix. Use only when you really want uniqueness. |
| Load JSON / JS data | `loadData` | CJS-safe dynamic import for `.js` modules. |
| Load raw content | `loadContent` | UTF-8 string. |
| Full CLI flow | `generateTemplate` | Parses argv, loads data, calls your render fn, writes. |
| Typed failures | `MarkupGeneratorError` | Always check `instanceof` + `error.code`. |

## Minimal pipeline example

```ts
// src/pipeline.ts
import { writeGeneratedFile, MarkupGeneratorError } from 'markup-generator';

export async function buildOne(opts: {
  content: string;
  fileName: string;
  dir?: string;
}) {
  try {
    const path = await writeGeneratedFile({
      content: opts.content,
      fileName: opts.fileName,
      dir: opts.dir ?? 'generated',
    });
    return { ok: true as const, path };
  } catch (err) {
    if (err instanceof MarkupGeneratorError) {
      return { ok: false as const, code: err.code, message: err.message };
    }
    throw err;
  }
}
```

## What this module deliberately does *not* do

- Template rendering (use Lit, Handlebars, MJML, React Email, etc.).
- Sending email (use your ESP SDK).
- Watching files or serving a preview.
- Managing a registry of many templates (keep that in your project).

Keeping those out makes `markup-generator` easy to upgrade and easy to
replace later if you outgrow it.

## Migration / upgrade notes

See `MIGRATION.md` and `docs/v4-upgrade-plan.md`. When you depend on this
module from another repo, pin a major version and re-read the migration
guide on every major bump.

## Testing your pipeline against this module

Because the write helpers are pure (they only touch the filesystem), you can:

1. Point `dir` at a `tmp` directory in tests.
2. Assert on the returned absolute path and the file contents.
3. Force failures (empty content, existing file, permission errors) and
   assert on the `MarkupGeneratorError` code.

This is the same pattern used in `packages/write/tests/` and
`packages/email/tests/`.

## Related old issues

- #17 (save methods from outside) — the current design already supports
  injecting your own writer if you wrap `writeGeneratedFile`. No extra
  dependency on `save-file` is required.
- #153 — the testing helpers that lived in other repos have been largely
  superseded by the typed errors + temp-dir tests shown above.

## Structured validation

Before writing, you can run the pure validator from `@llazyemail/template`:

```ts
import { validateTemplateData, hasErrors } from 'markup-generator';

const results = validateTemplateData({ title: '', preview: 123 });
if (hasErrors(results)) {
  // present results however you like
  console.error(results);
}
```

This returns `{ level: 'error' | 'warning', message, field? }[]` and never prints itself.
