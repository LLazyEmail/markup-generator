# markup-generator

Simple TypeScript helper for generating unique filenames and writing HTML (or any text) to disk.
Built for email-newsletter generation pipelines.

**Node.js >= 18.** File-system helpers require Node (`fs` / `path`). The browser entry only exports `generateFileName`.

## Install

```bash
npm install markup-generator
# or
yarn add markup-generator
```

## Usage (ESM)

```ts
import { writeHTML, generateFileName } from 'markup-generator';

const content = '<html></html>';
const fileName = generateFileName('prefix-for-your-generated-file');

await writeHTML(fileName, content);
```

## Usage (CommonJS)

```js
const { writeHTML, generateFileName } = require('markup-generator');
```

## Browser-safe helper

```ts
import { generateFileName } from 'markup-generator/browser';
```

## Public API

| Export | Description |
| --- | --- |
| `generateFileName(suffix, ext?)` | Unique filename, default extension `html` |
| `writeHTML(fileName, data, dir?)` | Async write of a string to disk |
| `writingFile(content, name?)` | Generate a name and write in one step |
| `readSourceFile(path)` | Read a UTF-8 file |
| `readFrontMatter(path)` | Parse markdown front matter with `gray-matter` |
| `isFolderExists(dir)` | Create the directory if it is missing |

## Development

The publishable package lives in `write/packages/write-module`.

```bash
cd write/packages/write-module
npm install
npm test
npm run build
```

Build output:

- `dist/index.cjs` — CommonJS
- `dist/index.js` — ESM
- `dist/index.d.ts` — types
- `dist/browser.*` — browser-safe entry

## Breaking changes in 3.0.0

- `generateTemplateName` was renamed to `generateFileName`
- `writeHTML` / `writingFile` are async and must be awaited
- Build moved from Nx/Rollup to `tsup`

## License

MIT

## [Linkedin page of LLazyEmail](https://www.linkedin.com/company/llazyemail/)
