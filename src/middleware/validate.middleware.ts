import { NextFunction, Request } from "express"
import { validate } from "class-validator";
import ValidationException from "../exception/validation.exception";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { ResponseWithLog } from "../utils/response.with.log";
import { ValidateDto } from "../dto/validate.dto";

const validateMiddleware = (Dto: ClassConstructor<ValidateDto>) => async (req: Request, res: ResponseWithLog, next: NextFunction) => {
    try {
        const dto = plainToInstance(Dto, req.body);
        const errors = await validate(dto);
        if (errors.length > 0) {
            throw new ValidationException(errors);
        }
        res.dto = dto;
        next();
    } catch (error) {
        next(error);
    }
}

export default validateMiddleware;