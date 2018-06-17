import fs from 'fs';
import c from 'chai';
import 'mocha';
import {Runner} from '../src/core/runner';


describe('Runner', () => {
  xit('create a folder .rpscript', async () => {
    let runner = new Runner();
    // let result = await runner.compile('./test/fixtures/test.rps');
    c.expect(fs.existsSync('.rpscript')).to.be.true;
  });

  xit('should run', () => {
    let runner = new Runner();
    runner.run(process.cwd()+'/.rpscript/test.ts');

    c.expect(false).to.be.true;
  });

  it('compile source code', async () => {
    let runner = new Runner();

    // let result = await runner.convertToTS('./test/fixtures/fn1.rps');
    // result = await runner.linting('.rpscript/fn1.ts');
    // result = await runner.run('.rpscript/fn1.ts');
    if(fs.existsSync('.rpscript/simple.ts')) fs.unlinkSync('.rpscript/simple.ts');

    let result = await runner.convertToTS('./test/fixtures/simple.rps');
    let output = await runner.linting('.rpscript/simple.ts');
    let run    = await runner.run('.rpscript/simple.ts');


    c.expect(output.errorCount === 0).to.be.true;
  });

})
