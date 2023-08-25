import { IsNotEmpty, IsString } from "class-validator";
import { ValidateDto } from "./validate.dto";

class CreateAddressDto implements ValidateDto {
    @IsNotEmpty()
    @IsString()
    line1: string;

    @IsNotEmpty()
    @IsString()
    line2: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsString()
    state: string;

    @IsNotEmpty()
    @IsString()
    country: string;

    @IsNotEmpty()
    @IsString()
    pincode: string;
}

export default CreateAddressDto;