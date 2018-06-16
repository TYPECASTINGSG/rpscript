import winston from 'winston';

export class Logger {
    private static instance: Logger;

    logger;

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
           
 
        //   if (process.env.NODE_ENV !== 'production') {
        //     this.logger.add(new winston.transports.Console({
        //       format: winston.format.simple()
        //     }));
        // }
    }

    log(level, message) {
        this.logger.log(level, message);
    }
}