# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `createConsoleLogger` in `@llazyemail/fs` (uses `formatMarkupError`).
- `validateTemplateData` / `hasErrors` in `@llazyemail/template` for structured title/preview/bodyContent checks.
- Source aliases in root `vitest.config.ts` so coverage instruments TypeScript sources.
- AI agent rule in `AGENTS.md`: always return full GitHub links for branches, PRs, issues, and commits.

### Changed
- CLI `runCli` uses the logger; failures set `process.exitCode` and write to stderr instead of throwing.
- Coverage thresholds re-enabled at modest levels after the alias fix.


## [4.1.0] - 2026-11-03

Published to npm as `markup-generator@4.1.0` on 2026-11-03 (see npm `time["4.1.0"]`).

### Changed
- Docs, MIGRATION, and package metadata aligned with the **self-contained** publish model: only `markup-generator` is on npm; `@llazyemail/*` workspace packages stay `private: true` and are bundled into `dist/`.
- Maintenance: Renovate weekly + automerge for low-risk updates; `@types/node` and GitHub Actions bumps.

### Notes
- No public API break versus 4.0.0. See `MIGRATION.md` (§ 4.0.0 → 4.1.0).

## [4.0.0] - 2026-10-29

Published to npm as `markup-generator@4.0.0` on 2026-10-29 (see npm `time["4.0.0"]`).


### Changed
- `markup-generator` is the **only** published npm package (name stays `markup-generator`). Install with `npm install markup-generator`.
- Internal workspace modules keep the `@llazyemail/*` names but are `private: true` and are **bundled into** the root `dist/` via tsup `noExternal` — the published tarball has **zero** `@llazyemail/*` runtime dependencies.
- `gray-matter` is a direct dependency of the root package (needed at runtime for front-matter helpers).
- `writeGeneratedEmail` is silent by default; pass `logger: console`
- Root build emits `.cjs`/`.js` matching `exports`/`bin`, plus `./browser` and the `markup-generator` CLI bin

### Deprecated
- `writeHTML` (use `writeGeneratedFile`), `isFolderExists` (use `ensureDir`)

### Removed
- `writingFile` (use `writeGeneratedFile({ content, prefix })`)

See MIGRATION.md.

## [3.0.0] - 2026-09-13

Published to npm as `markup-generator@3.0.0` on 2026-09-13.


### Added
- Dual CJS + ESM build via `tsup`
- Browser-safe entry `markup-generator/browser` (`generateFileName` only)
- Type declarations in `dist/`
- Real ts-jest coverage for filename generation and file writes
- `files` / `exports` fields for a clean npm tarball

### Changed
- `generateTemplateName` renamed to `generateFileName`
- `writeHTML` / `writingFile` are properly async
- Package now lives at the repository root
- GitHub Actions install/test/build from the repo root

### Removed
- Nx workspace under `write/`
- Incorrect `fs` / `path` npm dependencies
- Rollup as the intended bundler

## [2.7.1] - previous

- Initial TypeScript migration under Nx

### Changed
- Documentation expanded around using this module as the write layer for larger pipelines.

