import { NextFunction, Request } from "express";
import HttpException from "../exception/http.exception";
import ValidationException from "../exception/validation.exception";
import { JsonWebTokenError } from "jsonwebtoken";
import { JsonResponseUtil } from "../utils/json.response.util";
import { ResponseWithLog } from "../utils/response.with.log";

const errorMiddleware = (error: Error, req: Request, res: ResponseWithLog, next: NextFunction) => {
    try {
        if (error instanceof JsonWebTokenError) {
            JsonResponseUtil.sendJsonResponse403(res, { error: error.message });
        } else if (error instanceof ValidationException) {
            JsonResponseUtil.sendJsonResponse(
                error.status,
                error.message.toUpperCase(),
                res,
                {},
                error.errors
            );
        } else if (error instanceof HttpException) {
            JsonResponseUtil.sendJsonResponse(
                error.status,
                error.statusMessage.toUpperCase(),
                res,
                {},
                { error: error.message }
            );
        } else {
            JsonResponseUtil.sendJsonResponse500(res, { error: error.message });
        }
    }
    catch (error) {
        next(error);
    }
}

export default errorMiddleware;