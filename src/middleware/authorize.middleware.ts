import { NextFunction, Response } from "express";
import { RequestWithUser } from "../utils/request.with.user";
import { Role } from "../utils/role.enum";
import HttpException from "../exception/http.exception";

const authorize = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
) => {
    try {
        const role = req.role;

        if (role !== Role.HR) {
            throw new HttpException(403, "You are not authorized to perform this action");
        }

        next();
    } catch (error) {
        next(error);
    }
}

export default authorize;