# @llazyemail/fs

FS primitives for markup-generator (ensureDir, resolveFromCwd, pathExists, listTemplateFiles).

Also exports:

- `formatMarkupError(err)` — stable one-line summary of a failure.
- `createConsoleLogger({ verbose, stdout, stderr })` — tiny optional logger that uses `formatMarkupError` for errors.

Part of the [markup-generator](https://github.com/LLazyEmail/markup-generator) v4 monorepo. Most consumers should install `markup-generator`, which re-exports every `@llazyemail/*` package. See [MIGRATION.md](https://github.com/LLazyEmail/markup-generator/blob/main/MIGRATION.md).

MIT
