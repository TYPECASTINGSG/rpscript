import {Runner} from '../core/runner';

export class ReplCommand {

  replSvr;
  runner:Runner;

  constructor() {
    this.runner = new Runner();
  }

  run(filename:string){
    this.runner.execute(filename);
  }
  repl(){
    this.runner.repl();
  }

}
