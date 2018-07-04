import {Runner} from 'rpscript-parser';
import { EventEmitter } from 'events';
import {Logger} from '../core/logger';
import {ErrorMessage} from '../format/error_msg';
import fs from 'fs';
import R from 'ramda';

export class ExecCommand {

  runner:Runner;
  logger:any;

  constructor(config, event?:(evt:EventEmitter)=>void) {
    this.runner = new Runner(config);

    if(!event)
      this.registerDefaultEvents(this.runner);
    else
      event(this.runner);
  }

  async run(filename:string) : Promise<any>{
    this.logger = Logger.createRunnerLogger(filename);

    try{
      let result = await this.runner.execute(filename);

      return result;
    
    }catch(er){
      console.error(er);
    }
  }

  registerDefaultEvents(evtEmt:EventEmitter) : void{
    evtEmt.on(Runner.COMPILE_START_EVT, params => {
      this.logger.info('compilation - start for '+params);
    });
    evtEmt.on(Runner.COMPILED_EVT, params => {
      this.logger.info('compilation - completed');
      // console.log(params.transpile);
    });
    evtEmt.on(Runner.LINT_EVT, params => {
      this.logger.info('linting - completed');
    });
    evtEmt.on(Runner.TRANSPILE_EVT, params => {
      // console.log(params.fullContent);
      fs.writeFileSync('.rpscript/temp.ts',params.fullContent);

      this.logger.debug('transpilation completed. output save to .rpscript/temp.ts');
    });
    evtEmt.on(Runner.MOD_DISABLED_EVT, params => {
      this.logger.info('module - disabled '+params);
    });
    evtEmt.on(Runner.MOD_LOADED_EVT, params => {
      this.logger.info('module - loaded '+params);
    });

    evtEmt.on(Runner.TRANSPILE_ERR_EVT, params => {
      ErrorMessage.handleKeywordMessage(params);
    });



    evtEmt.on(Runner.START_EVT, params => {
      this.logger.info('start of execution');
    });
    evtEmt.on(Runner.ACTION_EVT, (args) => {
      let arg = args[0];
      let modName = arg[0], actionName = arg[1], evt = arg[2], params = arg[3];

      this.logger.info(`action - ${evt} ${actionName} `);
    });
    evtEmt.on(Runner.END_EVT, params => {
      this.logger.info('end of execution');
    });

    evtEmt.on(Runner.CTX_PRIOR_SET_EVT, params => {
      this.logger.info(`Priority set => ${params}`);
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
      outputDir:program.outputDir,skipRun:program.skipRun,
      modules:program.modules
    })
  }

}
