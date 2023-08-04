import { IsString, ValidateIf } from "class-validator";

class UpdateAddressDto {
    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    addressLine1: string;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    addressLine2: string;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    city: string;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    state: string;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    country: string;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    pincode: string;
}

export default UpdateAddressDto;