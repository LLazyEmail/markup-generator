import { describe, expect, test } from 'vitest';
import { DEFAULT_MESSAGES, MarkupGeneratorError } from '../src/index';

describe('DEFAULT_MESSAGES', () => {
  test('every code has a default message', () => {
    for (const code of Object.keys(DEFAULT_MESSAGES) as (keyof typeof DEFAULT_MESSAGES)[]) {
      expect(new MarkupGeneratorError(code).message).toBe(DEFAULT_MESSAGES[code]);
    }
    expect(DEFAULT_MESSAGES.JSON_WRITE).toBe('failed to write JSON file');
  });

  test('explicit message still wins', () => {
    expect(new MarkupGeneratorError('FILE_EXISTS', 'custom').message).toBe(
      'custom'
    );
  });
});
