import { IsString, ValidateIf } from "class-validator";

class UpdateAddressDto {
    @ValidateIf((obj, value) => value !== undefined)
    @IsString()
    line1: string;

    @ValidateIf((obj, value) => value !== undefined)
    @IsString()
    pincode: string;
}

export default UpdateAddressDto;