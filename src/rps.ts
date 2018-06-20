import program from "commander";

import {ReplCommand} from './commands/repl';
import {VersionCommand} from './commands/version';

import {NEW_DESCRIPTION, NEW_HELP, RUN_DESCRIPTION, RUN_HELP,
COMPILE_DESCRIPTION, COMPILE_HELP,REPL_DESCRIPTION,REPL_HELP} from './doc-content';

program
  .option("-v, --version", "output the version number", () =>{
    let v = new VersionCommand();
    console.log(v.getVersions())
  })
  .option('-o, --output', 'Output Typescript file')
  .description('******************************************** ' + '\n' +
  "   ____  ____    ____            _       _" + '\n' +
  "  |  _ \\\|  _ \\  / ___|  ___ _ __(_)_ __ | |_ " + '\n' +
  "  | |_) | |_) | \\___ \\ / __| '__| | '_ \\| __|" + '\n' +
  "  |  _ <|  __/   ___) | (__| |  | | |_) | |_ " + '\n' +
  "  |_| \\_\\_|     |____/ \\___|_|  |_| .__/ \\__|" + '\n' +
  "                                  |_|         " + '\n' +
  '  ******************************************** ')
  .usage('[filename] [options]');

  program.parse(process.argv);

  // if(process.argv.length < 3)
  //   program.help();

  let filename = undefined;
  let command = new ReplCommand();

  if(process.argv.length < 3) {
    
    command.repl();

  }else if(process.argv[2].indexOf('.rps')>0) {
    
    filename = process.argv[2];
    command.run(filename);
  
  }
  
  

  // console.log(program.output);

  // program
  // .command('*')
  // .description(RUN_DESCRIPTION)
  // .on('--help', () => {
  //   console.log(RUN_HELP)
  // })
  // .action (async (filename, cmd) => {
  //   console.log('runnnn...');
  //   // let execCom = new ExecCommand();
  //   // await execCom.execute(filename);
  // });

//  program
//   .command('run <filename>')
//   .description(RUN_DESCRIPTION)
//   .on('--help', () => {
//     console.log(RUN_HELP)
//   })
//   .action (async (filename, cmd) => {
//     let execCom = new ExecCommand();
//     await execCom.execute(filename);
//   });

//   program
//   .command('compile <filename>')
//   .description(COMPILE_DESCRIPTION)
//   .on('--help', () => {
//     console.log(COMPILE_HELP)
//   })
//   .action ((filename, cmd) => {
//     let compileCom = new CompileCommand();
//     compileCom.execute(filename);
//   });

//   program
//   .command('repl')
//   .description(REPL_DESCRIPTION)
//   .on('--help', () => {
//     console.log(REPL_HELP)
//   })
//   .action ((dir, cmd) => {
//     let replCom = new ReplCommand();
//     replCom.execute();
//   });


