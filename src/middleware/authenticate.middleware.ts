import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { RequestWithUser } from "../utils/request.with.user";
import { jwtPayload } from "../utils/jwt.payload.type";

const authenticate = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const token = getTokenFromRequestHeader(req);
        const payload: jwtPayload = jwt.verify(token, process.env.JWT_SECRET) as jwtPayload;
        // Inject into req
        req.name = payload.name;
        req.email = payload.email;
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