// import 'mocha';
import {expect} from 'chai';
import {ReplCommand} from '../src/commands/repl';

describe('Basic', () => {

  it.only('should run fail single-simple-fail.rps', async () => {
    let filename = './test/fixtures/basic/single-simple-fail.rps';
    let content = await new ReplCommand({skipRun:true}).run(filename);
    // console.log(content);
  });

  it('should run single-simple.rps', async () => {
    let filename = './test/fixtures/basic/single-simple.rps';
    let content = await new ReplCommand({skipRun:true}).run(filename);
    console.log(content);
  });

  it('should run single-2-actions.rps', async () => {
    let filename = './test/fixtures/basic/single-2-actions.rps';
    let content = await new ReplCommand({skipRun:true}).run(filename);
    console.log(content);
  });

  it('should run single-multiline.rps', async () => {
    let filename = './test/fixtures/basic/single-multiline.rps';
    let content = await new ReplCommand({skipRun:true}).run(filename);
    console.log(content);
  });
})
