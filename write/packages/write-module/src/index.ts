import {
  readSourceFile,
  isFolderExists,
  readFrontMatter,
} from './fileSystem';

import {
  writeHTML,
  writingFile,
  generateTemplateName,
  writeFileParticle,
} from './write';

export {
  // File system helpers
  readSourceFile,
  readFrontMatter,
  isFolderExists,

  // Writing helpers
  writeHTML,
  writingFile,
  generateTemplateName,
  writeFileParticle,
};

// Re-export types for consumers (will be useful once we publish .d.ts)
export type { };
