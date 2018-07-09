#! /usr/bin/env node
import program from "commander";
import R from 'ramda';
import fs from 'fs';

import {ExecCommand} from './commands/exec';
import {VersionCommand} from './commands/version';
import {ModuleCommand} from './commands/modules';

import {NEW_DESCRIPTION, NEW_HELP, RUN_DESCRIPTION, RUN_HELP,
COMPILE_DESCRIPTION, COMPILE_HELP,REPL_DESCRIPTION,REPL_HELP} from './doc-content';

program
  .option("-v, --version", "output the version number", () =>{
    let v = new VersionCommand();
    console.log(v.getVersions());
  })
  .option('-m, --modules <mods>', 'Only load these modules',(val) => val.split(','))
  // .option('-o, --skipOutputTS', 'Output Typescript file')
  // .option('-l, --skipLinting', 'Lint Output Typescript file')
  // .option('-s, --skipRun', 'Skip running the program')
  // .option('-d, --outputDir <path>', 'Working directory path for logs and temp files')
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
  .option('-d, --debug', 'debug on console')
  .command('run <filename>', 'execute the script')
  .command('verify <filename>', 'verify if the script is valid')
  .command('install [modules]', 'install one or more modules')
  .command('remove [modules]', 'remove one or more modules')
  .command('modules', 'list modules information')
  .command('module <module>', 'show module information')
  .command('actions', 'list actions information')
  .command('action <action>', 'show action information');
  // .command('enable', 'enable a module or an action')
  // .command('disable', 'disable a module or an action');
  
  //modules <module>  --installed --available
  //actions  <action> --defaults  
  //enable  <name> --module --action
  //disable <name> --module --action

  program.parse(process.argv);

  dirSetup();

  let filename = undefined;
  let command = new ExecCommand( ExecCommand.parseProgramOpts(program) );

  let hasRpsFile:boolean = R.any(arg => arg.indexOf('.rps')>0, process.argv);

  if(process.argv.length < 3){
    program.help();
  }

  else if(process.argv[2].indexOf('.rps')>0) { 
    filename = process.argv[2];
    command.run(filename);

  }else if (!hasRpsFile){
    // console.log('an extension .rps is required for filename');
  }
  
  process.on('unhandledRejection', (reason, promise) => {
    console.log('RPscript : Unhandled Rejection at:', reason.stack || reason);
    // Recommended: send the information to sentry.io
    // or whatever crash reporting service you use
  })

  function dirSetup () {
    
    let config = {
      outputDir:'.rpscript'
    }
            
    if(!fs.existsSync(config['outputDir'])) {
        fs.mkdirSync(config['outputDir']);
        fs.mkdirSync(config['outputDir']+'/logs');
    }
  }