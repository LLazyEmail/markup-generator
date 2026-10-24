/**
 * @llazyemail/write — write helpers extracted in Phase 1.
 */
export {
  writeHTML,
  generateFileName,
  writeGeneratedFile,
} from './write';
export type { WriteGeneratedFileOptions, OverwritePolicy } from './types';
export {
  MarkupGeneratorError,
  DEFAULT_MESSAGES,
} from './errors';
export type { MarkupGeneratorErrorCode } from './errors';
