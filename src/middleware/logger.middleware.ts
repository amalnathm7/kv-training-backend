import { NextFunction } from "express";
import winstonLogger from "../utils/winston.logger";
import crypto from "crypto";
import { ResponseWithLog } from "../utils/response.with.log";
import { RequestWithUser } from "../utils/request.with.user";

const loggerMiddleware = (req: RequestWithUser, res: ResponseWithLog, next: NextFunction) => {
    const traceId = crypto.randomUUID();

    res.traceId = traceId;
    res.startTime = new Date();

    winstonLogger.log({
        level: 'http',
        timeStamp: new Date(),
        traceId: res.traceId,
        message: `${req.method}: ${req.url}`,
    });
    next();
};

export default loggerMiddleware;