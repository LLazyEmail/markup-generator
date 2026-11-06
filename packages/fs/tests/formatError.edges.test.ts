import { describe, expect, test } from 'vitest';
import { formatMarkupError } from '../src/formatError';

describe('formatMarkupError edge cases', () => {
  test('handles null and undefined', () => {
    expect(formatMarkupError(null)).toBe('null');
    expect(formatMarkupError(undefined)).toBe('undefined');
  });

  test('handles numbers and objects', () => {
    expect(formatMarkupError(42)).toBe('42');
    expect(formatMarkupError({ a: 1 })).toContain('object');
  });
});
