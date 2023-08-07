import { Response } from "express";
import { ValidateDto } from "../dto/validate.dto";

export interface ResponseWithLog extends Response {
    traceId: string,
    startTime: Date,
    dto: ValidateDto,
}