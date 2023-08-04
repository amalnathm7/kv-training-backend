import { IsNotEmpty, IsString } from "class-validator";

class LoginEmployeeDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string
}

export default LoginEmployeeDto;