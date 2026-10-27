import { describe, expect, test } from 'vitest';
import { generateFileName } from '../src/index';

const UUID_RE = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

describe('generateFileName', () => {
  test('creates a unique html filename by default', () => {
    const name = generateFileName('newsletter');
    expect(name).toMatch(new RegExp(`^newsletter-${UUID_RE}\\.html$`));
  });

  test('uses a custom extension', () => {
    const name = generateFileName('newsletter', 'md');
    expect(name).toMatch(new RegExp(`^newsletter-${UUID_RE}\\.md$`));
  });

  test('does not collide when called twice', () => {
    const first = generateFileName('newsletter');
    const second = generateFileName('newsletter');
    expect(first).not.toBe(second);
  });
});

describe('generateFileName extension normalisation', () => {
  test('a leading dot does not produce a double dot', () => {
    expect(generateFileName('x', '.txt')).toMatch(new RegExp(`^x-${UUID_RE}\\.txt$`));
  });

  test('empty or dot-only ext falls back to html', () => {
    expect(generateFileName('x', '')).toMatch(new RegExp(`^x-${UUID_RE}\\.html$`));
    expect(generateFileName('x', '.')).toMatch(new RegExp(`^x-${UUID_RE}\\.html$`));
  });
});
