import { IsEnum, IsString, ValidateIf } from "class-validator";
import { PermissionLevel } from "../utils/permission.level.enum";
import { Index } from "typeorm";

class UpdateRoleDto {
    @ValidateIf((obj) => obj.value !== undefined)
    @IsString()
    @Index({ unique: true })
    role: string

    @ValidateIf((obj) => obj.value !== undefined)
    @IsEnum(PermissionLevel)
    permissionLevel: PermissionLevel
}

export default UpdateRoleDto;