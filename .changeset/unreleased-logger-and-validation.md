---
'markup-generator': minor
---

Ship the November work that was sitting under `[Unreleased]` in CHANGELOG.md.

### Added

- `createConsoleLogger` in the internal `@llazyemail/fs` module (uses `formatMarkupError`).
- `validateTemplateData` / `hasErrors` in the internal `@llazyemail/template` module for structured title/preview/bodyContent checks.

### Changed

- CLI `runCli` uses the logger; failures set `process.exitCode` and write to stderr instead of throwing.

No public API is removed. `writeHTML` and `isFolderExists` stay deprecated and are scheduled for removal in 5.0.0 (see `docs/v5-deprecation-plan.md`).
