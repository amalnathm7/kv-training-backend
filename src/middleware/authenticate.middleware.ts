import { NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import { RequestWithUser } from "../utils/request.with.user";
import { jwtPayload } from "../utils/jwt.payload.type";
import { ResponseWithLog } from "../utils/response.with.log";

const authenticate = async (req: RequestWithUser, res: ResponseWithLog, next: NextFunction) => {
    try {
        const token = getTokenFromRequestHeader(req);
        const payload: jwtPayload = jwt.verify(token, process.env.JWT_SECRET) as jwtPayload;
        req.name = payload.name;
        req.username = payload.username;
        req.role = payload.role;
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        next(error);
    }
}

const getTokenFromRequestHeader = (req: Request) => {
    const bearerToken = req.header("Authorization");
    const token = bearerToken ? bearerToken.replace("Bearer ", "") : "";
    return token;
}

export default authenticate;