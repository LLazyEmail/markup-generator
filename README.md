# markup-generator

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

## License

MIT
