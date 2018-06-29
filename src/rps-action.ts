#! /usr/bin/env node
import program from "commander";
import {ModuleCommand} from './commands/modules';

program
  .description('display action detail')
  .parse(process.argv);

let opts = program.opts();

let modCommand = new ModuleCommand();
console.log('TODO: show action information');