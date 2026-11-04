import { describe, expect, test } from 'vitest';
import { MarkupGeneratorError } from '@llazyemail/write';
import { formatCliError, isVerboseArgv } from '../src/index';

describe('isVerboseArgv', () => {
  test('detects --verbose and -v', () => {
    expect(isVerboseArgv(['node', 'x', '--verbose'])).toBe(true);
    expect(isVerboseArgv(['node', 'x', '-v'])).toBe(true);
    expect(isVerboseArgv(['node', 'x', 'write', '--file', 'a'])).toBe(false);
  });
});

describe('formatCliError', () => {
  test('prints MarkupGeneratorError code without stack by default', () => {
    const err = new MarkupGeneratorError('JSON_WRITE', 'boom', {
      cause: new Error('disk full'),
    });
    const text = formatCliError(err, false);
    expect(text).toBe('[JSON_WRITE] boom');
    expect(text).not.toContain('Caused by');
  });

  test('verbose includes stack and cause', () => {
    const cause = new Error('disk full');
    const err = new MarkupGeneratorError('JSON_WRITE', 'boom', { cause });
    const text = formatCliError(err, true);
    expect(text).toContain('[JSON_WRITE] boom');
    expect(text).toContain('Caused by:');
    expect(text).toContain('disk full');
  });

  test('plain Error uses message; verbose uses stack', () => {
    const err = new Error('usage: write --file');
    expect(formatCliError(err, false)).toBe('usage: write --file');
    expect(formatCliError(err, true)).toContain('usage: write --file');
  });
});
