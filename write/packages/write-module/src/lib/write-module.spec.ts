import { writeModule } from './write-module';

describe('writeModule', () => {
  it('should work', () => {
    expect(writeModule()).toEqual('write-module');
  });
});
