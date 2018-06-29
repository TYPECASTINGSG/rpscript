#! /usr/bin/env node
import program from "commander";
import {ExecCommand} from './commands/exec';

program
  .description('execute a script')
  .parse(process.argv);

// let opts = program.opts();
let filename = program.args[0];

let execCommand = new ExecCommand({});

execCommand.run(filename);