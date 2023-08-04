import { IsEmail, IsNotEmpty, IsString } from "class-validator";

class LoginEmployeeDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string
}

export default LoginEmployeeDto;