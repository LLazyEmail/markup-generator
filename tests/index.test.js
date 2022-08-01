import { resolve } from 'path';
import { writingFile, readSourceFile } from '../src/index';


const root = resolve(__dirname, "");
const markdown = readSourceFile(`${root}/source.md`);


describe('test fullComponent', () => {

    test('rendering writingFile', () => {
    //   console.log(MainString);

    writingFile(markdown, 'this-is-my-name');
    // expect(string1).toBeDefined();
        
    });
});