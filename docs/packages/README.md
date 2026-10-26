# Sub-package documentation (v4)

Reference docs for every package in this pnpm + Turborepo monorepo. Everything
here was written from the source in `packages/*/src` and `src/` at v4.0.0, so it
describes what the code does today, not what it should do. For upgrading from
v3, see [MIGRATION.md](../../MIGRATION.md). For the original v4 plan, see
[docs/v4-monorepo.md](../v4-monorepo.md).

| Package | Published | Purpose | Doc |
|---------|-----------|---------|-----|
| `@llazyemail/fs` | yes | Directory and path helpers (`ensureDir`, `resolveFromCwd`, `pathExists`, `listTemplateFiles`) | [fs.md](./fs.md) |
| `@llazyemail/write` | yes | File writing, unique filenames, `MarkupGeneratorError` | [write.md](./write.md) |
| `@llazyemail/read` | yes | Text, front-matter and JSON reading, data/content loaders, `importEsm` | [read.md](./read.md) |
| `@llazyemail/email` | yes | `writeGeneratedEmail`, which writes to a stable filename and has an optional logger | [email.md](./email.md) |
| `@llazyemail/cli` | yes | `parseArgv`, `runCli` (logic behind the `markup-generator` bin) | [cli.md](./cli.md) |
| `@llazyemail/template` | yes | `generateTemplate`, `TemplateGenerator`, `createGenerator` | [template.md](./template.md) |
| `@llazyemail/core` | **no (private)** | Reserved-name stub | [core.md](./core.md) |
| `markup-generator` (root) | yes | Barrel that re-exports everything, plus the `/browser` subpath and the bin | [markup-generator.md](./markup-generator.md) |

## Architecture

```mermaid
graph TD
  fs["@llazyemail/fs"]
  write["@llazyemail/write"]
  read["@llazyemail/read"]
  email["@llazyemail/email"]
  cli["@llazyemail/cli"]
  template["@llazyemail/template"]
  core["@llazyemail/core (private stub)"]
  root["markup-generator (root barrel)"]
  gm["gray-matter (npm)"]

  write --> fs
  read --> write
  read --> gm
  email --> write
  cli --> write
  template --> cli
  template --> read
  template --> write
  root --> fs
  root --> write
  root --> read
  root --> email
  root --> cli
  root --> template
```

An arrow means "depends on". `@llazyemail/core` has no dependencies and nothing
depends on it.

### Layers

1. **fs**: pure Node `fs`/`path` primitives. It has no workspace dependencies.
   It deliberately throws plain `Error` instead of `MarkupGeneratorError`, which
   avoids an fs↔write dependency cycle.
2. **write**: owns the error type (`MarkupGeneratorError`, `DEFAULT_MESSAGES`)
   and every file write.
3. **read / email / cli**: built on top of write.
4. **template**: combines cli (argv parsing), read (data loading) and write.
5. **root**: re-exports all of the above and adds `markup-generator/browser` and
   the `markup-generator` bin.

### Build order

Turborepo (`turbo.json`) uses `build.dependsOn: ["^build"]`, so the topological
order is:

1. `@llazyemail/fs`, `@llazyemail/core` (no dependencies)
2. `@llazyemail/write`
3. `@llazyemail/read`, `@llazyemail/email`, `@llazyemail/cli` (in parallel)
4. `@llazyemail/template`
5. `markup-generator` (root)

`test` depends on the package's own `build`, and `typecheck` depends on `^build`.

### Common commands

```bash
pnpm install
pnpm turbo:build                                  # turbo run build (all packages)
pnpm turbo:test                                   # turbo run test
pnpm --filter @llazyemail/write build             # one package
pnpm --filter @llazyemail/write test
pnpm --filter @llazyemail/write typecheck
pnpm publish:dry                                  # pnpm -r publish --dry-run
```

Each package builds with
`tsup src/index.ts --no-config --format esm,cjs --dts --clean --target node20 --platform node`.
The output goes to `dist/index.js` (ESM), `dist/index.cjs` (CJS) and
`dist/index.d.ts`. All packages require Node `>=20`. Their `lint` scripts are
placeholders for now.

## Deprecations (removal in v5)

| Deprecated | Package | Replacement |
|------------|---------|-------------|
| `writeHTML(fileName, data, dir?, _message?)` | `@llazyemail/write` | `writeGeneratedFile({ fileName, content, dir })` |
| `isFolderExists(dir)` | `@llazyemail/fs` | `ensureDir(dir)` |

`writingFile` was **removed** in v4. Use `writeGeneratedFile({ content, prefix })` instead.
