import {Runner} from '../core/runner';
import { EventEmitter } from 'events';

export class ReplCommand {

  replSvr;
  runner:Runner;

  constructor(config) {
    this.runner = new Runner(config);
  }

  run(filename:string) : Promise<EventEmitter|string>{
    return this.runner.execute(filename);
  }
  repl(){
    console.log('TODO: REPL');
    // this.runner.repl();
  }

}
