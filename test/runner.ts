import c from 'chai';
import 'mocha';
import {Runner} from '../src/core/runner';

describe('Runner', () => {
  it('launch run', async () => {
    let runner = new Runner();
    let result = await runner.compile('./test/fixtures/test.rps');
    
    try{
      console.log(result.getOutputStr());
      c.expect(true).to.be.true;
    }catch(er){
      console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
      console.error(er);
      c.expect(true).to.be.false;
    }
    
  });
})
