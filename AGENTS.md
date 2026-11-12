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
| `.github/workflows/ci.yml` | Lint, typecheck, turbo build + test + coverage |
| `.github/workflows/npm-publish.yml` | Release / dry-run publish to npm |

Internal deps use `workspace:^`. Do not replace them with git URLs.

## Commands

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm exec turbo run build test
pnpm test                 # root vitest
pnpm run test:coverage    # with coverage report
pnpm run publish:dry      # dry-run publish all packages
```

Node: `engines.node` is `>=20` (do not lower). CI runs on Node **22, 24, and 26**.

## Test and coverage rules

- Keep TypeScript `strict` on in package tsconfigs. Prefer enabling
  `noUncheckedIndexedAccess` when touching a package’s tsconfig rather than
  turning strictness down.
- New runtime code under `src/` or `packages/*/src` **must** have tests
  (package or root `tests/`). Prefer testing error paths and edge cases.
- Aim for high coverage on changed files. CI fails if overall coverage drops
  below the threshold defined in vitest configs (currently soft; raise over time).
- `pnpm run lint` is soft in CI today; still fix new lint issues you introduce.
- When you fix a bug or implement an issue, **close the GitHub issue** (or
  comment with the PR link and request closure if you lack permissions).

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
- Error handling: always throw or return `MarkupGeneratorError` for expected
  failures. Preserve `cause` when wrapping underlying errors. Prefer explicit
  codes over string matching.
- Logging: prefer optional logger injection (see `writeGeneratedEmail`) over
  hard-coded `console`. Never call `process.exit` from library code.

## Chat / link rules for AI agents

When working from a chat UI (or any interface where the user cannot easily
click around the repo), always return a full clickable link for anything you
create or reference:

- **Branch you create**:  
  `https://github.com/LLazyEmail/markup-generator/tree/<branch-name>`
- **Pull request you open**:  
  `https://github.com/LLazyEmail/markup-generator/pull/<number>`
- **Issue you reference or close**:  
  `https://github.com/LLazyEmail/markup-generator/issues/<number>`
- **Commit you push**:  
  `https://github.com/LLazyEmail/markup-generator/commit/<sha>`

Do this in the same message where you announce the action. Do not make the
user hunt for the URL. Prefer the GitHub web URL over a bare branch name or
issue number.

## Coverage note

Root `vitest.config.ts` aliases `@llazyemail/*` to the TypeScript sources so
coverage instruments the code that actually runs. Thresholds are currently
modest (lines/functions/statements 50, branches 40). Raise them when the
numbers allow. Do not lower them without a reason.
