import { describe, expect, test } from 'vitest';
import { MarkupGeneratorError } from '../src/errors';
import { formatMarkupError } from '../src/formatError';

describe('formatMarkupError', () => {
  test('includes code and message for MarkupGeneratorError', () => {
    const err = new MarkupGeneratorError('EMPTY_CONTENT', 'no content');
    expect(formatMarkupError(err)).toBe('[EMPTY_CONTENT] no content');
  });

  test('appends cause message when present', () => {
    const cause = new Error('disk full');
    const err = new MarkupGeneratorError('WRITE_FAILED', 'could not write', { cause });
    expect(formatMarkupError(err)).toContain('[WRITE_FAILED]');
    expect(formatMarkupError(err)).toContain('disk full');
  });

  test('falls back for plain Error and unknown values', () => {
    expect(formatMarkupError(new Error('boom'))).toBe('boom');
    expect(formatMarkupError('raw')).toBe('raw');
  });
});
