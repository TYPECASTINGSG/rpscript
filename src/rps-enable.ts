#! /usr/bin/env node
import program from "commander";
import {ModuleCommand} from './commands/modules';

program
  .option('-a, --available', 'List all available modules for installation')
  .option('-i, --installed', 'List currently installed modules')
  .description('list module information')
  .parse(process.argv);

let opts = program.opts();
// console.log(opts);

let modCommand = new ModuleCommand();

console.log('TODO: enable module or action');