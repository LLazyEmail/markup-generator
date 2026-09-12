# Contributing to markup-generator

Thanks for helping improve this module. The publishable package lives in `write/packages/write-module`.

## Setup

```bash
cd write/packages/write-module
npm install
```

## Scripts

```bash
npm test          # ts-jest
npm run build     # tsup → CJS + ESM + types
```

## Pull requests

- Keep PRs small and focused.
- Do not change the public API without a changelog note.
- New behavior needs a test.
- File-system helpers are Node-only. Browser entry may only export pure helpers.

## Public API

Preferred:

- `generateFileName(suffix, ext?)`
- `writeHTML(fileName, content, dir?)`
- `readSourceFile(path)`
- `readFrontMatter(path)`

Avoid adding new positional-argument functions. Prefer an options object.

## Publishing

Do not publish from a feature branch. After merge to `main`:

```bash
cd write/packages/write-module
npm test
npm run build
npm pack --dry-run
```
