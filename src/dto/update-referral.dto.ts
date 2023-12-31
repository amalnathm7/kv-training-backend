import {
  IsEnum,
  IsNumber,
  IsObject,
  IsString,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import Address from "../entity/address.entity";
import { Type } from "class-transformer";
import CreateAddressDto from "./create-address.dto";
import { CandidateStatus } from "../utils/status.enum";
import { ValidateDto } from "./validate.dto";

class UpdateReferralDto implements ValidateDto {
  @ValidateIf((obj) => obj.value !== undefined)
  @IsString()
  name: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsString()
  email: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNumber()
  experience: number;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsString()
  phone: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsEnum(CandidateStatus)
  status: CandidateStatus;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsString()
  resume: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsString()
  referredById: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDto)
  address: Address;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsString()
  roleId: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsString()
  openingId: string;
}

export default UpdateReferralDto;
