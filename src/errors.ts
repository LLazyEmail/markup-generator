export type MarkupGeneratorErrorCode =
  | 'EMPTY_CONTENT'
  | 'NOT_A_STRING'
  | 'FILE_EXISTS'
  | 'WRITE_FAILED';

export class MarkupGeneratorError extends Error {
  readonly code: MarkupGeneratorErrorCode;

  constructor(code: MarkupGeneratorErrorCode, message: string) {
    super(message);
    this.name = 'MarkupGeneratorError';
    this.code = code;
  }
}

/**
 * Error thrown by markup-generator for any file-system read/write failure.
 * Carries a `code` so callers can branch on failure type without parsing
 * error messages.
 */
export class MarkupGeneratorError2 extends Error {
  code: string;

  constructor(code: string, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'MarkupGeneratorError2';
    this.code = code;
  }
}
