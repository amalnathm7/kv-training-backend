import { Request } from "express";

export interface RequestWithUser extends Request {
    name: string,
    username: string,
    role: string,
}