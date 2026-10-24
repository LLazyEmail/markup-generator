# v4 monorepo (Phases 0–4)

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

**`gray-matter` is a dependency of `@llazyemail/read` only.** Root `markup-generator` must not list `gray-matter` in `package.json` (addresses the dependency surface called out in #278).

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

## Phase 4 — core barrel + publishable packages

- Root `markup-generator@4.0.0` is the **core barrel**: `src/index.ts` re-exports `@llazyemail/{fs,write,read,email,cli}` (`export *`) and `@llazyemail/template` (explicit list, to avoid duplicate `loadData` / `loadContent` / `TemplateData`). The bin (`dist/cli.cjs`) and `./browser` subpath (`generateFileName` only) are kept.
- Root `tsup` no longer inlines `@llazyemail/*`; they are real `dependencies` (`workspace:^` → `^4.0.0` on publish). Output extensions fixed to `.cjs` / `.js`.
- Scoped packages: `private` removed, `version: 4.0.0`, `publishConfig.access: public`, built with `tsup --no-config` to ESM + CJS + `.d.ts` (the previous `tsc` output used extensionless ESM imports and was not runnable from Node).
- `@llazyemail/core` stays a **private stub** (the root package is the core barrel).
- Legacy APIs: `writeHTML` and `isFolderExists` deprecated (`@deprecated` JSDoc, removed in v5); `writingFile` removed.
- Publishing: `.github/workflows/npm-publish.yml` runs `pnpm -r publish`, which publishes in topological order (fs → write → cli/email/read → template → markup-generator) and skips versions already on npm. Local check: `pnpm run publish:dry`.

See [MIGRATION.md](../MIGRATION.md) for the v3 → v4 upgrade guide.

## Package map

| Package | Role | Status |
|---------|------|--------|
| `markup-generator` (root) | Core barrel (re-exports all) + bin + `./browser` | **Phase 4** — 4.0.0 |
| `@llazyemail/fs` | FS primitives | **Phase 1** — real code + tests |
| `@llazyemail/write` | Write helpers | **Phase 1** — real code + tests |
| `@llazyemail/read` | Read helpers (+ gray-matter) | **Phase 2** — real code + tests |
| `@llazyemail/email` | Email-oriented wrappers | **Phase 3** — real code + tests |
| `@llazyemail/cli` | CLI / argv / bin | **Phase 3** — real code + tests |
| `@llazyemail/template` | Template generation | **Phase 3** — real code + tests |
| `@llazyemail/core` | Reserved name | Private stub (not published) |

All scoped packages except `@llazyemail/core` are publishable at 4.0.0 (Phase 4).

## Explicitly not done yet

- No deleting `old/` or Nx remnant (Phase 5)
- No actual npm publish yet (dry run only)
