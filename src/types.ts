export type OverwritePolicy = 'overwrite' | 'error';

export interface WriteGeneratedFileOptions {
  content: string;
  dir?: string;
  fileName?: string;
  prefix?: string;
  ext?: string;
  overwrite?: OverwritePolicy;
}
