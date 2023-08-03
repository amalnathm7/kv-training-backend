import { IsEmail, IsEmpty, IsNotEmpty, IsObject, IsString, ValidateIf, ValidateNested } from "class-validator";
import Address from "../entity/address.entity";
import { Type } from "class-transformer";
import UpdateAddressDto from "./update-address.dto";

class UpdateEmployeeDto {
    @ValidateIf(value => value !== undefined)
    @IsString()
    name: string;

    @ValidateIf(value => value !== undefined)
    @IsEmail()
    email: string;

    @ValidateIf(value => value !== undefined)
    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => UpdateAddressDto)
    address: Address;
}

export default UpdateEmployeeDto;