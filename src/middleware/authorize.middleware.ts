import { NextFunction } from "express";
import { RequestWithUser } from "../utils/request.with.user";
import HttpException from "../exception/http.exception";
import { PermissionLevel } from "../utils/permission.level.enum";
import RoleService from "../service/role.service";
import RoleRepository from "../repository/role.repository";
import dataSource from "../db/postgres.db";
import { Role } from "../entity/role.entity";
import { ResponseWithTrace } from "../utils/response.with.trace";

const authorize = async (
    req: RequestWithUser,
    res: ResponseWithTrace,
    next: NextFunction
) => {
    try {
        const roleId = req.role;

        if (roleId === "") {
            throw new HttpException(403, "You are not authorized to perform this action", "FORBIDDEN");
        }

        const role = await (new RoleService(new RoleRepository(dataSource.getRepository(Role)))).getRole(roleId);

        if (!role || role.permissionLevel === PermissionLevel.BASIC) {
            throw new HttpException(403, "You are not authorized to perform this action", "FORBIDDEN");
        }

        next();
    } catch (error) {
        next(error);
    }
}

const superAuthorize = async (
    req: RequestWithUser,
    res: ResponseWithTrace,
    next: NextFunction
) => {
    try {
        const roleId = req.role;

        if (roleId === "") {
            throw new HttpException(403, "You are not authorized to perform this action", "FORBIDDEN");
        }

        const role = await (new RoleService(new RoleRepository(dataSource.getRepository(Role)))).getRole(roleId);

        if (!role || role.permissionLevel !== PermissionLevel.SUPER) {
            throw new HttpException(403, "You are not authorized to perform this action", "FORBIDDEN");
        }

        next();
    } catch (error) {
        next(error);
    }
}

export { authorize, superAuthorize };