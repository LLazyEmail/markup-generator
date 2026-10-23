import { describe, expect, test } from 'vitest';
import { parseArgv } from '../src/index';

describe('parseArgv', () => {
  test('supports --key=value and --key value', () => {
    expect(
      parseArgv(['node', 'cli', '--template=hn', '--out', 'generated/hn.html'])
    ).toEqual({
      template: 'hn',
      out: 'generated/hn.html',
    });
  });

  test('treats bare flags as true', () => {
    expect(parseArgv(['node', 'cli', '--verbose', '--template', 'hn'])).toEqual(
      {
        verbose: true,
        template: 'hn',
      }
    );
  });
});
