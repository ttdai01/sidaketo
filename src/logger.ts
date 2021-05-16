import {
  createLogger,
  format,
  transports
} from 'winston';

const logTransports: any[] = [];

logTransports.push(
  new transports.Console({
    level: 'debug',
    format: format.prettyPrint()
  })
);


logTransports.push(
    new transports.File({
      level: 'error',
      filename: './logs/error.log',
      format: format.json({
        replacer: (key: any, value: any) => {
          if (key === 'error') {
            return {
              message: (value as Error).message,
              stack: (value as Error).stack
            };
          }
          return value;
        }
      })
    })
  );
  logTransports.push(
    new transports.File({
      level: 'info',
      filename: './logs/info.log',
      format: format.json({
        replacer: (key:any, value:any) => {
          if (key === 'info') {
            return {
              message: (value as Error).message,
              stack: (value as Error).stack
            };
          }
          return value;
        }
      })
    })
);


const logger = createLogger({
    format: format.combine(
      format.timestamp()
    ),
    transports: logTransports,
    defaultMeta: { app: process.env.APP, stage: process.env.STAGE }
  });
  
  export default logger;