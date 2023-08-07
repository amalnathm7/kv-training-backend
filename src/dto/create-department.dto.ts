import { IsNotEmpty, IsString } from "class-validator";
import { ValidateDto } from "./validate.dto";

class CreateDepartmentDto implements ValidateDto {
    @IsNotEmpty()
    @IsString()
    name: string
}

export default CreateDepartmentDto;