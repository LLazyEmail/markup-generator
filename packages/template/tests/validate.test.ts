import { describe, expect, test } from 'vitest';
import { hasErrors, validateTemplateData } from '../src/validate';

describe('validateTemplateData', () => {
  test('rejects non-objects', () => {
    const r = validateTemplateData(null);
    expect(r).toHaveLength(1);
    expect(r[0].level).toBe('error');
    expect(hasErrors(r)).toBe(true);
  });

  test('requires a non-empty title', () => {
    const r = validateTemplateData({ title: '  ' });
    expect(r.some((x) => x.field === 'title' && x.level === 'error')).toBe(true);
  });

  test('accepts a minimal valid payload', () => {
    const r = validateTemplateData({ title: 'Hello', preview: 'World' });
    expect(hasErrors(r)).toBe(false);
    expect(r).toHaveLength(0);
  });

  test('warns on non-string preview', () => {
    const r = validateTemplateData({ title: 'Ok', preview: 123 });
    expect(r.some((x) => x.field === 'preview' && x.level === 'warning')).toBe(true);
    expect(hasErrors(r)).toBe(false);
  });

  test('errors on non-string bodyContent', () => {
    const r = validateTemplateData({ title: 'Ok', bodyContent: 42 });
    expect(r.some((x) => x.field === 'bodyContent' && x.level === 'error')).toBe(true);
  });
});
