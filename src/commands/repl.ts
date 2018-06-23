import {Runner} from '../core/runner';

export class ReplCommand {

  replSvr;
  runner:Runner;

  constructor(config) {
    this.runner = new Runner(config);
  }

  run(filename:string){
    this.runner.execute(filename);
  }
  repl(){
    console.log('TODO: REPL');
    // this.runner.repl();
  }

}
