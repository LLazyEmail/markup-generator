#!/usr/bin/env node
import { runCli } from '@llazyemail/cli';

runCli().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
