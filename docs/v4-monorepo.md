# v4 monorepo scaffold (Phase 0)

Related: [#272 Re-organization Version #4](https://github.com/LLazyEmail/markup-generator/issues/272).

## What Phase 0 does

This phase only **scaffolds** a pnpm workspaces + Turborepo layout. The real library still lives at the **repo root** (`src/`, `tests/`, package name `markup-generator`). No source has been extracted into packages yet.

## Package map (planned)

| Package | Role (future) | Status now |
|---------|---------------|------------|
| `markup-generator` (root) | Public publishable barrel + current library | **Active** — build/tests here |
| `@llazyemail/fs` | FS primitives | Stub (`private: true`) |
| `@llazyemail/write` | Write helpers | Stub |
| `@llazyemail/read` | Read helpers | Stub |
| `@llazyemail/email` | Email-oriented wrappers | Stub |
| `@llazyemail/cli` | CLI / orchestration | Stub |
| `@llazyemail/template` | Template generation | Stub |
| `@llazyemail/core` | Shared core / barrel pieces | Stub |

Publish plan (later phases): keep root `markup-generator` on npm, then publish scoped `@llazyemail/*` packages. `gray-matter` stays at the root until Phase 2.

## Tooling

- **pnpm** workspaces (`pnpm-workspace.yaml`)
- **Turborepo** with `build` / `test` / `typecheck` / `lint` tasks; `build` and `test` use `dependsOn: ["^build"]` / `dependsOn: ["build"]` as appropriate

```bash
pnpm install
pnpm exec turbo run build test
```

## Explicitly not in Phase 0

- No moving `src/` into `packages/*`
- No deleting `old/` or any Nx remnant (Phase 5)
- Stubs are not published (`private: true`)
