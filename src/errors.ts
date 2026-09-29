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

export class MarkupGeneratorError extends Error {
  readonly code: MarkupGeneratorErrorCode;

  constructor(
    code: MarkupGeneratorErrorCode,
    message: string = DEFAULT_MESSAGES[code]
  ) {
    super(message);
    this.name = 'MarkupGeneratorError';
    this.code = code;
  }
}
