import winston from "winston";

export const winstonLogger = winston.createLogger({
    level: 'verbose',
    format: winston.format.prettyPrint(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: __dirname + '/../../logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: __dirname + '/../../logs/server.log' })
    ]
});