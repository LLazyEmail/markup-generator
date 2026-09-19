import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { readJson, writeJson } from '../src/json-io.js';

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'json-io-'));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe('readJson', () => {
  it('reads and parses a valid JSON file', () => {
    const file = join(dir, 'ok.json');
    writeFileSync(file, JSON.stringify({ a: 1, b: 'two' }), 'utf-8');

    expect(readJson(file)).toEqual({ a: 1, b: 'two' });
  });

  it('preserves types (numbers, booleans, null, arrays, nesting)', () => {
    const file = join(dir, 'types.json');
    writeFileSync(
      file,
      JSON.stringify({ n: 1, f: 1.5, t: true, z: null, arr: [1, 2], obj: { x: 'y' } }),
      'utf-8'
    );

    expect(readJson(file)).toEqual({
      n: 1,
      f: 1.5,
      t: true,
      z: null,
      arr: [1, 2],
      obj: { x: 'y' },
    });
  });

  it('throws a descriptive error when the file does not exist', () => {
    const file = join(dir, 'missing.json');
    expect(() => readJson(file)).toThrow(/Failed to read JSON file/);
    expect(() => readJson(file)).toThrow(/missing\.json/);
  });

  it('throws a descriptive error when the file is not valid JSON', () => {
    const file = join(dir, 'bad.json');
    writeFileSync(file, '{ not json', 'utf-8');
    expect(() => readJson(file)).toThrow(/Failed to parse JSON file/);
    expect(() => readJson(file)).toThrow(/bad\.json/);
  });

  it('handles an empty file (invalid JSON)', () => {
    const file = join(dir, 'empty.json');
    writeFileSync(file, '', 'utf-8');
    expect(() => readJson(file)).toThrow(/Failed to parse JSON file/);
  });

  it('can be typed by the caller', () => {
    const file = join(dir, 'typed.json');
    writeFileSync(file, JSON.stringify({ id: 'x' }), 'utf-8');

    const value = readJson<{ id: string }>(file);
    expect(value.id).toBe('x');
  });
});

describe('writeJson', () => {
  it('writes a value that readJson can read back', () => {
    const file = join(dir, 'nested', 'roundtrip.json');
    writeJson(file, { hello: 'world' });
    expect(readJson(file)).toEqual({ hello: 'world' });
  });

  it('creates parent directories', () => {
    const file = join(dir, 'a', 'b', 'c.json');
    expect(() => writeJson(file, { ok: true })).not.toThrow();
    expect(readJson(file)).toEqual({ ok: true });
  });

  it('pretty-prints by default and ends with a newline', () => {
    const file = join(dir, 'pretty.json');
    writeJson(file, { a: 1 });
    const text = readJson; // keep import used
    void text;
    // read raw bytes to assert formatting
    const raw = require('node:fs').readFileSync(file, 'utf-8');
    expect(raw).toBe('{\n  "a": 1\n}\n');
  });
});
