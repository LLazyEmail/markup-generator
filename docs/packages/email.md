# @llazyemail/email

Email-oriented wrapper over `@llazyemail/write`. It depends on `@llazyemail/write`.

```bash
npm install markup-generator
# (internal module @llazyemail/email is bundled; not published separately)
```

```ts
import { writeGeneratedEmail } from 'markup-generator';         // ESM
const { writeGeneratedEmail } = require('markup-generator');    // CJS
```

## `writeGeneratedEmail(options: WriteGeneratedEmailOptions): Promise<string | undefined>`

```ts
interface WriteGeneratedEmailOptions {
  content: string;
  fileName: string;   // stable name, e.g. 'hackernoon-email.html' (no UUID appended)
  label: string;      // used in the success log line
  dir?: string;       // default 'generated' ('' also → 'generated')
  logger?: WriteGeneratedEmailLogger; // default: silent
}
interface WriteGeneratedEmailLogger {
  info?: (message: string) => void;
  error?: (message: string) => void;
}
```

Behaviour:
- It calls `writeGeneratedFile({ content, fileName, dir })` with the default
  overwrite policy, so an existing file is replaced. It never calls
  `generateFileName`.
- On success it calls `logger.info?.("✅  <label> → <absPath>")` and resolves to the absolute path.
- On a `MarkupGeneratorError` it calls
  `logger.error?.("❌ Failed to write <fileName> [<code>]: <message>")`, sets
  **`process.exitCode = 1`**, and resolves to `undefined`. It does **not** reject.
- On any other `Error`, it logs the same message without the code, sets
  `process.exitCode = 1`, and resolves to `undefined`.
- On a non-`Error` throw value, it **rethrows**.
- **Silent by default (breaking change in v4).** With no `logger`, nothing is
  printed. Pass `logger: console`, or any object with `info` and/or `error`.
  Either method can be omitted.

```ts
const out = await writeGeneratedEmail({ content: html, fileName: 'hn.html', label: 'Hackernoon', logger: console });
if (!out) { /* failed; process.exitCode is now 1 */ }

// custom logger, only errors
await writeGeneratedEmail({ content: html, fileName: 'n.html', label: 'N', logger: { error: (m) => myLog.warn(m) } });
```

## Testing and building
```bash
pnpm --filter @llazyemail/email test
pnpm --filter @llazyemail/email build
```
