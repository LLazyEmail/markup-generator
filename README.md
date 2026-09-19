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

## JSON helpers

```ts
import { readJson, writeJson } from 'markup-generator';

writeJson('./generated/issue.json', { title: 'Weekly', preview: 'Hello' });
const data = readJson<{ title: string }>('./generated/issue.json');
```

Missing or invalid JSON throws `MarkupGeneratorError` with `JSON_READ` or `JSON_PARSE`.

## Generate a template (I/O half)

Moved from `hn_email_template/scripts/generate-template.js`. This package loads data, optional HTML content, builds fallback markup, and writes the file. **You still pass `renderTemplate` from the template repo.**

```ts
import { generateTemplate } from 'markup-generator';
import { renderTemplate } from './Work/dist/index.cjs.js';

await generateTemplate({
  render: renderTemplate,
  argv: process.argv,
  defaultTemplateId: 'hn',
  defaultDataPath: 'content/content2.js',
});
```

CLI flags understood by `parseArgv` / `generateTemplate`:

- `--template` (default `hn`)
- `--data` path to `.json` / `.js` / `.mjs` / `.cjs`
- `--out` output HTML path
- `--content` optional HTML fragment

## Write a generated email (stable name)

```ts
import { writeGeneratedEmail } from 'markup-generator';

await writeGeneratedEmail({
  content: renderedHtml,
  fileName: 'hackernoon-email.html',
  label: 'Hackernoon',
});
```

## CLI

```bash
npx markup-generator name --prefix newsletter --ext html
npx markup-generator write --file ./in.html --prefix newsletter --dir generated
```

## Errors

`MarkupGeneratorError` codes:
`EMPTY_CONTENT`, `NOT_A_STRING`, `FILE_EXISTS`, `WRITE_FAILED`, `JSON_READ`, `JSON_PARSE`.

See [MIGRATION.md](./MIGRATION.md) for 3.0.0 notes.

## License

MIT
