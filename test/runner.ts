import fs from 'fs';
import c from 'chai';
import 'mocha';
import {Runner} from '../src/core/runner';

import * as rps from 'rpscript-api';

describe('Runner', () => {
  it('launch run', async () => {
    let runner = new Runner();
    // let result = await runner.compile('./test/fixtures/test.rps');
    c.expect(fs.existsSync('.rpscript')).to.be.true;
  });

  xit('should compile ts to js', () => {
    let runner = new Runner();
    runner.run(process.cwd()+'/.rpscript/test.ts');

    c.expect(false).to.be.true;
  });

  it('compile source simple.rps', async () => {
    let runner = new Runner();
    let result = await runner.compile('./src/antlr/grammar/simple.rps');

    c.expect(fs.existsSync('.rpscript/output.ts')).to.be.true;
  });

})
