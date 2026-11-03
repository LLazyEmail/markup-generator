#!/usr/bin/env node
import { runCli, isVerboseArgv, formatCliError } from '@llazyemail/cli';

const verbose = isVerboseArgv(process.argv);

runCli().catch((error) => {
  console.error(formatCliError(error, verbose));
  process.exit(1);
});
