import { MarkupGeneratorError, writeGeneratedFile } from '@llazyemail/write';

export interface WriteGeneratedEmailOptions {
  content: string;
  /** Stable filename, e.g. hackernoon-email.html. No UUID is appended. */
  fileName: string;
  /** Label printed on success, e.g. Hackernoon */
  label: string;
  /** Target directory. Default: generated */
  dir?: string;
  /**
   * Optional logger for success/failure messages. Defaults to silent so this
   * package stays silent in browser contexts (Node CLIs may inject a logger).
   */
  logger?: WriteGeneratedEmailLogger;
}

export interface WriteGeneratedEmailLogger {
  info?: (message: string) => void;
  error?: (message: string) => void;
}

/**
 * Persist rendered HTML under `generated/` with a stable filename.
 * Does not call generateFileName() — that would append a UUID and break
 * documented paths like hackernoon-email.html.
 */
export async function writeGeneratedEmail(
  options: WriteGeneratedEmailOptions
): Promise<string | undefined> {
  const logger = options.logger ?? {};
  try {
    const outPath = await writeGeneratedFile({
      content: options.content,
      fileName: options.fileName,
      dir: options.dir && options.dir !== '' ? options.dir : 'generated',
    });
    logger.info?.(`✅  ${options.label} → ${outPath}`);
    return outPath;
  } catch (err: unknown) {
    if (err instanceof MarkupGeneratorError) {
      logger.error?.(
        `❌ Failed to write ${options.fileName} [${err.code}]: ${err.message}`
      );
      process.exitCode = 1;
      return undefined;
    }
    if (err instanceof Error) {
      logger.error?.(`❌ Failed to write ${options.fileName}: ${err.message}`);
      process.exitCode = 1;
      return undefined;
    }
    throw err;
  }
}
