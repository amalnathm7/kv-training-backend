import { IsString, ValidateIf } from "class-validator";

class UpdateAddressDto {
    @ValidateIf(value => value !== undefined)
    @IsString()
    line1: string;

    @ValidateIf(value => value !== undefined)
    @IsString()
    pincode: string;
}

export default UpdateAddressDto;