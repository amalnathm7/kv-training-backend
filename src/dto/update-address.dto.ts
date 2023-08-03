import { IsString, ValidateIf } from "class-validator";

class UpdateAddressDto {
    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    line1: string;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    pincode: string;
}

export default UpdateAddressDto;