import { IsDateString, IsEnum, IsNumber, IsObject, IsString, ValidateIf, ValidateNested } from "class-validator";
import Address from "../entity/address.entity";
import { Type } from "class-transformer";
import UpdateAddressDto from "./update-address.dto";
import { Index } from "typeorm";
import { Status } from "../utils/status.enum";

class UpdateEmployeeDto {
    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    name: string;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    @Index({ unique: true })
    username: string;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    password: string;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsDateString()
    joiningDate: string;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsNumber()
    experience: number;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    departmentId: string

    @ValidateIf((obj) => obj.value !== undefined)
    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => UpdateAddressDto)
    address: Address;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    roleId: string

    @ValidateIf((obj) => obj.value !== undefined)
    @IsEnum(Status)
    status: Status
}

export default UpdateEmployeeDto;