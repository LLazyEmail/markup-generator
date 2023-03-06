import { resolve as pathResolve } from 'path'; 
import { readFrontMatter } from '../fileSystem';

const STRING_SOURCE_PATH = "./03-source-frontmatter.md";

// describe('read file', () => {
//     it('should work', () => {
//       const result = pathResolve(STRING_SOURCE_PATH);
//     //   expect(typeof result).toBe('string');    
//     });
// });
  


describe('front matter parsing', () => {
  it('should work', () => {
    const result = readFrontMatter(STRING_SOURCE_PATH);
    expect(typeof result).toBe('object');    
  });
});
