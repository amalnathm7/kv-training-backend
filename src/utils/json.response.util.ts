import { winstonLogger } from "./winston.logger";
import { ResponseWithTrace } from "./response.with.trace";

export class JsonResponseUtil {
    static sendJsonResponse(statusCode: number, message: string, res: ResponseWithTrace, data: Object, startTime: Date, errors: Object = null) {
        const endTime = new Date();
        const tookTime = endTime.getTime() - startTime.getTime();

        let level = 'http';
        if (errors) {
            level = 'error';
        }
        winstonLogger.log({
            level: level,
            timeStamp: startTime,
            traceId: res.traceId,
            message: `${statusCode} ${message}`,
        });

        res.status(statusCode).send({
            data: data,
            errors: errors,
            message: message,
            meta: {
                "length": Array.isArray(data) ? data.length : 1,
                "took": tookTime,
                "total": Array.isArray(data) ? data.length : 1,
            }
        });
    }

    static sendJsonResponse200(res: ResponseWithTrace, data: Object, startTime: Date) {
        this.sendJsonResponse(200, "OK", res, data, startTime);
    }

    static sendJsonResponse201(res: ResponseWithTrace, data: Object, startTime: Date) {
        this.sendJsonResponse(201, "CREATED", res, data, startTime);
    }

    static sendJsonResponse204(res: ResponseWithTrace, startTime: Date) {
        this.sendJsonResponse(204, "NO CONTENT", res, {}, startTime);
    }

    static sendJsonResponse401(res: ResponseWithTrace, errors: Object) {
        this.sendJsonResponse(401, "UNAUTHORIZED", res, {}, new Date(), errors);
    }

    static sendJsonResponse403(res: ResponseWithTrace, errors: Object) {
        this.sendJsonResponse(403, "FORBIDDEN", res, {}, new Date(), errors);
    }

    static sendJsonResponse500(res: ResponseWithTrace, errors: Object) {
        this.sendJsonResponse(500, "INTERNAL SERVER ERROR", res, {}, new Date(), errors);
    }
}