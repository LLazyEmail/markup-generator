# Contributing to markup-generator

The package lives at the repository root.

## Setup

```bash
npm install
npm test
npm run build
```

## Pull requests

- Keep PRs small and focused.
- Do not change the public API without a changelog note.
- New behavior needs a test.
- File-system helpers are Node-only. Browser entry may only export pure helpers.

## Publishing

```bash
npm test
npm run build
npm pack --dry-run
```
