# @llazyemail/cli

Argv parsing and the logic behind the `markup-generator` bin. It depends on
`@llazyemail/write`.

```bash
npm install markup-generator
# (internal module @llazyemail/cli is bundled; not published separately)
```

```ts
import { parseArgv, runCli } from 'markup-generator';
import type { CliArgs } from 'markup-generator';
```

## `parseArgv(argv: string[]): CliArgs`
`type CliArgs = Record<string, string | true>`

- It skips `argv[0]` and `argv[1]` (node and the script), so pass `process.argv`
  or something with the same shape.
- `--key=value` produces `{ key: 'value' }`. **Only the part up to the next `=`
  is kept**, so `--q=a=b` produces `'a'`.
- `--key value` produces `{ key: 'value' }`, as long as the next token does not start with `--`.
- `--flag` (last token, or followed by another `--x`) produces `{ flag: true }`.
- Tokens that do not start with `--` (positionals, `-x` short flags) are ignored.
- If a key repeats, the last value wins. Values are never converted to numbers or booleans.

```ts
parseArgv(['node', 'x', '--template', 'hn', '--out=generated/hn.html', '--dry']);
// { template: 'hn', out: 'generated/hn.html', dry: true }
```

## `runCli(argv: string[] = process.argv): Promise<void>`
`runCli` temporarily replaces `process.argv` with `argv` and restores it in a
`finally` block. The command is `argv[2]`:

| Command | Flags (default) | Output |
|---------|-----------------|--------|
| `name` | `--prefix` (`file`), `--ext` (`html`) | prints `generateFileName(prefix, ext)` and a newline |
| `write` | `--file` (**required**), `--prefix` (`file`), `--dir` (`generated`), `--ext` (`html`) | reads `--file` as UTF-8, writes it to a unique name and prints the absolute path |
| anything else / none | none | prints usage to stdout and resolves normally |

- `write` without `--file` throws `Error('usage: markup-generator write --file …')`.
  `src/cli.ts` prints the message and exits with code 1.
- The flag reader inside `runCli` is **not** `parseArgv`. It supports only the
  `--flag value` form, not `--flag=value`. An empty or missing value uses the default.
- Read and write errors propagate. For example, a missing `--file` path throws
  ENOENT, and an empty file throws `EMPTY_CONTENT`.

```bash
npx markup-generator name --prefix newsletter --ext html
npx markup-generator write --file ./in.html --prefix newsletter --dir generated
```

## Testing and building
```bash
pnpm --filter @llazyemail/cli test
pnpm --filter @llazyemail/cli build
```
