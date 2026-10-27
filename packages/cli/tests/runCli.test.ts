import { afterEach, describe, expect, test, vi } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runCli } from '../src/index';

const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

function captureStdout() {
  const chunks: string[] = [];
  const spy = vi
    .spyOn(process.stdout, 'write')
    .mockImplementation((chunk: string | Uint8Array) => {
      chunks.push(String(chunk));
      return true;
    });
  return { spy, text: () => chunks.join('') };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('runCli', () => {
  test('name supports --flag value', async () => {
    const out = captureStdout();
    await runCli(['node', 'cli', 'name', '--prefix', 'news', '--ext', 'txt']);
    expect(out.text().trim()).toMatch(new RegExp(`^news-${UUID}\\.txt$`));
  });

  test('name supports --flag=value', async () => {
    const out = captureStdout();
    await runCli(['node', 'cli', 'name', '--prefix=news', '--ext=md']);
    expect(out.text().trim()).toMatch(new RegExp(`^news-${UUID}\\.md$`));
  });

  test('bare flags fall back to defaults instead of swallowing the next flag', async () => {
    const out = captureStdout();
    await runCli(['node', 'cli', 'name', '--prefix', '--ext', 'md']);
    expect(out.text().trim()).toMatch(new RegExp(`^file-${UUID}\\.md$`));
  });

  test('does not mutate process.argv', async () => {
    const before = [...process.argv];
    captureStdout();
    await runCli(['node', 'cli', 'name', '--prefix', 'x']);
    expect(process.argv).toEqual(before);
  });

  test('write reads --file=… and writes into --dir=…', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'mg-cli-'));
    try {
      const input = join(dir, 'in.html');
      writeFileSync(input, '<p>hi</p>');
      const out = captureStdout();
      await runCli(['node', 'cli', 'write', `--file=${input}`, `--dir=${dir}`, '--prefix=nl']);
      const written = out.text().trim();
      expect(written).toMatch(new RegExp(`nl-${UUID}\\.html$`));
      expect(readFileSync(written, 'utf-8')).toBe('<p>hi</p>');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('write without --file throws usage', async () => {
    await expect(runCli(['node', 'cli', 'write', '--file'])).rejects.toThrow(/usage/);
  });
});
