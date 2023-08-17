import { PermissionLevel } from "./permission.level.enum"

export type jwtPayload = {
    name: string,
    username: string,
    permissionLevel: PermissionLevel
}