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

describe('parseArgv edge cases', () => {
  test('only the first = splits key and value', () => {
    expect(parseArgv(['node', 'cli', '--q=a=b', '--url=https://x.test/?a=1&b=2'])).toEqual({
      q: 'a=b',
      url: 'https://x.test/?a=1&b=2',
    });
  });

  test('--key= yields an empty string', () => {
    expect(parseArgv(['node', 'cli', '--out='])).toEqual({ out: '' });
  });

  test('trailing bare flag is true and positionals are ignored', () => {
    expect(parseArgv(['node', 'cli', 'write', '--file', 'a.html', '--force'])).toEqual({
      file: 'a.html',
      force: true,
    });
  });

  test('empty-string next token is consumed as a value', () => {
    expect(parseArgv(['node', 'cli', '--prefix', ''])).toEqual({ prefix: '' });
  });
});
