import {Plugins} from '../src/core/plugins';

describe('Simple test', () => {

  it('should load plugin', async () => {
    let filename = './test/fixtures/simple/simple-read1.1.rps';
    let plugin = new Plugins();

    let r = await plugin.listModule();
    console.log(r);
  });

})
