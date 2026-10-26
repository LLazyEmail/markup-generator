# Legacy notes (pre-v4 `old/` and Nx `write/` folders)

These folders were removed in Phase 5 of the v4 migration. This page records what
they contained so nothing useful is lost. Full originals remain in git history
(any commit before the Phase 5 PR).

## `old/` — original JavaScript implementation

| Original file | What it was |
| --- | --- |
| `old/index.js` | Barrel of the pre-TypeScript package. Exported `writeHTML`, `writingFile`, `generateFileName`, `readSourceFile`, `isFolderExists`, `catchErrorTraceOutput` and the CLI helpers below. Superseded by `@llazyemail/write`, `@llazyemail/read`, `@llazyemail/fs`, `@llazyemail/cli`. |
| `old/command-line-methods.js` | CLI validation/printing helpers (chalk + lodash): `checkWarnings`, `checkErrors`, `checkHtml`, `printMessage`, `checkingTitle`, `checkingBodyContent`, `checkingPreviewText`, and an unfinished `stateInit` "singleton". |
| `old/constants.js` | Message strings used by the helpers above (see below). Some used template variables never in scope, so the file was broken as-is. |
| `old/source.md` | Sample HackerNoon newsletter ("Secrets Of High-Performing Teams: Part II") used as a real-world markdown input fixture; uses `[separator]`, a `#~` preview line and `![a][b][c]` meme-image syntax. |
| `old/03-source-frontmatter.md`, `old/03-source-frontmatter 1.md` | Identical (duplicate) sample: a "No More To-Go" weekly-menu email with a YAML front-matter `recipes:` list (title / subtitle / image / link per day). Fixture for front-matter parsing. |

### Legacy API behaviour worth remembering

- **`checkWarnings(warnings)`** — for each non-zero counter prints
  `WARNING source.md has <n> <element>. Replace it with memes` (yellow).
- **`checkErrors(errors)`** — if any required section flag is `false`, prints
  `ERROR source.md doesn't have <section>` per missing one, then
  `The full template has not been parsed!` (bold red), returns `true`.
- **`checkHtml(content)`** — crude sanity check: takes ~5000 chars after a marker
  (`<h1 class="mc-toc-title"` when `process.env.noAdv`, otherwise
  `</table></span></span></div>`) and tests for `<table|<tr>|<td|<tbody>`; prints
  `Content has correct html!!!` / `Content has not correct html!!!`.
- **`printMessage({ message, type })`** — colour switch: `yellow`, `red`, `red2`
  (bold), `green1`, `green2` (bold). Callers passed positional args, so it was buggy.
- **Template option guards** — throw if missing:
  - `` `title` is a required option for `renderTemplate` ``
  - `` `bodyContent` is a required option for `renderTemplate` ``
  - `` `previewText` is a required option for `renderTemplate` ``
- Other constants: `CONST_FILE_NOT_WRITTEN = 'file not written'`.

## `write/` — Nx workspace remnant

Only three test files were still tracked under `write/packages/write-module/`:

| Original file | What it was |
| --- | --- |
| `src/lib/frontmatter.spec.ts` | Jest-style test of `readFrontMatter` / `readSourceFile` against `03-source-frontmatter.md`. Equivalent coverage now lives in `@llazyemail/read`. |
| `tests/index.test.ts` | Old barrel export / `generateFileName` tests — covered by `packages/write` and root `tests/`. |
| `tests/write-generated-file.test.ts` | Old `writingFile` disk-write test — covered by `packages/write`. |

Nx (`nx.json`, `project.json`, `@nrwl/*`, `.nx` cache) is no longer used; Turborepo
(`turbo.json`) is the only task runner.
