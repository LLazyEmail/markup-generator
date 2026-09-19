import { describe, expect, test } from 'vitest';
import { resolve } from 'path';
import { resolveFromCwd } from '../src/index';

describe('resolveFromCwd', () => {
  test('resolves a relative path from cwd', () => {
    expect(resolveFromCwd('generated/out.html')).toBe(
      resolve(process.cwd(), 'generated/out.html')
    );
  });

  test('keeps an absolute path', () => {
    const absolute = resolve(process.cwd(), 'already-absolute.html');
    expect(resolveFromCwd(absolute)).toBe(absolute);
  });
});
