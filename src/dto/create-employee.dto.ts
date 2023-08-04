import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsObject, IsString, ValidateIf, ValidateNested } from "class-validator";
import Address from "../entity/address.entity";
import { Type } from "class-transformer";
import CreateAddressDto from "./create-address.dto";
import { Index } from "typeorm";
import { Status } from "../utils/status.enum";

class CreateEmployeeDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @Index({ unique: true })
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string

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
}

export default CreateEmployeeDto;