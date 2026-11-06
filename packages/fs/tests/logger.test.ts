import { describe, expect, test, vi } from 'vitest';
import { MarkupGeneratorError } from '../src/errors';
import { createConsoleLogger } from '../src/logger';

describe('createConsoleLogger', () => {
  test('info goes to stdout', () => {
    const stdout = vi.fn();
    const logger = createConsoleLogger({ stdout });
    logger.info?.('hello');
    expect(stdout).toHaveBeenCalledWith('hello');
  });

  test('error uses formatMarkupError', () => {
    const stderr = vi.fn();
    const logger = createConsoleLogger({ stderr });
    logger.error?.(new MarkupGeneratorError('EMPTY_CONTENT', 'nope'));
    expect(stderr).toHaveBeenCalledWith('[EMPTY_CONTENT] nope');
  });

  test('verbose includes stack', () => {
    const stderr = vi.fn();
    const logger = createConsoleLogger({ stderr, verbose: true });
    const err = new Error('boom');
    logger.error?.(err);
    expect(stderr.mock.calls[0][0]).toContain('boom');
    expect(stderr.mock.calls[0][0]).toContain('Error:');
  });

  test('debug is only present when verbose', () => {
    expect(createConsoleLogger().debug).toBeUndefined();
    expect(createConsoleLogger({ verbose: true }).debug).toBeTypeOf('function');
  });
});
