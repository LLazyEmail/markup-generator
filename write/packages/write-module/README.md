# markup-generator

TypeScript helper for unique filenames and writing HTML/text files.

```ts
import { generateFileName, writeHTML } from 'markup-generator';

const fileName = generateFileName('newsletter');
await writeHTML(fileName, '<html></html>');
```

Browser-safe helper (no `fs`):

```ts
import { generateFileName } from 'markup-generator/browser';
```

Requires Node.js 18+.
