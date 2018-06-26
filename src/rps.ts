#! /usr/bin/env node
import program from "commander";
import R from 'ramda';

import {ExecCommand} from './commands/exec';
import {VersionCommand} from './commands/version';

import {NEW_DESCRIPTION, NEW_HELP, RUN_DESCRIPTION, RUN_HELP,
COMPILE_DESCRIPTION, COMPILE_HELP,REPL_DESCRIPTION,REPL_HELP} from './doc-content';
import { ModuleMgr } from "rpscript-parser";

program
  .option("-v, --version", "output the version number", () =>{
    let v = new VersionCommand();
    console.log(v.getVersions());
  })
  .option('-o, --skipOutputTS', 'Output Typescript file')
  .option('-l, --skipLinting', 'Lint Output Typescript file')
  .option('-s, --skipRun', 'Skip running the program')
  .option('-d, --outputDir <path>', 'Working directory path for logs and temp files')
  .description('******************************************** ' + '\n' +
  "   ____  ____    ____            _       _" + '\n' +
  "  |  _ \\\|  _ \\  / ___|  ___ _ __(_)_ __ | |_ " + '\n' +
  "  | |_) | |_) | \\___ \\ / __| '__| | '_ \\| __|" + '\n' +
  "  |  _ <|  __/   ___) | (__| |  | | |_) | |_ " + '\n' +
  "  |_| \\_\\_|     |____/ \\___|_|  |_| .__/ \\__|" + '\n' +
  "                                  |_|         " + '\n' +
  '  ******************************************** ')
  .usage('[filename] [options]');


  program
    .command('module <operation> [moduleNames...]')
    .action(function(operation,moduleNames,cmd){
      let mgr = new ModuleMgr();
      // console.log(operation+" , "+moduleNames);

      if(operation === 'list') console.log(mgr.listModuleFull() );
      else if(operation === 'install')mgr.installModule(moduleNames[0]);
      else if(operation === 'remove')mgr.removeModule(moduleNames[0]);
    });

  program.parse(process.argv);

  let filename = undefined;
  let command = new ExecCommand(
    R.pickBy((v,k)=> v !== undefined,
      {
        outputTS:program.skipOutputTS, linting:program.skipLinting, 
        outputDir:program.outputDir,skipRun:program.skipRun
      })
    );

  let hasRpsFile:boolean = R.any(arg => arg.indexOf('.rps')>0, process.argv);

  if(process.argv.length < 3){
    program.help();
  }

  else if(process.argv[2].indexOf('.rps')>0) { 
    filename = process.argv[2];
    command.run(filename);
  }else if (!hasRpsFile){
  }
  
  process.on('unhandledRejection', (reason, promise) => {
    console.log('RPscript : Unhandled Rejection at:', reason.stack || reason);
    // Recommended: send the information to sentry.io
    // or whatever crash reporting service you use
  })
