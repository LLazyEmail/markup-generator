import { MarkupGeneratorError } from './errors.js';

/**
 * Produce a stable, one-line summary of a failure for logs or CLI output.
 * Safe to call on any value; non-errors become a generic string.
 */
export function formatMarkupError(err: unknown): string {
  if (err instanceof MarkupGeneratorError) {
    const cause = err.cause instanceof Error ? ` (cause: ${err.cause.message})` : '';
    return `[${err.code}] ${err.message}${cause}`;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return String(err);
}
