#!/usr/bin/env node
import { readFileSync } from 'fs';
import { generateFileName, writeGeneratedFile } from './write';

function arg(flag: string, fallback = ''): string {
  const index = process.argv.indexOf(flag);
  if (index === -1 || !process.argv[index + 1]) return fallback;
  return process.argv[index + 1];
}

async function main(): Promise<void> {
  const command = process.argv[2];

  if (command === 'name') {
    process.stdout.write(
      `${generateFileName(arg('--prefix', 'file'), arg('--ext', 'html'))}\n`
    );
    return;
  }

  if (command === 'write') {
    const file = arg('--file');
    if (!file) {
      throw new Error('usage: markup-generator write --file ./in.html [--prefix newsletter] [--dir generated]');
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

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
