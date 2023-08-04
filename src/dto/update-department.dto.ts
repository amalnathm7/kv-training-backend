import { IsString, ValidateIf } from "class-validator";

class UpdateDepartmentDto {
    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    name: string
}

export default UpdateDepartmentDto;