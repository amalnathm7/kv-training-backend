import { IsString, ValidateIf } from "class-validator";
import { ValidateDto } from "./validate.dto";

class UpdateDepartmentDto implements ValidateDto {
    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    name: string
}

export default UpdateDepartmentDto;