import { IsNotEmpty, IsString } from "class-validator";
import { ValidateDto } from "./validate.dto";

class LoginEmployeeDto implements ValidateDto  {
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string
}

export default LoginEmployeeDto;