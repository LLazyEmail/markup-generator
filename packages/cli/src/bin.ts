import { readFileSync } from 'node:fs';
import { generateFileName, writeGeneratedFile } from '@llazyemail/write';
import { parseArgv } from './parseArgv';
import type { CliArgs } from './parseArgv';

/** String value of a flag; bare (boolean) flags and empty values fall back. */
function stringArg(args: CliArgs, key: string, fallback = ''): string {
  const value = args[key];
  return typeof value === 'string' && value !== '' ? value : fallback;
}

/**
 * Root `markup-generator` bin entrypoint logic.
 */
export async function runCli(argv: string[] = process.argv): Promise<void> {
  const command = argv[2];
  const args = parseArgv(argv);
  const arg = (flag: string, fallback = ''): string =>
    stringArg(args, flag.replace(/^--/, ''), fallback);

  if (command === 'name') {
    process.stdout.write(
      `${generateFileName(arg('--prefix', 'file'), arg('--ext', 'html'))}\n`
    );
    return;
  }

  if (command === 'write') {
    const file = arg('--file');
    if (!file) {
      throw new Error(
        'usage: markup-generator write --file ./in.html [--prefix newsletter] [--dir generated]'
      );
    }
    const content = readFileSync(file, 'utf-8');
    const path = await writeGeneratedFile({
      content,
      prefix: arg('--prefix', 'file'),
      dir: arg('--dir', 'generated'),
      ext: arg('--ext', 'html'),
    });
    process.stdout.write(`${path}\n`);
    return;
  }

  process.stdout.write(
    'usage:\n  markup-generator name --prefix newsletter --ext html\n  markup-generator write --file ./in.html --prefix newsletter --dir generated\n'
  );
}
