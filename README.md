# markup-generator

Simple TypeScript helper for generating unique filenames and writing HTML (or any text) to disk.
Built for email-newsletter generation pipelines.

Requires **Node.js >= 18**. File-system helpers need Node (`fs` / `path`). The browser entry only exports `generateFileName`.

## Install

```bash
npm install markup-generator
```

## Usage (ESM)

```ts
import { writeHTML, generateFileName } from 'markup-generator';

const fileName = generateFileName('newsletter');
await writeHTML(fileName, '<html></html>');
```

## Usage (CommonJS)

```js
const { writeHTML, generateFileName } = require('markup-generator');
```

## Preferred writer

```ts
import { writeGeneratedFile } from 'markup-generator';

const path = await writeGeneratedFile({
  content: '<html></html>',
  prefix: 'newsletter',
  dir: 'generated',
});
```

## Browser-safe helper

```ts
import { generateFileName } from 'markup-generator/browser';
```

## Development

```bash
npm install
npm test
npm run build
```

## License

MIT
