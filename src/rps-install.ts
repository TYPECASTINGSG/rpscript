#! /usr/bin/env node
import program from "commander";
import {ModuleCommand} from './commands/modules';

program
  .description('install module')
  .option('-a, --allowExternalModule', 'Allow modules other than publish by typecasting')
  .parse(process.argv);


let modCommand = new ModuleCommand();

modCommand.install(!!program.allowExternalModule, program.args);