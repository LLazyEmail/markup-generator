# Contributing to markup-generator

This is a pnpm + Turborepo monorepo. The published package is the root
`markup-generator` (it bundles the internal `@llazyemail/*` packages).

## Setup

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm exec turbo run build test
```

## Pull requests

- Keep PRs small, focused, and open them as **draft** first.
- Do not change the public API without a changelog note and a migration note
  if breaking.
- New behavior needs tests (prefer package-level tests next to the source).
- File-system helpers are Node-only. The `markup-generator/browser` entry may
  only export pure helpers.
- When fixing an open issue, link the PR and close the issue.

## Publishing

See `AGENTS.md` for the release flow. Prefer GitHub Releases or the
`npm-publish.yml` workflow. Never publish from a local machine unless
coordinated.
