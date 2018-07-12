#! /usr/bin/env node
import program from "commander";
import {ModuleCommand} from './commands/modules';

program
  .description('install module')
  .parse(process.argv);


let modCommand = new ModuleCommand();

modCommand.install(program.args);