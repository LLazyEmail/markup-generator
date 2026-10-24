# Migration to 4.0.0 (v3 → v4)

v4 splits the library into scoped packages (`@llazyemail/*`). The root
`markup-generator` package is now a **core barrel** that re-exports all of them,
so most v3 code keeps working with only the changes listed under *Breaking*.

Related: [#272 Re-organization Version #4](https://github.com/LLazyEmail/markup-generator/issues/272).

## Breaking

1. **`writingFile` was removed.** Use `writeGeneratedFile({ content, prefix })`
   (it also returns the absolute path that was written).
2. **`writeGeneratedEmail` is silent by default.** v3 logged `✅ …` / `❌ …` to the
   console. In v4 nothing is logged unless you pass a logger:
   ```ts
   await writeGeneratedEmail({ content, fileName, label, logger: console });
   ```
   The return value and `process.exitCode = 1` behaviour on `MarkupGeneratorError`
   are unchanged.
3. **`gray-matter` lives only in `@llazyemail/read`.** `markup-generator` no longer
   bundles it; it is installed transitively through `@llazyemail/read`. If your own
   code imports `gray-matter` directly, add it to your own `package.json`.
4. **The root no longer inlines its internals.** `markup-generator` depends on the
   published `@llazyemail/*` packages (`^4.0.0`) instead of shipping a single
   bundled file. Deep imports into `markup-generator/dist/*` are not supported.
5. **`parseArgv` now comes from `@llazyemail/cli`** (still re-exported by the root).
   The root also newly exports `runCli`, `importEsm`, `DEFAULT_OUT_DIR`,
   `OverwritePolicy` and `WriteGeneratedEmailLogger`.

## Deprecated (still work, removed in v5)

| API | Replacement | Why deprecated rather than dropped |
|-----|-------------|------------------------------------|
| `writeHTML(fileName, data, dir)` | `writeGeneratedFile({ fileName, content: data, dir })` | Widely used in v3 consumers and has an exact 1:1 replacement; kept as a thin shim to ease the upgrade. |
| `isFolderExists(dir)` | `ensureDir(dir)` | Zero-cost alias; its name is misleading (it creates the directory, it does not return a boolean). |

## Old → new imports

Everything below is still importable from `markup-generator`; the right-hand
column is where it lives now if you want the smaller scoped package.

| v3 (`markup-generator`) | v4 scoped package |
|-------------------------|-------------------|
| `ensureDir`, `isFolderExists` *(deprecated)* | `@llazyemail/fs` |
| `resolveFromCwd`, `pathExists`, `listTemplateFiles` | `@llazyemail/fs` |
| `writeGeneratedFile`, `generateFileName` | `@llazyemail/write` |
| `writeHTML` *(deprecated)* | `@llazyemail/write` |
| `writingFile` | **removed** → `writeGeneratedFile` from `@llazyemail/write` |
| `MarkupGeneratorError`, `DEFAULT_MESSAGES` | `@llazyemail/write` |
| `readSourceFile`, `readFrontMatter` | `@llazyemail/read` |
| `readJson`, `writeJson`, `loadData`, `loadContent` | `@llazyemail/read` |
| `writeGeneratedEmail` | `@llazyemail/email` |
| `generateTemplate`, `buildFallbackContent` | `@llazyemail/template` |
| `TemplateGenerator`, `createGenerator` | `@llazyemail/template` |
| `parseArgv` | `@llazyemail/cli` |
| `generateFileName` from `markup-generator/browser` | unchanged (`markup-generator/browser`) |
| `npx markup-generator …` (bin) | unchanged |

```ts
// v3
import { writingFile, writeGeneratedEmail } from 'markup-generator';
await writingFile(html, 'newsletter');
await writeGeneratedEmail({ content: html, fileName: 'n.html', label: 'N' });

// v4
import { writeGeneratedFile } from '@llazyemail/write';
import { writeGeneratedEmail } from '@llazyemail/email';
await writeGeneratedFile({ content: html, prefix: 'newsletter' });
await writeGeneratedEmail({ content: html, fileName: 'n.html', label: 'N', logger: console });
```

---

# Migration to 3.0.0

## Breaking

- `generateTemplateName` was renamed to `generateFileName`
- `writeHTML` and `writingFile` are async and must be awaited
- filenames now use `crypto.randomUUID()`, not `Date.now()`
- package lives at the repository root (no Nx workspace)

## Preferred API

```ts
import { writeGeneratedFile, MarkupGeneratorError } from 'markup-generator';

try {
  await writeGeneratedFile({
    content: '<html></html>',
    prefix: 'newsletter',
    overwrite: 'error',
  });
} catch (error) {
  if (error instanceof MarkupGeneratorError) {
    console.error(error.code, error.message);
  }
}
```

## Error codes

- `EMPTY_CONTENT`
- `NOT_A_STRING`
- `FILE_EXISTS`
- `WRITE_FAILED`

## CLI

```bash
npx markup-generator name --prefix newsletter
npx markup-generator write --file ./in.html --prefix newsletter --dir generated
```
