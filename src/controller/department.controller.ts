import express, { NextFunction, Request } from "express"
import DepartmentService from "../service/department.service";
import CreateDepartmentDto from "../dto/create-department.dto";
import UpdateDepartmentDto from "../dto/update-department.dto";
import { JsonResponseUtil } from "../utils/json.response.util";
import authenticate from "../middleware/authenticate.middleware";
import { authorize, superAuthorize } from "../middleware/authorize.middleware";
import { ResponseWithLog } from "../utils/response.with.log";
import validateMiddleware from "../middleware/validate.middleware";

class DepartmentController {
    public router: express.Router;

    constructor(private departmentService: DepartmentService) {
        this.router = express.Router();
        this.router.post("/", authenticate, superAuthorize, validateMiddleware(CreateDepartmentDto), this.createDepartment);
        this.router.get("/", authenticate, authorize, this.getAllDepartments);
        this.router.get("/:id", authenticate, authorize, this.getDepartmentById);
        this.router.put("/:id", authenticate, superAuthorize, validateMiddleware(CreateDepartmentDto), this.setDepartment);
        this.router.patch("/:id", authenticate, superAuthorize, validateMiddleware(UpdateDepartmentDto), this.updateDepartment);
        this.router.delete("/:id", authenticate, superAuthorize, this.deleteDepartment);
    }

    createDepartment = async (req: Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const newDepartment = await this.departmentService.createDepartment(res.dto as CreateDepartmentDto);
            JsonResponseUtil.sendJsonResponse201(res, newDepartment);
        } catch (error) {
            next(error);
        }
    }

    getAllDepartments = async (req: Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const departments = await this.departmentService.getAllDepartments();
            JsonResponseUtil.sendJsonResponse200(res, departments);
        } catch (error) {
            next(error);
        }
    }

    getDepartmentById = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const departmentId = req.params.id;
            const department = await this.departmentService.getDepartmentById(departmentId);
            JsonResponseUtil.sendJsonResponse200(res, department);
        } catch (error) {
            next(error);
        }
    }

    setDepartment = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const departmentId = req.params.id;
            await this.departmentService.updateDepartment(departmentId, res.dto as UpdateDepartmentDto);
            JsonResponseUtil.sendJsonResponse204(res);
        } catch (error) {
            next(error);
        }
    }

    updateDepartment = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const departmentId = req.params.id;
            await this.departmentService.updateDepartment(departmentId, res.dto as UpdateDepartmentDto);
            JsonResponseUtil.sendJsonResponse204(res);
        } catch (error) {
            next(error);
        }
    }

    deleteDepartment = async (req: express.Request, res: ResponseWithLog, next: NextFunction) => {
        try {
            const departmentId = req.params.id;
            await this.departmentService.deleteDepartment(departmentId);
            JsonResponseUtil.sendJsonResponse204(res);
        } catch (error) {
            next(error);
        }
    }
}

export default DepartmentController;