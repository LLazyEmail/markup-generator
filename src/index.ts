import {
  readSourceFile,
  isFolderExists,
  ensureDir,
  readFrontMatter,
} from './fileSystem';

import {
  writeHTML,
  writingFile,
  generateFileName,
  writeGeneratedFile,
} from './write';

import { writeGeneratedEmail } from './writeGeneratedEmail';
import { readJson, writeJson } from './json-io';
import {
  parseArgv,
  loadData,
  loadContent,
  buildFallbackContent,
  generateTemplate,
} from './generate-template';
import { resolveFromCwd } from './read';
import { TemplateGenerator, createGenerator } from './templateGenerator';

export type { WriteGeneratedFileOptions } from './types';
export type { WriteGeneratedEmailOptions } from './writeGeneratedEmail';
export type {
  CliArgs,
  TemplateData,
  RenderTemplate,
  GenerateTemplateOptions,
} from './generate-template';
export type {
  TemplateCatalogEntry,
  GeneratorConfig,
  RenderOptions,
  WriteOptions,
} from './templateGenerator';
export { MarkupGeneratorError } from './errors';
export type { MarkupGeneratorErrorCode } from './errors';

export {
  readSourceFile,
  readFrontMatter,
  ensureDir,
  isFolderExists,
  writeHTML,
  writingFile,
  generateFileName,
  writeGeneratedFile,
  writeGeneratedEmail,
  readJson,
  writeJson,
  parseArgv,
  loadData,
  loadContent,
  buildFallbackContent,
  generateTemplate,
  resolveFromCwd,
  TemplateGenerator,
  createGenerator,
};
