#! /usr/bin/env node
import program from "commander";
import {ModuleCommand} from './commands/modules';

program
  .option('-a, --available', 'List all available modules for installation')
  .option('-i, --installed', 'List currently installed modules')
  .option('-j, --json', 'List raw JSON information')
  .description('list module information')
  .parse(process.argv);

let opts = program.opts();

let modCommand = new ModuleCommand();
if(opts.installed)
  console.log( modCommand.listInstalledModules() );
else if(opts.json)
  console.log( modCommand.listInstallModulesJson() );
else if(opts.available)
  console.log('TODO: list available modules for installation');
else
  console.log( modCommand.listInstalledModules() );