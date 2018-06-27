import {Runner} from 'rpscript-parser';
import { EventEmitter } from 'events';
import {Logger} from '../core/logger';
import {ErrorMessage} from '../format/error_msg';

export class ExecCommand {

  runner:Runner;
  logger:Logger;

  constructor(config) {
    this.runner = new Runner(config);

    this.logger = Logger.getInstance();

    this.registerEvents(this.runner);
  }

  async run(filename:string) : Promise<any>{
    try{
      let result = await this.runner.execute(filename);
    
    }catch(er){
      console.error(er);
    }
  }

  registerEvents(evtEmt:EventEmitter){
    evtEmt.on(Runner.ACTION_EVT, params => {
      // console.log(`=== ${Runner.ACTION_EVT} ===`);
      // console.log(params);
      // console.log(params[0]+" : "+params[1]);
    });
    evtEmt.on(Runner.COMPILED_EVT, params => {
      // console.log(`=== ${Runner.COMPILED_EVT} ===`);
      // console.log(params);
    });
    evtEmt.on(Runner.LINT_EVT, params => {
      // console.log(`=== ${Runner.LINT_EVT} ===`);
      // console.log(params);
    });
    evtEmt.on(Runner.TRANSPILE_EVT, params => {
      console.log(`=== ${Runner.TRANSPILE_EVT} ===`);
      console.log(params.fullContent);
    });
    evtEmt.on(Runner.START_EVT, params => {
      // console.log(`=== ${Runner.START_EVT} ===`);
      // console.log(params);
    });
    evtEmt.on(Runner.END_EVT, params => {
      // console.log(`=== ${Runner.END_EVT} ===`);
      // console.log(params);
    });

    evtEmt.on(Runner.TRANSPILE_ERR_EVT, params => {
      // console.log(`=== ${Runner.TRANSPILE_ERR_EVT} ===`);
      ErrorMessage.handleKeywordMessage(params);
    });
  }


  private getFileName (filepath:string) :string {
    let index = filepath.lastIndexOf('/');
    let dotIndex = filepath.lastIndexOf('.');
    
    return filepath.substring(index+1,dotIndex);
}

}
