import { NextFunction, Request, Response } from "express";
import HttpException from "../exception/http.exception";
import ValidationException from "../exception/validation.exception";
import { JsonWebTokenError } from "jsonwebtoken";
import { JsonResponseUtil } from "../utils/json.response.util";

const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
    try {
        if (error instanceof JsonWebTokenError) {
            JsonResponseUtil.sendJsonResponse403(res, { error: error.message });
        } else if (error instanceof ValidationException) {
            JsonResponseUtil.sendJsonResponse(
                error.status,
                error.message.toUpperCase(),
                res,
                {},
                new Date(),
                error.errors
            );
        } else if (error instanceof HttpException) {
            JsonResponseUtil.sendJsonResponse(
                error.status,
                error.statusMessage.toUpperCase(),
                res,
                {},
                new Date(),
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