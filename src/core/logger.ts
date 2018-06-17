import winston from 'winston';
import fs from 'fs';
import df from 'dateformat';

const { combine, timestamp, label, printf } = winston.format;

const customeLogFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
  });

export class Logger {
    private static instance: Logger;

    logger;
    runnerLogger;

    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    constructor(){
        this.logger = winston.createLogger({
            level: 'debug',
            // format: winston.format.json(),
            format: winston.format.simple(),
            transports: [
              new winston.transports.File({ filename: `${process.cwd()}/.rpscript/error.log`, level: 'error' }),
              new winston.transports.File({ filename: `${process.cwd()}/.rpscript/combined.log` })
            ]
          });
    }
    createRunnerLogger (fileName:string) :void{
        let runnerLogDir = `${process.cwd()}/.rpscript/logs/${fileName}`;
        let execTime:string = df('yy-mm-dd-HH-MM-ss');

        if(!fs.existsSync(runnerLogDir)) fs.mkdirSync(runnerLogDir);

        this.runnerLogger = winston.createLogger({
            level:'info',
            format: combine(
                label({ label: fileName }),
                timestamp(),
                customeLogFormat
              ),
            transports: [
              new winston.transports.File({ filename: `${runnerLogDir}/${execTime}.log`})
            ]
        })
    }
    

    log(level, message) {
        this.logger.log(level, message);
    }
}