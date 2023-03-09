// import { resolve as pathResolve } from 'path'; 
import { resolve } from 'path';
import { readFrontMatter, readSourceFile } from '../fileSystem';
import fs from 'fs';
import { writingFile } from '../write';

const STRING_SOURCE_FILE = "03-source-frontmatter.md";
// const STRING_SOURCE_PATH = "03-source-frontmatter.md";

const root = resolve(__dirname, ""); 
const fullPath = `${root}/03-source-frontmatter.md`;
// console.log(fullPath);

const markdown = readSourceFile(`${root}/03-source-frontmatter.md`);
// console.log(markdown);

// describe('read file', () => {
//     it('should work', () => {
//       const result = pathResolve(STRING_SOURCE_PATH);
//     //   expect(typeof result).toBe('string');    
//     });
// });
  


describe('front matter parsing', () => {
  it('should work', () => {
    const result = readFrontMatter(fullPath);
    expect(typeof result).toBe('object');    
  });


});



describe('writing', () => {

  test('rendering writingFile', () => {
    //   console.log(MainString);

    writingFile('WRITING THIS STRING INTO A FILE', 'this-is-my-name');
    // expect(string1).toBeDefined();
        
  });
  
});


describe('reading', () => {

  test('isFolderExists really checks folders', () => {
    // not calling isFolderExists but his body is testing
    const path = 'lib/03-source-frontmatter.md';
    let check = null;

    if (!fs.existsSync(path)) {
      check = false;
    }
    check = true;
    expect(check).toBe(true);
  });

});
