#! /usr/bin/env node
import program from "commander";
import {ModuleCommand} from './commands/modules';

program
  .option('-d, --default', 'Show default action list')
  .description('display module information detail')
  .parse(process.argv);

let opts = program.opts();


let modCommand = new ModuleCommand();
if(opts.default)
  console.log(modCommand.listDefaultKeywords());
else
  console.log(modCommand.listDefaultKeywords());