import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { PermissionLevel } from "../utils/permission.level.enum";
import { Index } from "typeorm";

class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    @Index({ unique: true })
    role: string

    @IsNotEmpty()
    @IsEnum(PermissionLevel)
    permissionLevel: PermissionLevel
}

export default CreateRoleDto;