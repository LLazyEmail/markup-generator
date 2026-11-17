# v5 deprecation plan

Status: **plan only**. Nothing here is released. Tracking issue: [#353](https://github.com/LLazyEmail/markup-generator/issues/353).

v5.0.0 is the major release that removes the APIs deprecated in 4.0.0. This page lists what goes, what replaces it, who is affected, and the order of steps. It extends [MIGRATION.md](../MIGRATION.md) (§ "Deprecated (still work, removed in v5)") and does not replace it.

## 1. Ship the `[Unreleased]` work first (4.2.0)

The CHANGELOG `[Unreleased]` section holds additions that never reached npm (latest published: `markup-generator@4.1.0`). They are non-breaking, so they go out as a **minor** before v5:

- The changeset `.changeset/unreleased-logger-and-validation.md` (type `minor`) describes them.
- After it is on `main`, `.github/workflows/changesets.yml` opens a **Version packages** PR that bumps `package.json` to 4.2.0 and writes the changelog section.
- Merging that Version packages PR is the release step: the same workflow then runs `pnpm run release` (`changeset publish`, needs the `NPM_TOKEN` secret) and creates a GitHub Release. Nobody should merge it without meaning to publish.
- When the Version packages PR is open, check `CHANGELOG.md`: Changesets writes its own `## 4.2.0` section, so the hand-written `[Unreleased]` entries should be folded into it in that PR (do not duplicate them).

Note: `npm-publish.yml` also publishes on `release: published`. A release created by `changesets/action` with `GITHUB_TOKEN` does not trigger other workflows, so the two paths do not double-publish today. If the release token changes, revisit this.

## 2. What v5 removes

| Removed in 5.0.0 | Deprecated since | Replacement | Notes |
|------------------|------------------|-------------|-------|
| `writeHTML(fileName, data, dir?, _message?)` | 4.0.0 (`@deprecated` JSDoc in `packages/write/src/write.ts`) | `writeGeneratedFile({ fileName, content: data, dir })` | 1:1 replacement. `writeGeneratedFile` returns the absolute path and supports `overwrite: 'error'`. The ignored 4th `_message` argument goes away with it. |
| `isFolderExists(dir)` | 4.0.0 (alias of `ensureDir` in `@llazyemail/fs`) | `ensureDir(dir)` | Same function today (`isFolderExists === ensureDir`). Its name is misleading: it creates the folder. |

`writingFile` was already removed in 4.0.0. No other API is planned for removal in v5. Anything else must be deprecated in a 4.x minor first.

## 3. Who is affected (checked 2026-11-16)

GitHub code search across `LLazyEmail` for the two names, outside this repo:

| Repo | Uses | Depends on | Impact of v5 |
|------|------|------------|--------------|
| [markdown-to-email](https://github.com/LLazyEmail/markdown-to-email) | `writeHTML`, `isFolderExists` imported from `markup-generator` in `start.js`, `src/domain/write/index.js`, `src/helper/index.js` | `markup-generator@^2.7.0` | None until it upgrades past 2.x. When it does, both calls need the replacements above. |
| [generate-template](https://github.com/LLazyEmail/generate-template) | match in `src/engine/generator.ts` is not an import from `markup-generator` | `markup-generator@^4.1.0` | Re-check before v5; no change expected. |
| [documentation](https://github.com/LLazyEmail/documentation) | mentions in markdown-to-email TODO pages | — | Docs only. |
| `hn_email_template` | `archive/legacy/...` file | — | Archived code, not built. |

Re-run the search before cutting v5: `gh search code "writeHTML org:LLazyEmail"` and `gh search code "isFolderExists org:LLazyEmail"`.

## 4. Steps for the v5 PR (when it is time)

1. Optional, in a 4.x minor: make `writeHTML` and `isFolderExists` print a one-time `process.emitWarning(..., 'DeprecationWarning')` so consumers see it at runtime, not only in JSDoc. Add a changeset (`minor`).
2. In the v5 PR:
   - delete `writeHTML` from `packages/write/src/write.ts` and its export from `packages/write/src/index.ts` and the root barrel;
   - delete the `isFolderExists` alias from `@llazyemail/fs` and the root barrel;
   - move the `writeHTML` cases in `tests/index.test.ts`, `tests/errors.test.ts` and `packages/write/tests/write-generated-file.test.ts` onto `writeGeneratedFile` (keep the error-code assertions), and change the export test to assert the two names are **absent**;
   - add a changeset of type `major` with the migration note below.
3. Docs in the same PR (annotate, do not delete history): README "Deprecated / removed" list, `MIGRATION.md` (new § 4.x → 5.0.0), `docs/packages/README.md` deprecations table, `docs/packages/write.md`, `docs/packages/fs.md`, `docs/packages/markup-generator.md`, `docs/v4-monorepo.md` legacy-API line.
4. Merge the major Version packages PR only when you want to publish 5.0.0.

## 5. Draft migration note for the 5.0.0 changelog

```md
### Removed
- `writeHTML(fileName, data, dir)` — use `writeGeneratedFile({ fileName, content: data, dir })`.
- `isFolderExists(dir)` — use `ensureDir(dir)`.

Both were deprecated in 4.0.0. See MIGRATION.md (§ 4.x → 5.0.0).
```
