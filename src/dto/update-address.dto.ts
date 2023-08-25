import { IsString, ValidateIf } from "class-validator";
import { ValidateDto } from "./validate.dto";

class UpdateAddressDto implements ValidateDto {
    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    line1: string;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    line2: string;

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