# v4 monorepo (Phase 0 + Phase 1 + Phase 2 + Phase 3)

Related: [#272 Re-organization Version #4](https://github.com/LLazyEmail/markup-generator/issues/272), [#270 writeGeneratedEmail vs writeGeneratedFile](https://github.com/LLazyEmail/markup-generator/issues/270), [#278 gray-matter / Dependabot](https://github.com/LLazyEmail/markup-generator/issues/278).

## Phase 0 — scaffold

pnpm workspaces + Turborepo layout. Stub packages under `packages/*` (`private: true`). Real library still at repo root until each phase extracts it.

## Phase 1 — extract `@llazyemail/fs` and `@llazyemail/write`

Real implementations (not stubs):

| Package | Contents |
|---------|----------|
| `@llazyemail/fs` | `ensureDir`, `isFolderExists`, `resolveFromCwd`, `pathExists`, `listTemplateFiles` (no gray-matter / `readFrontMatter`) |
| `@llazyemail/write` | `writeGeneratedFile`, `writeHTML`, `writingFile`, `generateFileName`, `MarkupGeneratorError`, `DEFAULT_MESSAGES`, write types |

## Phase 2 — extract `@llazyemail/read`

| Package | Contents |
|---------|----------|
| `@llazyemail/read` | `readSourceFile`, `readFrontMatter`, `readJson`, `writeJson`, `loadData`, `loadContent`, `importEsm`, `TemplateData` |

**`gray-matter` is a dependency of `@llazyemail/read` only.** Root `markup-generator` must not list `gray-matter` in `package.json` (addresses the dependency surface called out in #278).

## Phase 3 — extract `@llazyemail/email`, `@llazyemail/template`, `@llazyemail/cli`

| Package | Contents |
|---------|----------|
| `@llazyemail/email` | `writeGeneratedEmail` (stable filename + console / `exitCode`; builds on `@llazyemail/write`) |
| `@llazyemail/template` | `generateTemplate`, `buildFallbackContent`, `TemplateGenerator`, `createGenerator` — **write unified onto `@llazyemail/write`** (`TemplateGenerator.write` / `generateTemplate` call `writeGeneratedFile`, not raw `fs.writeFileSync`) |
| `@llazyemail/cli` | `parseArgv` / `CliArgs`, `runCli` (root bin entrypoint logic) |

Root still **re-exports** the same public symbols via `workspace:*` so existing consumers of `markup-generator` keep working. Root `tsup` inlines `@llazyemail/*` (including the CLI entry).

```bash
pnpm install
pnpm exec turbo run build test
pnpm exec tsc --noEmit
```

## Package map

| Package | Role | Status |
|---------|------|--------|
| `markup-generator` (root) | Public publishable barrel | **Active** |
| `@llazyemail/fs` | FS primitives | **Phase 1** — real code + tests |
| `@llazyemail/write` | Write helpers | **Phase 1** — real code + tests |
| `@llazyemail/read` | Read helpers (+ gray-matter) | **Phase 2** — real code + tests |
| `@llazyemail/email` | Email-oriented wrappers | **Phase 3** — real code + tests |
| `@llazyemail/cli` | CLI / argv / bin | **Phase 3** — real code + tests |
| `@llazyemail/template` | Template generation | **Phase 3** — real code + tests |
| `@llazyemail/core` | Shared core / barrel pieces | Stub |

Publish plan (later): keep root `markup-generator` on npm, then publish scoped `@llazyemail/*`. Root `tsup` inlines `@llazyemail/*` (and bundles `gray-matter` through `@llazyemail/read`) so the published tarball stays self-contained.

## Explicitly not done yet

- No extracting `@llazyemail/core` barrel
- No deleting `old/` or Nx remnant (Phase 5)
- Scoped packages stay `private: true` until a publish phase
