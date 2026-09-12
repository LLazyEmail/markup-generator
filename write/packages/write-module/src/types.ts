export type OverwritePolicy = 'overwrite' | 'error';

export interface WriteGeneratedFileOptions {
  content: string;
  /** Target directory. Default: generated */
  dir?: string;
  /** Explicit filename. If omitted, prefix + generateFileName is used. */
  fileName?: string;
  /** Used when fileName is not provided. Default: file */
  prefix?: string;
  /** Used when fileName is not provided. Default: html */
  ext?: string;
  /** What to do if the file already exists. Default: overwrite */
  overwrite?: OverwritePolicy;
}
