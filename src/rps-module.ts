#! /usr/bin/env node
import program from "commander";
import {ModuleCommand} from './commands/modules';

program
  .description('Show module information')
  .parse(process.argv);

let mod = program.args[0];

let modCommand = new ModuleCommand();

console.log( modCommand.listModuleInfo(mod) );
