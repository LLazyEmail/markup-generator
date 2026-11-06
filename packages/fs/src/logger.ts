import { formatMarkupError } from './formatError';

export interface Logger {
  info?: (message: string) => void;
  /** Accepts a string or any thrown value. Non-strings are formatted via formatMarkupError. */
  error?: (message: unknown) => void;
  debug?: (message: string) => void;
}

export interface CreateConsoleLoggerOptions {
  /** Include stack / cause details on errors. */
  verbose?: boolean;
  /** Destination for info/debug (defaults to console.log). */
  stdout?: (message: string) => void;
  /** Destination for errors (defaults to console.error). */
  stderr?: (message: string) => void;
}

/**
 * Tiny, dependency-free logger. Prefers optional methods so callers can
 * pass a partial logger (or nothing) and stay silent.
 */
export function createConsoleLogger(options: CreateConsoleLoggerOptions = {}): Logger {
  const stdout = options.stdout ?? ((m: string) => console.log(m));
  const stderr = options.stderr ?? ((m: string) => console.error(m));
  const verbose = options.verbose ?? false;

  return {
    info: (message) => stdout(message),
    error: (errOrMessage: unknown) => {
      const text =
        typeof errOrMessage === 'string'
          ? errOrMessage
          : verbose
            ? formatMarkupError(errOrMessage) +
              (errOrMessage instanceof Error && errOrMessage.stack
                ? `\n${errOrMessage.stack}`
                : '')
            : formatMarkupError(errOrMessage);
      stderr(text);
    },
    debug: verbose ? (message) => stdout(`[debug] ${message}`) : undefined,
  };
}
