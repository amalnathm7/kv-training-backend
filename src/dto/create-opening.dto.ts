import {  IsNotEmpty,  IsNumber,  IsString,  ValidateIf,  ValidateNested,} from "class-validator";
import { ValidateDto } from "./validate.dto";

class CreateOpeningDto implements ValidateDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

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

  @IsNotEmpty()
  @IsString()
  departmentId: string;

  @IsNotEmpty()
  @IsString()
  roleId: string;
}

export default CreateOpeningDto;