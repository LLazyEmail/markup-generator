/**
 * Re-exported from @llazyemail/fs so every package shares one error class
 * (`instanceof` works regardless of which package threw it).
 */
export { MarkupGeneratorError, DEFAULT_MESSAGES } from '@llazyemail/fs';
export type {
  MarkupGeneratorErrorCode,
  MarkupGeneratorErrorOptions,
} from '@llazyemail/fs';
