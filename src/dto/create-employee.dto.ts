import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsObject, IsString, ValidateIf, ValidateNested } from "class-validator";
import Address from "../entity/address.entity";
import { Type } from "class-transformer";
import CreateAddressDto from "./create-address.dto";
import { Status } from "../utils/status.enum";
import { ValidateDto } from "./validate.dto";

class CreateEmployeeDto implements ValidateDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsString()
    phone: string

    @IsNotEmpty()
    @IsDateString()
    joiningDate: string

    @IsNotEmpty()
    @IsNumber()
    experience: number

    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    departmentId: string;

    @IsNotEmpty()
    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => CreateAddressDto)
    address: Address;

    @IsNotEmpty()
    @IsEnum(Status)
    status: Status

    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    roleId: string

    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    referrerId: string
}

export default CreateEmployeeDto;