/**
 * Unique filename: `{suffix}-{uuid}.{ext}`.
 * A leading dot on `ext` is accepted (`'.txt'` and `'txt'` are equivalent).
 * Uses Web Crypto so this helper works in Node and browsers.
 */
export const generateFileName = (suffix: string, ext = 'html'): string => {
  const normalized = ext.replace(/^\.+/, '');
  return `${suffix}-${globalThis.crypto.randomUUID()}.${normalized || 'html'}`;
};
