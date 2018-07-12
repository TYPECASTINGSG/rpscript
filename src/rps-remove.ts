#! /usr/bin/env node
import program from "commander";
import {ModuleCommand} from './commands/modules';

program
  .description('remove module')
  .option('-a, --all', 'remove all modules')
  .parse(process.argv);

let all = program.all;

let modCommand = new ModuleCommand();

if(all){
  let o = modCommand.listInstalledModulesArr();
  modCommand.remove(o);
}else {
  modCommand.remove(program.args);
}
