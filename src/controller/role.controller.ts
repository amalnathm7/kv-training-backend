import express, { NextFunction, Request, Response } from "express"
import RoleService from "../service/role.service";
import { plainToInstance } from "class-transformer";
import CreateRoleDto from "../dto/create-role.dto";
import { validate } from "class-validator";
import ValidationException from "../exception/validation.exception";
import { JsonResponseUtil } from "../utils/json.response.util";
import authenticate from "../middleware/authenticate.middleware";
import { authorize, superAuthorize } from "../middleware/authorize.middleware";
import UpdateRoleDto from "../dto/update-role.dto";
import { ResponseWithTrace } from "../utils/response.with.trace";

class RoleController {
    public router: express.Router;

    constructor(private roleService: RoleService) {
        this.router = express.Router();
        this.router.get("/", authenticate, authorize, this.getAllRoles);
        this.router.post("/", authenticate, superAuthorize, this.createRole);
        this.router.get("/:id", authenticate, authorize, this.getRole);
        this.router.put("/:id", authenticate, superAuthorize, this.setRole);
        this.router.patch("/:id", authenticate, superAuthorize, this.updateRole);
        this.router.delete("/:id", authenticate, superAuthorize, this.deleteRole);
    }

    getAllRoles = async (req: Request, res: ResponseWithTrace, next: NextFunction) => {
        try {
            const startTime = new Date();
            const roles = await this.roleService.getAllRoles();
            JsonResponseUtil.sendJsonResponse200(res, roles, startTime);
        } catch (e) {
            next(e);
        }
    }

    getRole = async (req: Request, res: ResponseWithTrace, next: NextFunction) => {
        try {
            const startTime = new Date();
            const roleId = req.params.id;
            const role = await this.roleService.getRole(roleId);
            JsonResponseUtil.sendJsonResponse200(res, role, startTime);
        } catch (e) {
            next(e);
        }
    }

    setRole = async (req: Request, res: ResponseWithTrace, next: NextFunction) => {
        try {
            const startTime = new Date();
            const roleId = req.params.id;
            const createRoleDto = plainToInstance(CreateRoleDto, req.body);
            const errors = await validate(createRoleDto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            } else {
                await this.roleService.updateRole(roleId, createRoleDto);
                JsonResponseUtil.sendJsonResponse204(res, startTime);
            }
        } catch (e) {
            next(e);
        }
    }

    updateRole = async (req: Request, res: ResponseWithTrace, next: NextFunction) => {
        try {
            const startTime = new Date();
            const roleId = req.params.id;
            const updateRoleDto = plainToInstance(UpdateRoleDto, req.body);
            const errors = await validate(updateRoleDto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            } else {
                await this.roleService.updateRole(roleId, updateRoleDto);
                JsonResponseUtil.sendJsonResponse204(res, startTime);
            }
        } catch (e) {
            next(e);
        }
    }

    deleteRole = async (req: Request, res: ResponseWithTrace, next: NextFunction) => {
        try {
            const startTime = new Date();
            const roleId = req.params.id;
            await this.roleService.deleteRole(roleId);
            JsonResponseUtil.sendJsonResponse204(res, startTime);
        } catch (e) {
            next(e);
        }
    }

    createRole = async (req: Request, res: ResponseWithTrace, next: NextFunction) => {
        try {
            const startTime = new Date();
            const createRoleDto = plainToInstance(CreateRoleDto, req.body);
            const errors = await validate(createRoleDto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            } else {
                const newRole = await this.roleService.createRole(createRoleDto);
                JsonResponseUtil.sendJsonResponse201(res, newRole, startTime);
            }
        } catch (e) {
            next(e);
        }
    }
}

export default RoleController;