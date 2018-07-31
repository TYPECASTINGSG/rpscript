#! /usr/bin/env node
import program from "commander";
import {ModuleCommand} from './commands/modules';

program
  .description('List installed actions')
  .parse(process.argv);

let opts = program.opts();


let modCommand = new ModuleCommand();
if(opts.default)
  console.log(modCommand.listDefaultKeywords());
else
  console.log(modCommand.listDefaultKeywords());