export type CliArgs = Record<string, string | true>;

/**
 * Parse `--flag` style arguments from a full `process.argv`-shaped array
 * (the first two entries — node binary and script — are skipped).
 *
 * - `--key=value` → `'value'`; only the first `=` splits, so `--q=a=b` → `'a=b'`
 *   and `--key=` → `''`
 * - `--key value` → `'value'` when the next token does not start with `--`
 * - bare `--key` (end of argv or followed by another flag) → `true`
 * - positional tokens (e.g. a sub-command) are ignored
 *
 * This is the single argv parser used by `generateTemplate` and `runCli`.
 */
export function parseArgv(argv: readonly string[]): CliArgs {
  const args: CliArgs = {};
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;

    const body = token.slice(2);
    const eq = body.indexOf('=');
    if (eq !== -1) {
      args[body.slice(0, eq)] = body.slice(eq + 1);
      continue;
    }

    const next = argv[i + 1];
    if (next !== undefined && !next.startsWith('--')) {
      args[body] = next;
      i += 1;
    } else {
      args[body] = true;
    }
  }
  return args;
}
