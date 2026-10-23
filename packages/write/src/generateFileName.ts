/**
 * Unique filename: `{suffix}-{uuid}.{ext}`.
 * Uses Web Crypto so this helper works in Node and browsers.
 */
export const generateFileName = (suffix: string, ext = 'html'): string => {
  if (ext === '') ext = 'html';
  return `${suffix}-${globalThis.crypto.randomUUID()}.${ext}`;
};
