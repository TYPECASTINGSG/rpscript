// import 'mocha';
import {expect} from 'chai';
import {ReplCommand} from '../src/commands/repl';

describe.skip('Simple test', () => {

  it('should run simple-read1.rps', () => {
    let filename = './test/fixtures/simple/simple-read1.1.rps';
    new ReplCommand({skipRun:true}).run(filename);
  });

  it('should run simple.rps', () => {
    let filename = './test/fixtures/simple/simple.rps';
    new ReplCommand({skipRun:true}).run(filename);
  });

  it('should run fn1.rps', () => {
    let filename = './test/fixtures/function/fn1.rps';
    new ReplCommand({skipRun:true}).run(filename);
  });
})
