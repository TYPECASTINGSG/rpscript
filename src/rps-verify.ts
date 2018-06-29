#! /usr/bin/env node
import program from "commander";
import {ExecCommand} from './commands/exec';

program
  .description('verify if the script is valid')
  .parse(process.argv);

let filename = program.args[0];

let execCommand = new ExecCommand({skipRun:true});

execCommand.run(filename);