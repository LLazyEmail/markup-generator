import { describe, expect, test } from 'vitest';
import { DEFAULT_MESSAGES, MarkupGeneratorError } from '../src/index';

describe('DEFAULT_MESSAGES', () => {
  test('every code has a default message', () => {
    expect(new MarkupGeneratorError('EMPTY_CONTENT').message).toBe(
      DEFAULT_MESSAGES.EMPTY_CONTENT
    );
    expect(new MarkupGeneratorError('WRITE_FAILED').message).toBe(
      DEFAULT_MESSAGES.WRITE_FAILED
    );
    expect(new MarkupGeneratorError('FILE_EXISTS').message).toBe(
      DEFAULT_MESSAGES.FILE_EXISTS
    );
  });

  test('explicit message still wins', () => {
    expect(new MarkupGeneratorError('FILE_EXISTS', 'custom').message).toBe(
      'custom'
    );
  });
});
