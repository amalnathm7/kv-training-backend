import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from "class-validator";
import Address from "../entity/address.entity";
import { Type } from "class-transformer";
import CreateAddressDto from "./create-address.dto";
import { ValidateDto } from "./validate.dto";

class CreateReferralDto implements ValidateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  experience: number;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  resume: string;

  @IsNotEmpty()
  @IsString()
  referredById: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDto)
  address: Address;

  @IsNotEmpty()
  @IsString()
  roleId: string;

  @IsNotEmpty()
  @IsString()
  openingId: string;
}

export default CreateReferralDto;
