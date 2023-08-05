import express, { NextFunction, Request, Response } from "express"
import DepartmentService from "../service/department.service";
import { plainToInstance } from "class-transformer";
import CreateDepartmentDto from "../dto/create-department.dto";
import { validate } from "class-validator";
import ValidationException from "../exception/validation.exception";
import UpdateDepartmentDto from "../dto/update-department.dto";
import { JsonResponseUtil } from "../utils/json.response.util";
import authenticate from "../middleware/authenticate.middleware";
import { authorize, superAuthorize } from "../middleware/authorize.middleware";
import { ResponseWithTrace } from "../utils/response.with.trace";

class DepartmentController {
    public router: express.Router;

    constructor(private departmentService: DepartmentService) {
        this.router = express.Router();
        this.router.post("/", authenticate, superAuthorize, this.createDepartment);
        this.router.get("/", authenticate, authorize, this.getAllDepartments);
        this.router.get("/:id", authenticate, authorize, this.getDepartmentById);
        this.router.put("/:id", authenticate, superAuthorize, this.setDepartment);
        this.router.patch("/:id", authenticate, superAuthorize, this.updateDepartment);
        this.router.delete("/:id", authenticate, superAuthorize, this.deleteDepartment);
    }

    createDepartment = async (req: Request, res: ResponseWithTrace, next: NextFunction) => {
        try {
            const startTime = new Date();
            const createDepartmentDto = plainToInstance(CreateDepartmentDto, req.body);
            const errors = await validate(createDepartmentDto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            } else {
                const newDepartment = await this.departmentService.createDepartment(createDepartmentDto);
                JsonResponseUtil.sendJsonResponse201(res, newDepartment, startTime);
            }
        } catch (error) {
            next(error);
        }
    }

    getAllDepartments = async (req: Request, res: ResponseWithTrace, next: NextFunction) => {
        try {
            const startTime = new Date();
            const departments = await this.departmentService.getAllDepartments();
            JsonResponseUtil.sendJsonResponse200(res, departments, startTime);
        } catch (error) {
            next(error);
        }
    }

    getDepartmentById = async (req: express.Request, res: ResponseWithTrace, next: NextFunction) => {
        try {
            const startTime = new Date();
            const departmentId = req.params.id;
            const department = await this.departmentService.getDepartmentById(departmentId);
            JsonResponseUtil.sendJsonResponse200(res, department, startTime);
        } catch (error) {
            next(error);
        }
    }

    setDepartment = async (req: express.Request, res: ResponseWithTrace, next: NextFunction) => {
        try {
            const startTime = new Date();
            const departmentId = req.params.id;
            const createDepartmentDto = plainToInstance(CreateDepartmentDto, req.body);
            const errors = await validate(createDepartmentDto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            } else {
                await this.departmentService.updateDepartment(departmentId, createDepartmentDto);
                JsonResponseUtil.sendJsonResponse204(res, startTime);
            }
        } catch (error) {
            next(error);
        }
    }

    updateDepartment = async (req: express.Request, res: ResponseWithTrace, next: NextFunction) => {
        try {
            const startTime = new Date();
            const departmentId = req.params.id;
            const updateDepartmentDto = plainToInstance(UpdateDepartmentDto, req.body);
            const errors = await validate(updateDepartmentDto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            } else {
                await this.departmentService.updateDepartment(departmentId, updateDepartmentDto);
                JsonResponseUtil.sendJsonResponse204(res, startTime);
            }
        } catch (error) {
            next(error);
        }
    }

    deleteDepartment = async (req: express.Request, res: ResponseWithTrace, next: NextFunction) => {
        try {
            const startTime = new Date();
            const departmentId = req.params.id;
            await this.departmentService.deleteDepartment(departmentId);
            JsonResponseUtil.sendJsonResponse204(res, startTime);
        } catch (error) {
            next(error);
        }
    }
}

export default DepartmentController;