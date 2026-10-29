# AGENTS.md — guide for AI coding agents

This file tells AI agents (and humans in a hurry) how to work in this repo
safely. Keep it short and factual; update it when the code changes.

## What this repo is

`markup-generator` is a pnpm + Turborepo monorepo. The root package
`markup-generator` is a **core barrel** that re-exports the scoped
`@llazyemail/*` workspace packages, keeps the CLI bin, and keeps the
`markup-generator/browser` subpath. Packages publish to the **public npm
registry** (trusted publishing / OIDC), not GitHub Packages.

## Layout

| Path | Role |
|------|------|
| `src/` | Root barrel + CLI + browser entry (`index.ts`, `cli.ts`, `browser.ts`) |
| `packages/fs` | `@llazyemail/fs` — dirs, paths, listing |
| `packages/write` | `@llazyemail/write` — `writeGeneratedFile`, filenames, errors |
| `packages/read` | `@llazyemail/read` — source / front-matter / JSON / data loaders |
| `packages/email` | `@llazyemail/email` — `writeGeneratedEmail` |
| `packages/template` | `@llazyemail/template` — template generation helpers |
| `packages/cli` | `@llazyemail/cli` — argv parse + `runCli` |
| `packages/core` | `@llazyemail/core` — private stub (not published) |
| `tests/` | Root vitest suite |
| `docs/` | Architecture / upgrade notes (extend; do not delete) |
| `.github/workflows/ci.yml` | Lint, typecheck, turbo build + test |
| `.github/workflows/npm-publish.yml` | Release / dry-run publish to npm |

Internal deps use `workspace:^`. Do not replace them with git URLs.

## Commands

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm exec turbo run build test
pnpm test                 # root vitest
pnpm run publish:dry      # dry-run publish all packages
```

Node: `engines.node` is `>=20` (do not lower). CI runs on Node **22, 24, and 26**.

## Test and coverage rules

- Keep TypeScript `strict` on in package tsconfigs. Prefer enabling
  `noUncheckedIndexedAccess` when touching a package’s tsconfig rather than
  turning strictness down.
- Root vitest has no coverage gate yet; do not remove existing tests. When
  adding runtime code under `src/` or `packages/*/src`, add tests beside the
  change (package or root `tests/`).
- `pnpm run lint` is soft in CI today; still fix new lint issues you introduce.

## Release flow

1. Land changes on `main` via small draft PRs.
2. Publish a GitHub Release (or run `npm-publish.yml` manually).
3. Workflow runs `pnpm -r publish` in topological order to `registry.npmjs.org`
   with provenance (`id-token: write`). Packages already on npm are skipped;
   private packages are never published.

## Conventions

- Small, single-purpose PRs; open them as **draft** first.
- Commit trailer when working for the maintainer:
  `Co-authored-by: petroved <arthur.tkachenko.netweight@gmail.com>`
- Docs: extend or annotate outdated guidance under `docs/`; do not delete
  existing docs content.
- Do not invent scripts; check root `package.json` and `turbo.json`.
- Avoid conflicting with open Renovate PRs that only touch lockfiles /
  typescript majors unless your change requires it.
