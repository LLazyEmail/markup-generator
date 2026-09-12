# Migration to 3.0.0

## Breaking

- `generateTemplateName` was renamed to `generateFileName`
- `writeHTML` and `writingFile` are async and must be awaited
- filenames now use `crypto.randomUUID()`, not `Date.now()`
- package lives at the repository root (no Nx workspace)

## Preferred API

```ts
import { writeGeneratedFile, MarkupGeneratorError } from 'markup-generator';

try {
  await writeGeneratedFile({
    content: '<html></html>',
    prefix: 'newsletter',
    overwrite: 'error',
  });
} catch (error) {
  if (error instanceof MarkupGeneratorError) {
    console.error(error.code, error.message);
  }
}
```

## Error codes

- `EMPTY_CONTENT`
- `NOT_A_STRING`
- `FILE_EXISTS`
- `WRITE_FAILED`

## CLI

```bash
npx markup-generator name --prefix newsletter
npx markup-generator write --file ./in.html --prefix newsletter --dir generated
```
