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
