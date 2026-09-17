export type MarkupGeneratorErrorCode =
  // write-side
  | 'EMPTY_CONTENT'
  | 'NOT_A_STRING'
  | 'FILE_EXISTS'
  | 'WRITE_FAILED'
  // read-side
  | 'EINVAL'
  | 'ENOENT'
  | 'EREAD'
  | 'EPARSE'
  | 'EIMPORT';

/**
 * Error thrown by markup-generator for any file-system read/write failure.
 * Carries a `code` so callers can branch on failure type without parsing
 * error messages.
 */
export class MarkupGeneratorError extends Error {
  readonly code: MarkupGeneratorErrorCode;

  constructor(code: MarkupGeneratorErrorCode, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'MarkupGeneratorError';
    this.code = code;
  }
}
