# markup-generator AKA WRITE!

Simple TypeScript helper for generating unique filenames and writing HTML (or any text) to disk.

Requires **Node.js >= 20**.

## Install

```bash
npm install markup-generator
```

## Library

```ts
import { writeGeneratedFile, generateFileName } from 'markup-generator';

const fileName = generateFileName('newsletter');
const path = await writeGeneratedFile({
  content: '<html></html>',
  fileName,
  dir: 'generated',
});
```

Paths are resolved from `process.cwd()`. Missing directories are created. Encoding is UTF-8. Default overwrite policy is replace.

## Write a generated email (stable name)

Use this when the output path must stay stable (`hackernoon-email.html`), not UUID-suffixed:

```ts
import { writeGeneratedEmail } from 'markup-generator';

await writeGeneratedEmail({
  content: renderedHtml,
  fileName: 'hackernoon-email.html',
  label: 'Hackernoon',
});
```

It writes to `generated/` by default, logs success, and on `MarkupGeneratorError` logs the code and sets `process.exitCode = 1` instead of throwing.

## CLI

```bash
npx markup-generator name --prefix newsletter --ext html
npx markup-generator write --file ./in.html --prefix newsletter --dir generated
```

## Example

```bash
npm install
npm run example
```

## Errors

Thrown errors are `MarkupGeneratorError` with `code`:
`EMPTY_CONTENT`, `NOT_A_STRING`, `FILE_EXISTS`, `WRITE_FAILED`.

See [MIGRATION.md](./MIGRATION.md) for 3.0.0 notes.

## What changed in 3.0.0

- TypeScript source at the repo root (Nx `write/` workspace removed)
- Dual CJS + ESM + types via `tsup` (`platform: 'node'`)
- Browser entry only exports `generateFileName`
- `generateTemplateName` → `generateFileName` (UUID, not `Date.now()`)
- `writeHTML` / `writingFile` are async
- `writeGeneratedFile({ content, fileName, dir, overwrite })` is the preferred writer
- `writeGeneratedEmail({ content, fileName, label })` writes a stable email filename
- Typed `MarkupGeneratorError` codes
- CLI: `markup-generator name|write`
- CI: one Node 24 job; publish workflow with provenance
- Tests use `ts-jest` + `jest.config.cjs`

## License

MIT
