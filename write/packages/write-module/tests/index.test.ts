import { resolve } from 'path';
import { writingFile, readSourceFile } from '../src/index';

const root = resolve(__dirname, '');
const markdown = readSourceFile(`${root}/source.md`);

describe('test fullComponent', () => {
  test('rendering writingFile', () => {
    // writingFile currently returns void / Promise
    writingFile(markdown, 'this-is-my-name');
    // TODO: add proper assertions once writeHTML is made awaitable
  });
});

// TODO: find a way to generate an error and check tracing
