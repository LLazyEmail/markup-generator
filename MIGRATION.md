# Migration to 4.0.0 (v3 → v4)

v4 organizes the codebase as a monorepo with internal `@llazyemail/*` workspace
packages. The **only** package published to npm is still named **`markup-generator`**.
Those workspace modules are bundled into its `dist/`, so `npm install markup-generator`
gives you a fully working package with no `@llazyemail/*` runtime deps (the npm
scope does not need to exist). Most v3 code keeps working with only the changes
listed under *Breaking*. Prefer `import { … } from 'markup-generator'` and
`import { … } from 'markup-generator/browser'`.

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
3. **`gray-matter` is a dependency of `markup-generator`.** Front-matter helpers
   need it at runtime. If your own code imports `gray-matter` directly, you may
   still add it to your own `package.json`, but installing `markup-generator` is
   enough for the library's own `readFrontMatter` / related APIs.
4. **The published tarball is self-contained.** Internal `@llazyemail/*` packages
   are not published (they are `private: true` workspace modules). They are
   bundled into `markup-generator`'s `dist/` at build time. Do not `npm install
   @llazyemail/…` — those packages are not on the registry. Deep imports into
   `markup-generator/dist/*` are not supported; use the public exports (`.` and
   `./browser`).
5. **`parseArgv` / `runCli` are exported from `markup-generator`** (implemented in
   the internal `@llazyemail/cli` module). The root also newly exports `importEsm`,
   `DEFAULT_OUT_DIR`, `OverwritePolicy` and `WriteGeneratedEmailLogger`.

## Deprecated (still work, removed in v5)

| API | Replacement | Why deprecated rather than dropped |
|-----|-------------|------------------------------------|
| `writeHTML(fileName, data, dir)` | `writeGeneratedFile({ fileName, content: data, dir })` | Widely used in v3 consumers and has an exact 1:1 replacement; kept as a thin shim to ease the upgrade. |
| `isFolderExists(dir)` | `ensureDir(dir)` | Zero-cost alias; its name is misleading (it creates the directory, it does not return a boolean). |

## Old → new imports

Everything below is importable from `markup-generator`. The right-hand column is
the **internal** monorepo module name (not a separate npm package).

| v3 (`markup-generator`) | v4 internal module (bundled; not published) |
|-------------------------|-----------------------------------------------|
| `ensureDir`, `isFolderExists` *(deprecated)* | `@llazyemail/fs` |
| `resolveFromCwd`, `pathExists`, `listTemplateFiles` | `@llazyemail/fs` |
| `writeGeneratedFile`, `generateFileName` | `@llazyemail/write` |
| `writeHTML` *(deprecated)* | `@llazyemail/write` |
| `writingFile` | **removed** → `writeGeneratedFile` |
| `MarkupGeneratorError`, `DEFAULT_MESSAGES` | `@llazyemail/write` (error class lives in `@llazyemail/fs`) |
| `readSourceFile`, `readFrontMatter` | `@llazyemail/read` |
| `readJson`, `writeJson`, `loadData`, `loadContent` | `@llazyemail/read` |
| `writeGeneratedEmail` | `@llazyemail/email` |
| `generateTemplate`, `buildFallbackContent` | `@llazyemail/template` |
| `TemplateGenerator`, `createGenerator` | `@llazyemail/template` |
| `parseArgv` / `runCli` | `@llazyemail/cli` |
| `generateFileName` from `markup-generator/browser` | unchanged (`markup-generator/browser`) |
| `npx markup-generator …` (bin) | unchanged |

```ts
// v3
import { writingFile, writeGeneratedEmail } from 'markup-generator';
await writingFile(html, 'newsletter');
await writeGeneratedEmail({ content: html, fileName: 'n.html', label: 'N' });

// v4 — always import from the published package name
import { writeGeneratedFile, writeGeneratedEmail } from 'markup-generator';
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
