import {Runner} from 'rpscript-parser';
import { EventEmitter } from 'events';
import {Logger} from '../core/logger';
import {ErrorMessage} from '../format/error_msg';
import fs from 'fs';
import R from 'ramda';

export class ExecCommand {

  runner:Runner;
  logger:Logger;

  constructor(config, event?:(evt:EventEmitter)=>void) {
    this.runner = new Runner(config);

    this.logger = Logger.getInstance();

    if(!event)
      this.registerDefaultEvents(this.runner);
    else
      event(this.runner);
  }

  async run(filename:string) : Promise<any>{
    try{
      let result = await this.runner.execute(filename);

      return result;
    
    }catch(er){
      console.error(er);
    }
  }

  registerDefaultEvents(evtEmt:EventEmitter) : void{
    evtEmt.on(Runner.ACTION_EVT, (args) => {
      let arg = args[0];
      let modName = arg[0], actionName = arg[1], evt = arg[2], params = arg[3];
      console.log(`=== ${Runner.ACTION_EVT}: ${actionName} ${evt} ===`);
      console.log(arg);
    });
    evtEmt.on(Runner.COMPILED_EVT, params => {
      console.log(`=== ${Runner.COMPILED_EVT} ===`);
      console.log(params);
    });
    evtEmt.on(Runner.LINT_EVT, params => {
      console.log(`=== ${Runner.LINT_EVT} ===`);
      console.log(params);
    });
    evtEmt.on(Runner.TRANSPILE_EVT, params => {
      console.log(`=== ${Runner.TRANSPILE_EVT} ===`);
      // console.log(params.fullContent);
      fs.writeFileSync('.rpscript/temp.ts',params.fullContent);
    });
    evtEmt.on(Runner.START_EVT, params => {
      console.log(`=== ${Runner.START_EVT} ===`);
      console.log(params);
    });
    evtEmt.on(Runner.END_EVT, params => {
      console.log(`=== ${Runner.END_EVT} ===`);
      console.log(params);
    });

    evtEmt.on(Runner.TRANSPILE_ERR_EVT, params => {
      console.log(`=== ${Runner.TRANSPILE_ERR_EVT} ===`);
      ErrorMessage.handleKeywordMessage(params);
    });
  }


  private getFileName (filepath:string) :string {
    let index = filepath.lastIndexOf('/');
    let dotIndex = filepath.lastIndexOf('.');
    
    return filepath.substring(index+1,dotIndex);
  }

  static parseProgramOpts (program) :Object{
    return R.pickBy((v,k)=> v !== undefined,
    {
      outputTS:program.skipOutputTS, linting:program.skipLinting, 
      outputDir:program.outputDir,skipRun:program.skipRun
    })
  }

}
