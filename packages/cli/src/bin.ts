import { readFileSync } from 'node:fs';
import { generateFileName, writeGeneratedFile } from '@llazyemail/write';
import { createConsoleLogger } from '@llazyemail/fs';
import { parseArgv } from './parseArgv';
import type { CliArgs } from './parseArgv';
import { isVerboseArgv } from './formatCliError';

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
  const verbose = isVerboseArgv(argv);
  const logger = createConsoleLogger({
    verbose,
    stdout: (m) => process.stdout.write(m + '\n'),
    stderr: (m) => process.stderr.write(m + '\n'),
  });

  const arg = (flag: string, fallback = ''): string =>
    stringArg(args, flag.replace(/^--/, ''), fallback);

  try {
    if (command === 'name') {
      const name = generateFileName(arg('--prefix', 'file'), arg('--ext', 'html'));
      logger.info?.(name);
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
      logger.info?.(path);
      return;
    }

    logger.info?.(
      'usage:\n  markup-generator name --prefix newsletter --ext html\n  markup-generator write --file ./in.html --prefix newsletter --dir generated'
    );
  } catch (err) {
    logger.error?.(err);
    process.exitCode = 1;
  }
}
