# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - Unreleased

### Added
- Dual CJS + ESM build via `tsup`
- Browser-safe entry `markup-generator/browser` (`generateFileName` only)
- Type declarations in `dist/`
- Real ts-jest coverage for filename generation and file writes
- `files` / `exports` fields for a clean npm tarball

### Changed
- `generateTemplateName` renamed to `generateFileName`
- `writeHTML` / `writingFile` are properly async
- Package builder replaced Nx with `tsup`
- GitHub Actions install/test/build the package directly

### Removed
- Incorrect `fs` / `path` npm dependencies
- Rollup as the intended bundler

## [2.7.1] - previous

- Initial TypeScript migration under Nx
