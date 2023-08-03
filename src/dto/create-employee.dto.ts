import { IsEmail, IsNotEmpty, IsObject, IsString, ValidateNested } from "class-validator";
import Address from "../entity/address.entity";
import { Type } from "class-transformer";
import CreateAddressDto from "./create-address.dto";

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
}

export default CreateEmployeeDto;