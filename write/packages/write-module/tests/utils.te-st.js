import fs from 'fs';
import chalk from 'chalk';

import { readSourceFile, displayCLIErrors, FULL_SOURCE } from '../../src/utils'


describe('testing utils.js', () => {
  //-----
  test('readSourceFile reads file', () => {
    const wrapper = readSourceFile(FULL_SOURCE);
    expect(wrapper).toBe(fs.readFileSync(FULL_SOURCE, { encoding: 'utf-8' }));
  });


//-----
 

//-----
  test('displayCLIErrors receives --> errors <-- and outputs them', () => {
    let outputData = '';

    const storeLog = (inputs) => (outputData += inputs);
    console.log = jest.fn(storeLog);
    displayCLIErrors({ previewText: false }, {});

    const msg1 = chalk.red('ERROR source.md doesn\'t have previewText');
    const msg2 = chalk.red.bold('The full template has not been parsed!');
    expect(outputData).toBe(msg1 + msg2);
  });

//-----
  // test('displayCLIErrors receives --> warnings <-- and outputs them', () => {
  //   let outputData = '';

  //   const storeLog = (inputs) => (outputData += inputs);
  //   console.log = jest.fn(storeLog);
  //   displayCLIErrors({}, { images: 5 });

  //   const msg1 = chalk.yellow('WARNING source.md has 5 images. Replace it with memes');
  //   expect(outputData).toBe(msg1);
  // });
});
