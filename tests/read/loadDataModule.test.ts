import { mkdtempSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { loadDataModule } from '../../src/read';
import { MarkupGeneratorError } from '../../src/errors';

describe('loadDataModule', () => {
  let dir: string;
  let originalCwd: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'markup-generator-data-'));
    originalCwd = process.cwd();
    process.chdir(dir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    rmSync(dir, { recursive: true, force: true });
  });

  it('parses a .json file', async () => {
    writeFileSync(join(dir, 'data.json'), JSON.stringify({ title: 'Newsletter' }), 'utf8');

    await expect(loadDataModule('data.json')).resolves.toEqual({ title: 'Newsletter' });
  });

  it('throws MarkupGeneratorError with code EPARSE for invalid JSON', async () => {
    writeFileSync(join(dir, 'bad.json'), '{ not valid json', 'utf8');

    await expect(loadDataModule('bad.json')).rejects.toMatchObject({
      code: 'EPARSE',
    });
  });

  it('throws MarkupGeneratorError with code ENOENT for a missing .json file', async () => {
    await expect(loadDataModule('missing.json')).rejects.toMatchObject({
      code: 'ENOENT',
    });
  });

  it('loads the default export from a .cjs module', async () => {
    writeFileSync(
      join(dir, 'data.cjs'),
      "module.exports = { title: 'From CJS' };",
      'utf8'
    );

    await expect(loadDataModule('data.cjs')).resolves.toEqual({ title: 'From CJS' });
  });

  it('falls back to the module namespace when there is no default export', async () => {
    writeFileSync(
      join(dir, 'data.cjs'),
      "module.exports = { title: 'Named export' };", // no `.default` key
      'utf8'
    );

    const result = (await loadDataModule('data.cjs')) as { title: string };
    expect(result.title).toBe('Named export');
  });

  

  it('throws MarkupGeneratorError with code EINVAL for an empty path', async () => {
    await expect(loadDataModule('')).rejects.toMatchObject({
      code: 'EINVAL',
    });
  });
});
