import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { PermissionLevel } from "../utils/permission.level.enum";
import { Index } from "typeorm";
import { ValidateDto } from "./validate.dto";

class CreateRoleDto implements ValidateDto {
    @IsNotEmpty()
    @IsString()
    @Index({ unique: true })
    role: string

    @IsNotEmpty()
    @IsEnum(PermissionLevel)
    permissionLevel: PermissionLevel
}

export default CreateRoleDto;