#! /usr/bin/env node
import program from "commander";
import {ModuleCommand} from './commands/modules';

program
  .description('remove module')
  .parse(process.argv);

let moduleName = program.args[0];

let modCommand = new ModuleCommand();

modCommand.remove([moduleName]);