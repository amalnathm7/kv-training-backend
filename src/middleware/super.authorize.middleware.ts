import { NextFunction, Response } from "express";
import { RequestWithUser } from "../utils/request.with.user";
import HttpException from "../exception/http.exception";
import { roleService } from "../route/role.route";
import { PermissionLevel } from "../utils/permission.level.enum";

const superAuthorize = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
) => {
    try {
        const roleId = req.role;

        const role = await roleService.getRole(roleId);

        if (role.permissionLevel !== PermissionLevel.SUPER) {
            throw new HttpException(403, "You are not authorized to perform this action", "FORBIDDEN");
        }

        next();
    } catch (error) {
        next(error);
    }
}

export default superAuthorize;