export type MarkupGeneratorErrorCode =
  | 'EMPTY_CONTENT'
  | 'NOT_A_STRING'
  | 'FILE_EXISTS'
  | 'WRITE_FAILED'
  | 'JSON_READ'
  | 'JSON_PARSE'
  | 'EIMPORT'
  | 'EREAD';

export const DEFAULT_MESSAGES: Record<MarkupGeneratorErrorCode, string> = {
  EMPTY_CONTENT: 'content variable is empty',
  NOT_A_STRING: 'content variable is not a string',
  FILE_EXISTS: 'file already exists',
  WRITE_FAILED: 'file not written',
  JSON_READ: 'failed to read JSON file',
  JSON_PARSE: 'failed to parse JSON file',
  EIMPORT: 'failed to import module',
  EREAD: 'failed to read path',
};

export type MarkupGeneratorErrorOptions = {
  /** Underlying error (e.g. the original fs / import failure). */
  cause?: unknown;
};

/**
 * Typed error used across all @llazyemail/* packages.
 * Lives in @llazyemail/fs (the leaf package) so fs, read and write can all
 * throw it without a dependency cycle; @llazyemail/write re-exports it.
 */
export class MarkupGeneratorError extends Error {
  readonly code: MarkupGeneratorErrorCode;
  /** Underlying error, when there is one (mirrors ES2022 `Error.cause`). */
  declare readonly cause?: unknown;

  constructor(
    code: MarkupGeneratorErrorCode,
    message: string = DEFAULT_MESSAGES[code],
    options: MarkupGeneratorErrorOptions = {}
  ) {
    super(message);
    this.name = 'MarkupGeneratorError';
    this.code = code;
    if ('cause' in options) {
      Object.defineProperty(this, 'cause', {
        value: options.cause,
        enumerable: false,
        writable: true,
        configurable: true,
      });
    }
  }
}
