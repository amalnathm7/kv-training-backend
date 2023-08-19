import {  IsNotEmpty,  IsNumber,  IsString,  ValidateIf,  ValidateNested,} from "class-validator";
import { ValidateDto } from "./validate.dto";

class CreateOpeningDto implements ValidateDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  descrption: string;

  @IsNotEmpty()
  @IsString()
  skills: string;

  @IsNotEmpty()
  @IsNumber()
  count: number;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsNumber()
  experience: number;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsString()
  departmentId: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsString()
  roleId: string;
}

export default CreateOpeningDto;