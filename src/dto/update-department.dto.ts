import { IsString, ValidateIf } from "class-validator";

class UpdateDepartmentDto {
    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    name: string

    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    description: string;
}

export default UpdateDepartmentDto;