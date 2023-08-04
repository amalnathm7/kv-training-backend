import { ValidationError } from "class-validator";
import HttpException from "./http.exception";

class ValidationException extends HttpException {
    public errors: Object;

    constructor(errors: ValidationError[]) {
        super(400, "Validation Errors");

        this.errors = this.generateErrorObject(errors);
    }

    private generateErrorObject(errors: ValidationError[]) {
        let errorObject: Object = {};

        for (const error of errors) {
            const property = error.property;
            const constraints = error.constraints;
            
            if (error.children.length > 0) {
                errorObject[property] = this.generateErrorObject(error.children);
            } else {
                errorObject[property] = Object.values(constraints);
            }
        }

        return errorObject;
    }
}

export default ValidationException;