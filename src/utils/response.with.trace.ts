import { Response } from "express";

export interface ResponseWithTrace extends Response {
    traceId: string
}