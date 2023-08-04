import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsObject, IsString, ValidateIf, ValidateNested } from "class-validator";
import Address from "../entity/address.entity";
import { Type } from "class-transformer";
import CreateAddressDto from "./create-address.dto";
import { Role } from "../utils/role.enum";
import Department from "../entity/department.entity";
import CreateDepartmentDto from "./create-department.dto";

class CreateEmployeeDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => CreateAddressDto)
    address: Address;

    @IsNotEmpty()
    @IsNumber()
    departmentId: number;

    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsEnum(Role)
    role: Role
}

export default CreateEmployeeDto;