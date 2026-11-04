import { MarkupGeneratorError } from '@llazyemail/write';

/** True when argv contains `--verbose` or `-v`. */
export function isVerboseArgv(argv: readonly string[]): boolean {
  return argv.includes('--verbose') || argv.includes('-v');
}

/**
 * Human-readable CLI error text. Verbose mode includes stack and `cause`.
 * Does not print — callers write to stderr.
 */
export function formatCliError(error: unknown, verbose: boolean): string {
  const lines: string[] = [];
  if (error instanceof MarkupGeneratorError) {
    lines.push(`[${error.code}] ${error.message}`);
    if (verbose) {
      if (error.stack) lines.push(error.stack);
      if (error.cause !== undefined) {
        lines.push(`Caused by: ${stringifyCause(error.cause)}`);
      }
    }
    return lines.join('\n');
  }
  if (error instanceof Error) {
    if (verbose) {
      lines.push(error.stack ?? error.message);
      if ('cause' in error && error.cause !== undefined) {
        lines.push(`Caused by: ${stringifyCause(error.cause)}`);
      }
    } else {
      lines.push(error.message);
    }
    return lines.join('\n');
  }
  return String(error);
}

function stringifyCause(cause: unknown): string {
  if (cause instanceof Error) return cause.stack ?? cause.message;
  try {
    return JSON.stringify(cause);
  } catch {
    return String(cause);
  }
}
