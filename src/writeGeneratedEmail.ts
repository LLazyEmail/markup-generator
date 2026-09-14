import { MarkupGeneratorError } from './errors';
import { writeGeneratedFile } from './write';

export interface WriteGeneratedEmailOptions {
  content: string;
  /** Stable filename, e.g. hackernoon-email.html. No UUID is appended. */
  fileName: string;
  /** Label printed on success, e.g. Hackernoon */
  label: string;
  /** Target directory. Default: generated */
  dir?: string;
}

/**
 * Persist rendered HTML under `generated/` with a stable filename.
 * Does not call generateFileName() — that would append a UUID and break
 * documented paths like hackernoon-email.html.
 */
export async function writeGeneratedEmail(
  options: WriteGeneratedEmailOptions
): Promise<string | undefined> {
  try {
    const outPath = await writeGeneratedFile({
      content: options.content,
      fileName: options.fileName,
      dir: options.dir && options.dir !== '' ? options.dir : 'generated',
    });
    console.log(`✅  ${options.label} → ${outPath}`);
    return outPath;
  } catch (err) {
    if (err instanceof MarkupGeneratorError) {
      console.error(
        `❌ Failed to write ${options.fileName} [${err.code}]: ${err.message}`
      );
      process.exitCode = 1;
      return undefined;
    }
    throw err;
  }
}
