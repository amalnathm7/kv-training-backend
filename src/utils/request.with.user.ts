import { Request } from "express";

export interface RequestWithUser extends Request {
    name: string,
    email: string,
    role: string,
}