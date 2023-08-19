import { IsInt, IsString, ValidateIf, ValidateNested } from "class-validator";
import { ValidateDto } from "./validate.dto";

class UpdateOpeningDto implements ValidateDto {
    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    title: string;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    description: string;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    skills: string;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsInt()
    count: number;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    location: string;

    @ValidateIf((obj) => obj.value !== undefined)
    @IsInt()
    experience: number;

    @ValidateIf((obj) => obj.value !== undefined)
    @ValidateNested({ each:true })
    @IsString()
    departmentId: string;

    @ValidateIf((obj) => obj.value !== undefined)
    @ValidateNested({ each:true })
    @IsString()
    roleId: string;
}

export default UpdateOpeningDto;