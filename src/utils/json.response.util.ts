import winstonLogger from "./winston.logger";
import { ResponseWithLog } from "./response.with.log";

export class JsonResponseUtil {
    static sendJsonResponse(statusCode: number, message: string, res: ResponseWithLog, data: Object, errors: Object = null) {
        const endTime = new Date();
        const tookTime = endTime.getTime() - res.startTime.getTime();

        let level = 'http';
        if (errors) {
            level = 'error';
        }
        winstonLogger.log({
            level: level,
            timeStamp: res.startTime,
            traceId: res.traceId,
            message: `${statusCode} ${message}`,
        });

        let total = Array.isArray(data) ? data.length : 1;
        let offset = Number.isInteger(data[2]) ? data[2] : 0;

        if(Array.isArray(data) && Number.isInteger(data[1])) {
            total = data[1];
            data = data[0];
        }

        res.status(statusCode).send({
            data: data,
            errors: errors,
            message: message,
            meta: {
                "offset": offset,
                "length": Array.isArray(data) ? data.length : 1,
                "took": tookTime,
                "total": total,
            }
        });
    }

    static sendJsonResponse200(res: ResponseWithLog, data: Object) {
        this.sendJsonResponse(200, "OK", res, data);
    }

    static sendJsonResponse201(res: ResponseWithLog, data: Object) {
        this.sendJsonResponse(201, "CREATED", res, data);
    }

    static sendJsonResponse204(res: ResponseWithLog) {
        this.sendJsonResponse(204, "NO CONTENT", res, {});
    }

    static sendJsonResponse401(res: ResponseWithLog, errors: Object) {
        this.sendJsonResponse(401, "UNAUTHORIZED", res, {}, errors);
    }

    static sendJsonResponse403(res: ResponseWithLog, errors: Object) {
        this.sendJsonResponse(403, "FORBIDDEN", res, {}, errors);
    }

    static sendJsonResponse500(res: ResponseWithLog, errors: Object) {
        this.sendJsonResponse(500, "INTERNAL SERVER ERROR", res, {}, errors);
    }
}