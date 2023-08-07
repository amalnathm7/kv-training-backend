import express, { NextFunction, Request } from "express"
import RoleService from "../service/role.service";
import CreateRoleDto from "../dto/create-role.dto";
import { JsonResponseUtil } from "../utils/json.response.util";
import authenticate from "../middleware/authenticate.middleware";
import { authorize, superAuthorize } from "../middleware/authorize.middleware";
import UpdateRoleDto from "../dto/update-role.dto";
import { ResponseWithLog } from "../utils/response.with.log";
import validateMiddleware from "../middleware/validate.middleware";

class RoleController {
    public router: express.Router;

    constructor(private roleService: RoleService) {
        this.router = express.Router();
        this.router.get("/", authenticate, authorize, this.getAllRoles);
        this.router.post("/", authenticate, superAuthorize, validateMiddleware(CreateRoleDto), this.createRole);
        this.router.get("/:id", authenticate, authorize, this.getRole);
        this.router.put("/:id", authenticate, superAuthorize, validateMiddleware(CreateRoleDto), this.setRole);
        this.router.patch("/:id", authenticate, superAuthorize, validateMiddleware(UpdateRoleDto), this.updateRole);
        this.router.delete("/:id", authenticate, superAuthorize, this.deleteRole);
    }

    createRole = async (req: Request, res: ResponseWithLog, next: NextFunction) => {
        try {

            const newRole = await this.roleService.createRole(res.dto as CreateRoleDto);
            JsonResponseUtil.sendJsonResponse201(res, newRole);

        } catch (e) {
            next(e);
        }
    }

    getAllRoles = async (req: Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const roles = await this.roleService.getAllRoles();
            JsonResponseUtil.sendJsonResponse200(res, roles);
        } catch (e) {
            next(e);
        }
    }

    getRole = async (req: Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const roleId = req.params.id;
            const role = await this.roleService.getRole(roleId);
            JsonResponseUtil.sendJsonResponse200(res, role);
        } catch (e) {
            next(e);
        }
    }

    setRole = async (req: Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const roleId = req.params.id;
            await this.roleService.updateRole(roleId, res.dto as UpdateRoleDto);
            JsonResponseUtil.sendJsonResponse204(res);
        } catch (e) {
            next(e);
        }
    }

    updateRole = async (req: Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const roleId = req.params.id;
            await this.roleService.updateRole(roleId, res.dto as UpdateRoleDto);
            JsonResponseUtil.sendJsonResponse204(res);
        } catch (e) {
            next(e);
        }
    }

    deleteRole = async (req: Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const roleId = req.params.id;
            await this.roleService.deleteRole(roleId);
            JsonResponseUtil.sendJsonResponse204(res);
        } catch (e) {
            next(e);
        }
    }
}

export default RoleController;