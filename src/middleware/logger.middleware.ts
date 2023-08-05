import { NextFunction, Request} from "express";
import winstonLogger from "../utils/winston.logger";
import crypto from "crypto";
import { ResponseWithTrace } from "../utils/response.with.trace";

const loggerMiddleware = (req: Request, res: ResponseWithTrace, next: NextFunction) => {
    const traceId = crypto.randomUUID();
    
    res.traceId = traceId;
    
    winstonLogger.log({
        level: 'http',
        timeStamp: new Date(),
        traceId: res.traceId,
        message: `${req.method}: ${req.url}`,
    });
    next();
};

export default loggerMiddleware;