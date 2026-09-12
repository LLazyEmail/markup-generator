import { readFrontMatter } from 'markup-generator';

const result = readFrontMatter('./write/packages/write-module/tests/source.md');

console.log('front matter keys:', Object.keys(result.frontMatter));
console.log('markdown length:', result.markdown.length);
