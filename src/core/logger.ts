import winston from 'winston';
import fs from 'fs';
import df from 'dateformat';
const HOMEDIR = require('os').homedir();

const { combine, timestamp, label, printf } = winston.format;

const runnerLogFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
  });

const moduleLogFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
  });

export class Logger {

    constructor(){}

    static createModuleLogger () : any {
        let modLogDir = `${process.cwd()}/.rpscript/logs`;
        if(!fs.existsSync(modLogDir)) fs.mkdirSync(modLogDir);

        return winston.createLogger({
            level: 'debug',
            format: combine(timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),moduleLogFormat),
            transports: [
              new winston.transports.File({ filename: `${modLogDir}/module_error.log`, level: 'error' }),
              new winston.transports.File({ filename: `${modLogDir}/module.log` }),
              new winston.transports.Console({format: combine(timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),moduleLogFormat)})
            ]
          });
    }
    static createRunnerLogger (fileName:string,debug?:boolean) :any{
        let modLogDir = `${process.cwd()}/.rpscript/logs`;
        if(!fs.existsSync(modLogDir)) fs.mkdirSync(modLogDir);

        let runnerLogDir = `${process.cwd()}/.rpscript/logs/runner/`;
        if(!fs.existsSync(runnerLogDir)) fs.mkdirSync(runnerLogDir);

        let logFile:string = df('yy-mm-dd-HH-MM-ss')+'-run.log';

        if(!fs.existsSync(runnerLogDir)) fs.mkdirSync(runnerLogDir);

        let level = debug ? 'debug' : 'info';

        let log = winston.createLogger({
            level:level,
            format: combine(label({ label: fileName }),timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),runnerLogFormat),
            transports: [
              new winston.transports.File({ filename: `${runnerLogDir}/${logFile}`})
            ]
        })
        
        // if(debug){
        log.add(
            new winston.transports.Console(
                {format: combine(timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),moduleLogFormat)}));
        // }

        return log;
    }
 
}