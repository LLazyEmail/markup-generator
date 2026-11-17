# v4 monorepo (Phases 0–5)

Related: [#272 Re-organization Version #4](https://github.com/LLazyEmail/markup-generator/issues/272), [#270 writeGeneratedEmail vs writeGeneratedFile](https://github.com/LLazyEmail/markup-generator/issues/270), [#278 gray-matter / Dependabot](https://github.com/LLazyEmail/markup-generator/issues/278).

## Phase 0 — scaffold

pnpm workspaces + Turborepo layout. Stub packages under `packages/*` (`private: true`). Real library still at repo root until each phase extracts it.

## Phase 1 — extract `@llazyemail/fs` and `@llazyemail/write`

Real implementations (not stubs):

| Package | Contents |
|---------|----------|
| `@llazyemail/fs` | `ensureDir`, `isFolderExists`, `resolveFromCwd`, `pathExists`, `listTemplateFiles` (no gray-matter / `readFrontMatter`) |
| `@llazyemail/write` | `writeGeneratedFile`, `writeHTML` (deprecated in Phase 4), `writingFile` (removed in Phase 4), `generateFileName`, `MarkupGeneratorError`, `DEFAULT_MESSAGES`, write types |

## Phase 2 — extract `@llazyemail/read`

| Package | Contents |
|---------|----------|
| `@llazyemail/read` | `readSourceFile`, `readFrontMatter`, `readJson`, `writeJson`, `loadData`, `loadContent`, `importEsm`, `TemplateData` |

**`gray-matter` is imported only by `@llazyemail/read` in the monorepo.** The root `markup-generator` package also lists it so the self-contained npm tarball resolves front-matter at runtime (see #278 — keep/document; advisory withdrawn).

## Phase 3 — extract `@llazyemail/email`, `@llazyemail/template`, `@llazyemail/cli`

| Package | Contents |
|---------|----------|
| `@llazyemail/email` | `writeGeneratedEmail` (stable filename + optional `logger` / `exitCode`; builds on `@llazyemail/write`) |
| `@llazyemail/template` | `generateTemplate`, `buildFallbackContent`, `TemplateGenerator`, `createGenerator` — **write unified onto `@llazyemail/write`** (`TemplateGenerator.write` / `generateTemplate` call `writeGeneratedFile`, not raw `fs.writeFileSync`) |
| `@llazyemail/cli` | `parseArgv` / `CliArgs`, `runCli` (root bin entrypoint logic) |

Root still **re-exports** the same public symbols via `workspace:*` so existing consumers of `markup-generator` keep working. Root `tsup` inlines `@llazyemail/*` (including the CLI entry).

```bash
pnpm install
pnpm exec turbo run build test
pnpm exec tsc --noEmit
```

## Phase 4 — core barrel, published as one self-contained package

What actually shipped as `markup-generator@4.0.0` (npm, 2026-10-29) and `4.1.0` (npm, 2026-11-03). The original Phase 4 plan below (publishing each `@llazyemail/*` package separately) was **not** what was released; see [Superseded Phase 4 plan](#superseded-phase-4-plan-scoped-packages).

- Root `markup-generator` is the **core barrel** and the **only** package on npm: `src/index.ts` re-exports `@llazyemail/{fs,write,read,email,cli}` (`export *`) and `@llazyemail/template` (explicit list, to avoid duplicate `loadData` / `loadContent` / `TemplateData`). The bin (`dist/cli.cjs`) and the `./browser` subpath (`generateFileName` only) are kept.
- Root `tsup.config.ts` **bundles** the workspace packages (`noExternal: [/^@llazyemail\//]`) into `dist/`, so the tarball has **zero** `@llazyemail/*` runtime dependencies. Its only runtime dependency is `gray-matter`. Output extensions are `.cjs` / `.js` to match `exports` / `bin`.
- Workspace packages under `packages/*` stay **`private: true`** at `4.0.0`. They still have their own `tsup --no-config` build (ESM + CJS + `.d.ts`) and tests for the monorepo, and still carry `publishConfig.access: public`, but npm and pnpm skip private packages, so they are never published. The `@llazyemail` npm scope does not need to exist.
- `@llazyemail/core` stays a private reserved-name stub (the root package is the core barrel).
- Legacy APIs: `writeHTML` and `isFolderExists` deprecated (`@deprecated` JSDoc, removed in v5); `writingFile` removed.
- Publishing: `.github/workflows/npm-publish.yml` runs on a published GitHub Release (or manual dispatch, dry run by default). It builds and tests, then runs `pnpm -r publish --access public --provenance` with npm trusted publishing (OIDC). Because the workspace packages are private, that publishes only `markup-generator` and skips a version already on npm. Local check: `pnpm run publish:dry`.
- Versioning: Changesets (#349). `pnpm changeset` adds a note; the Version Packages PR bumps `package.json` and moves `CHANGELOG.md`'s `[Unreleased]` entries into a release.

See [MIGRATION.md](../MIGRATION.md) for the v3 → v4 upgrade guide and the [CHANGELOG](../CHANGELOG.md) for the 4.0.0 / 4.1.0 entries.

## Package map

| Package | Role | Status |
|---------|------|--------|
| `markup-generator` (root) | Core barrel (bundles all) + bin + `./browser` | **Published** — only public package; 4.1.0 on npm |
| `@llazyemail/fs` | FS primitives | Private, bundled — real code + tests (Phase 1) |
| `@llazyemail/write` | Write helpers | Private, bundled — real code + tests (Phase 1) |
| `@llazyemail/read` | Read helpers (+ gray-matter) | Private, bundled — real code + tests (Phase 2) |
| `@llazyemail/email` | Email-oriented wrappers | Private, bundled — real code + tests (Phase 3) |
| `@llazyemail/cli` | CLI / argv / bin | Private, bundled — real code + tests (Phase 3) |
| `@llazyemail/template` | Template generation | Private, bundled — real code + tests (Phase 3) |
| `@llazyemail/core` | Reserved name | Private stub (not bundled, not published) |

All `@llazyemail/*` packages are `private: true` workspace modules at 4.0.0. None is published to npm; the six with code are bundled into `markup-generator`'s `dist/`. Per-package reference: [docs/packages/](./packages/README.md).

## Phase 5 — housekeeping (done)

- Nx remnant (`write/`) removed; Turborepo is the only task runner
- `old/` removed; useful content preserved in [legacy-notes.md](./legacy-notes.md) and [future-ideas.md](./future-ideas.md)

## Explicitly not done yet

- ~~No actual npm publish yet (dry run only)~~ Done: `markup-generator` 4.0.0 and 4.1.0 are on npm (self-contained model above).
- v5: remove the deprecated `writeHTML` and `isFolderExists`.
- Release the CHANGELOG `[Unreleased]` section through a Changesets Version Packages PR.

## CI smoke test

A dedicated workflow uses email-template-workflows@v3 to generate a sample file and upload it as an artifact.

## Superseded Phase 4 plan (scoped packages)

Kept for history; this is what Phase 4 originally proposed and was **not** released. The 4.1.0 CHANGELOG entry records the switch to the self-contained model.

<details>
<summary>Original Phase 4 text</summary>

- Root `markup-generator@4.0.0` is the **core barrel**: `src/index.ts` re-exports `@llazyemail/{fs,write,read,email,cli}` (`export *`) and `@llazyemail/template` (explicit list, to avoid duplicate `loadData` / `loadContent` / `TemplateData`). The bin (`dist/cli.cjs`) and `./browser` subpath (`generateFileName` only) are kept.
- Root `tsup` no longer inlines `@llazyemail/*`; they are real `dependencies` (`workspace:^` → `^4.0.0` on publish). Output extensions fixed to `.cjs` / `.js`.
- Scoped packages: `private` removed, `version: 4.0.0`, `publishConfig.access: public`, built with `tsup --no-config` to ESM + CJS + `.d.ts` (the previous `tsc` output used extensionless ESM imports and was not runnable from Node).
- `@llazyemail/core` stays a **private stub** (the root package is the core barrel).
- Legacy APIs: `writeHTML` and `isFolderExists` deprecated (`@deprecated` JSDoc, removed in v5); `writingFile` removed.
- Publishing: `.github/workflows/npm-publish.yml` runs `pnpm -r publish`, which publishes in topological order (fs → write → cli/email/read → template → markup-generator) and skips versions already on npm. Local check: `pnpm run publish:dry`.

See [MIGRATION.md](../MIGRATION.md) for the v3 → v4 upgrade guide.

</details>
