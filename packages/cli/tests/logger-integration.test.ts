import { describe, expect, test, vi } from 'vitest';
import { runCli } from '../src/index';

describe('runCli logger integration', () => {
  test('usage is written to stderr on missing --file', async () => {
    const errChunks: string[] = [];
    const spy = vi.spyOn(process.stderr, 'write').mockImplementation((c) => {
      errChunks.push(String(c));
      return true;
    });
    const prev = process.exitCode;
    await runCli(['node', 'cli', 'write']);
    expect(process.exitCode).toBe(1);
    expect(errChunks.join('')).toMatch(/usage/);
    process.exitCode = prev;
    spy.mockRestore();
  });

  test('verbose flag is accepted without throwing', async () => {
    const out = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    await runCli(['node', 'cli', 'name', '--prefix', 'x', '--verbose']);
    out.mockRestore();
  });
});
