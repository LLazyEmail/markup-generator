# v4 monorepo (Phase 0 + Phase 1)

Related: [#272 Re-organization Version #4](https://github.com/LLazyEmail/markup-generator/issues/272).

## Phase 0 — scaffold

pnpm workspaces + Turborepo layout. Stub packages under `packages/*` (`private: true`). Real library still at repo root until each phase extracts it.

## Phase 1 — extract `@llazyemail/fs` and `@llazyemail/write`

Real implementations (not stubs):

| Package | Contents |
|---------|----------|
| `@llazyemail/fs` | `ensureDir`, `isFolderExists`, `resolveFromCwd`, `pathExists`, `listTemplateFiles` (no gray-matter / `readFrontMatter`) |
| `@llazyemail/write` | `writeGeneratedFile`, `writeHTML`, `writingFile`, `generateFileName`, `MarkupGeneratorError`, `DEFAULT_MESSAGES`, write types |

Root `markup-generator` depends on both via `workspace:*` and **re-exports** the same public symbols so existing consumers keep working. `readFrontMatter` / `gray-matter`, email, template, and CLI stay at root (later phases). Other packages remain stubs.

```bash
pnpm install
pnpm exec turbo run build test
```

## Package map

| Package | Role | Status |
|---------|------|--------|
| `markup-generator` (root) | Public publishable barrel | **Active** |
| `@llazyemail/fs` | FS primitives | **Phase 1** — real code + tests |
| `@llazyemail/write` | Write helpers | **Phase 1** — real code + tests |
| `@llazyemail/read` | Read helpers | Stub |
| `@llazyemail/email` | Email-oriented wrappers | Stub |
| `@llazyemail/cli` | CLI / orchestration | Stub |
| `@llazyemail/template` | Template generation | Stub |
| `@llazyemail/core` | Shared core / barrel pieces | Stub |

Publish plan (later): keep root `markup-generator` on npm, then publish scoped `@llazyemail/*`. `gray-matter` stays at the root until Phase 2.

## Explicitly not done yet

- No moving read/gray-matter, email, template, or cli into packages
- No deleting `old/` or Nx remnant (Phase 5)
- Scoped packages stay `private: true` until a publish phase
